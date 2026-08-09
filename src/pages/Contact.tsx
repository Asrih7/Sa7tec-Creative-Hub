import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Seo } from "@/components/Seo";
import { useContent } from "@/lib/content-store";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CheckCircle2, AlertCircle, Linkedin, Instagram } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { normalizeInput, RateLimiter, validateContactForm } from "@/lib/security";

const CYAN = "#22d3ee";

// EmailJS Configuration
const EJ_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim() ?? "";
const EJ_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim() ?? "";
const EJ_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim() ?? "";
// Versioned key prevents stale limits from older local builds from blocking testing.
const contactRateLimiter = new RateLimiter(
  "sa7tec_contact_attempts_v2",
  Number(import.meta.env.VITE_CONTACT_FORM_RATE_LIMIT || 5),
  Number(import.meta.env.VITE_CONTACT_FORM_RATE_WINDOW || 3600000),
);

type EmailJsClient = {
  init: (publicKey: string) => void;
  send: (
    serviceId: string,
    templateId: string,
    params: Record<string, string>,
  ) => Promise<{ status: number; text: string }>;
};

function getEmailJs() {
  return (window as Window & { emailjs?: EmailJsClient }).emailjs;
}

const inputStyle: React.CSSProperties = {
  background: "var(--s7-input-bg)",
  border: "1px solid var(--s7-border-2)",
  color: "var(--s7-fg)",
  borderRadius: "10px",
  padding: "0.75rem 1rem",
  fontSize: "1rem",
  width: "100%",
  outline: "none",
  fontFamily: "'Outfit', sans-serif",
  transition: "border-color 0.2s",
};

export default function Contact() {
  const { content, addSubmission } = useContent();
  const { toast } = useToast();
  const { t, tr } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [emailJsReady, setEmailJsReady] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const formStartedAt = useRef(Date.now());

  // Initialize EmailJS
  useEffect(() => {
    const initEmailJS = () => {
      if (!EJ_PUBLIC_KEY || !EJ_SERVICE_ID || !EJ_TEMPLATE_ID) {
        console.warn(
          "EmailJS is not configured. Set VITE_EMAILJS_PUBLIC_KEY, VITE_EMAILJS_SERVICE_ID, and VITE_EMAILJS_TEMPLATE_ID.",
        );
        setEmailJsReady(false);
        return;
      }

      const existingClient = getEmailJs();
      if (existingClient) {
        existingClient.init(EJ_PUBLIC_KEY);
        setEmailJsReady(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
      script.async = true;
      script.crossOrigin = "anonymous";
      script.referrerPolicy = "no-referrer";
      script.onload = () => {
        const client = getEmailJs();
        if (!client) {
          setEmailJsReady(false);
          return;
        }
        client.init(EJ_PUBLIC_KEY);
        setEmailJsReady(true);
      };
      script.onerror = () => {
        console.warn("EmailJS failed to load");
        setEmailJsReady(false);
      };
      document.head.appendChild(script);
    };

    initEmailJS();
  }, []);

  const formSchema = z.object({
    name: z.string().min(2, t("contact.err_name")).max(100),
    email: z.string().email(t("contact.err_email")).max(254),
    projectType: z.string().min(1, t("contact.err_project")).max(80),
    budgetRange: z.string().min(1, t("contact.err_budget")).max(40),
    message: z.string().min(10, t("contact.err_message")).max(5000),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", projectType: "", budgetRange: "", message: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSubmitError(null);

    try {
      // Trap simple bots that fill every field and reject unrealistically fast submits.
      if (honeypot.trim() || Date.now() - formStartedAt.current < 1500) {
        throw new Error("Please take a moment to review your message before sending.");
      }

      const safeValues = {
        name: normalizeInput(values.name, 100),
        email: normalizeInput(values.email, 254).toLowerCase(),
        projectType: normalizeInput(values.projectType, 80),
        budgetRange: normalizeInput(values.budgetRange, 40),
        message: normalizeInput(values.message, 5000),
      };

      const validation = validateContactForm(safeValues);
      if (!validation.valid) {
        throw new Error(validation.errors[0] || "Invalid form data.");
      }

      // Count only valid submission attempts, not incomplete/invalid form retries.
      if (!contactRateLimiter.isAllowed()) {
        const nextAllowedAt = contactRateLimiter.getNextAllowedTime();
        const waitMinutes = Math.max(1, Math.ceil((nextAllowedAt - Date.now()) / 60000));
        throw new Error(`Too many submissions. Please try again in about ${waitMinutes} minute${waitMinutes === 1 ? "" : "s"}.`);
      }

      // Store submission locally for the admin panel backup.
      addSubmission(safeValues);

      const emailjs = getEmailJs();
      if (!emailJsReady || !emailjs) {
        const subject = `New project enquiry from ${safeValues.name}`;
        const body = [
          `Name: ${safeValues.name}`,
          `Email: ${safeValues.email}`,
          `Project type: ${safeValues.projectType}`,
          `Budget: ${safeValues.budgetRange}`,
          "",
          safeValues.message,
        ].join("\n");
        window.location.href = `mailto:${content.contactInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setIsSubmitted(true);
        toast({
          title: "Your email app is ready",
          description: `Continue sending the message to ${content.contactInfo.email}.`,
        });
        return;
      }

      const response = await emailjs.send(EJ_SERVICE_ID, EJ_TEMPLATE_ID, {
        to_email: content.contactInfo.email,
        to_name: "SA7TEC",
        name: safeValues.name,
        email: safeValues.email,
        from_name: safeValues.name,
        from_email: safeValues.email,
        reply_to: safeValues.email,
        user_email: safeValues.email,
        company: safeValues.budgetRange || "N/A",
        budget_range: safeValues.budgetRange || "N/A",
        enquiry_type: safeValues.projectType || "General",
        project_type: safeValues.projectType || "General",
        message: safeValues.message,
        sent_at: new Date().toISOString(),
        website: window.location.origin,
      });

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Email service rejected the message: ${response.text || response.status}`);
      }

      setIsSubmitted(true);
      setHoneypot("");
      formStartedAt.current = Date.now();
      toast({
        title: "Email sent",
        description: `Your message was sent to ${content.contactInfo.email}.`,
      });
    } catch (error) {
      console.error("Form submission error:", error);
      const message =
        error instanceof Error ? error.message : "An error occurred. Please try again.";
      setSubmitError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Seo
        title="Contact SA7TEC | Digital Product Studio"
        description="Tell SA7TEC about your app, game, AI, SaaS, or custom software idea and start the conversation."
        path="/contact"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Contact SA7TEC",
          url: "https://sa7tec.com/contact",
          description:
            "Contact SA7TEC to discuss your product idea and start a digital product engagement.",
        }}
      />
      <PublicLayout>
        <div
          className="contact-page"
          style={{
            minHeight: "100vh",
            background: "var(--s7-bg)",
            padding: "120px 5vw 80px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Ambient glows */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "10%",
              right: "-10%",
              width: "50vw",
              height: "50vw",
              background: `radial-gradient(ellipse, var(--s7-glow-cyan) 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "10%",
              left: "-10%",
              width: "40vw",
              height: "40vw",
              background: `radial-gradient(ellipse, var(--s7-glow-violet) 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ marginBottom: "5rem" }}
            >
              <p
                style={{
                  color: CYAN,
                  fontSize: "0.65rem",
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  fontFamily: "monospace",
                  marginBottom: "1.5rem",
                }}
              >
                TRANSMIT — CONTACT
              </p>
              <h1
                style={{
                  fontSize: "clamp(2rem, 4.4vw, 3.4rem)",
                  fontWeight: 900,
                  color: "var(--s7-fg)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.08,
                  fontFamily: "'Outfit', sans-serif",
                  margin: 0,
                }}
              >
                {t("contact.title_a")} <span style={{ color: CYAN }}>{t("contact.title_b")}</span>
              </h1>
              <p
                style={{
                  color: "var(--s7-fg-dim)",
                  fontSize: "1rem",
                  lineHeight: 1.78,
                  marginTop: "1.5rem",
                  maxWidth: "620px",
                }}
              >
                {t("contact.subtitle")}
              </p>
            </motion.div>

            {/* Grid */}
            <div className="contact-grid">
              {/* Left: contact info */}
              <motion.div
                className="contact-info-panel"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
              >
                {[
                  {
                    label: t("contact.email_us"),
                    value: content.contactInfo.email,
                    href: `mailto:${content.contactInfo.email}`,
                    color: CYAN,
                  },
                  {
                    label: t("contact.call_us"),
                    value: content.contactInfo.phone,
                    href: `tel:${content.contactInfo.phone}`,
                    color: "#a78bfa",
                  },
                  {
                    label: t("contact.visit_us"),
                    value: tr(content.contactInfo.address),
                    href: undefined,
                    color: "#34d399",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{ borderLeft: `1px solid ${item.color}33`, paddingLeft: "1.25rem" }}
                  >
                    <p
                      style={{
                        color: "var(--s7-fg-muted)",
                        fontSize: "0.85rem",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        fontFamily: "monospace",
                        fontWeight: 600,
                        marginBottom: "0.5rem",
                      }}
                    >
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        style={{
                          color: "var(--s7-fg)",
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          textDecoration: "none",
                          fontFamily: "'Outfit', sans-serif",
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = item.color)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--s7-fg)")}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p
                        style={{
                          color: "var(--s7-fg)",
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          margin: 0,
                          fontFamily: "'Outfit', sans-serif",
                        }}
                      >
                        {item.value}
                      </p>
                    )}
                  </div>
                ))}

                {/* Socials */}
                <div style={{ marginTop: "1rem" }}>
                  <p
                    style={{
                      color: "var(--s7-fg-muted)",
                      fontSize: "0.65rem",
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      fontFamily: "monospace",
                      marginBottom: "1rem",
                    }}
                  >
                    SIGNAL
                  </p>
                  <div className="contact-social-links">
                    {[
                      {
                        icon: <Linkedin size={18} />,
                        label: "LinkedIn",
                        href: content.contactInfo.social.linkedin,
                      },
                      {
                        icon: <Instagram size={18} />,
                        label: "Instagram",
                        href: content.contactInfo.social.instagram,
                      },
                    ].map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        referrerPolicy="no-referrer"
                        aria-label={social.label}
                        title={social.label}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Right: form */}
              <motion.div
                className="contact-form-panel"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    role="status"
                    aria-live="polite"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "5rem 2rem",
                      textAlign: "center",
                      border: "1px solid var(--s7-border)",
                      borderRadius: "16px",
                      background: "var(--s7-card-bg)",
                      minHeight: "400px",
                    }}
                  >
                    <div
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "50%",
                        background: `${CYAN}18`,
                        border: `1px solid ${CYAN}44`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <CheckCircle2 style={{ color: CYAN, width: "28px", height: "28px" }} />
                    </div>
                    <h3
                      style={{
                        fontSize: "1.75rem",
                        fontWeight: 800,
                        color: "var(--s7-fg)",
                        fontFamily: "'Outfit', sans-serif",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {t("contact.success_title")}
                    </h3>
                    <p
                      style={{
                        color: "var(--s7-fg-dim)",
                        fontSize: "0.95rem",
                        lineHeight: 1.6,
                        marginBottom: "2rem",
                      }}
                    >
                      {t("contact.success_desc")}
                    </p>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        form.reset();
                      }}
                      style={{
                        background: "transparent",
                        border: `1px solid ${CYAN}44`,
                        color: CYAN,
                        padding: "0.6rem 1.5rem",
                        borderRadius: "9999px",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        fontFamily: "'Outfit', sans-serif",
                      }}
                    >
                      {t("contact.send_another")}
                    </button>
                  </motion.div>
                ) : (
                  <div
                    style={{
                      border: "1px solid var(--s7-border)",
                      borderRadius: "16px",
                      background: "var(--s7-card-bg)",
                      padding: "clamp(1.5rem, 4vw, 3rem)",
                    }}
                  >
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
                      >
                        <div
                          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}
                          className="form-2col"
                        >
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  style={{
                                    color: "var(--s7-fg-dim)",
                                    fontSize: "0.88rem",
                                    letterSpacing: "0.14em",
                                    textTransform: "uppercase",
                                    fontFamily: "monospace",
                                    fontWeight: 600,
                                  }}
                                >
                                  {t("contact.full_name")}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("contact.placeholder_name")}
                                    style={inputStyle}
                                    className="universe-input"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage style={{ color: "#f87171", fontSize: "0.75rem" }} />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  style={{
                                    color: "var(--s7-fg-dim)",
                                    fontSize: "0.88rem",
                                    letterSpacing: "0.14em",
                                    textTransform: "uppercase",
                                    fontFamily: "monospace",
                                    fontWeight: 600,
                                  }}
                                >
                                  {t("contact.email")}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("contact.placeholder_email")}
                                    type="email"
                                    dir="ltr"
                                    style={inputStyle}
                                    className="universe-input"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage style={{ color: "#f87171", fontSize: "0.75rem" }} />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div
                          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}
                          className="form-2col"
                        >
                          <FormField
                            control={form.control}
                            name="projectType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  style={{
                                    color: "var(--s7-fg-dim)",
                                    fontSize: "0.88rem",
                                    letterSpacing: "0.14em",
                                    textTransform: "uppercase",
                                    fontFamily: "monospace",
                                    fontWeight: 600,
                                  }}
                                >
                                  {t("contact.project_type")}
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger style={inputStyle}>
                                      <SelectValue
                                        placeholder={t("contact.placeholder_select_service")}
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent
                                    style={{
                                      background: "var(--s7-bg-alt)",
                                      border: "1px solid var(--s7-border)",
                                    }}
                                  >
                                    {content.services.map((s) => {
                                      const label =
                                        typeof s.title === "string" ? s.title : s.title.en;
                                      return (
                                        <SelectItem
                                          key={s.id}
                                          value={label}
                                          style={{ color: "var(--s7-fg)" }}
                                        >
                                          {label}
                                        </SelectItem>
                                      );
                                    })}
                                    <SelectItem value="Other" style={{ color: "var(--s7-fg)" }}>
                                      {t("contact.other")}
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage style={{ color: "#f87171", fontSize: "0.75rem" }} />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="budgetRange"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  style={{
                                    color: "var(--s7-fg-dim)",
                                    fontSize: "0.88rem",
                                    letterSpacing: "0.14em",
                                    textTransform: "uppercase",
                                    fontFamily: "monospace",
                                    fontWeight: 600,
                                  }}
                                >
                                  {t("contact.budget")}
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger style={inputStyle}>
                                      <SelectValue
                                        placeholder={t("contact.placeholder_select_range")}
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent
                                    style={{
                                      background: "var(--s7-bg-alt)",
                                      border: "1px solid var(--s7-border)",
                                    }}
                                  >
                                    <SelectItem value="<10k" style={{ color: "var(--s7-fg)" }}>
                                      Under $10,000
                                    </SelectItem>
                                    <SelectItem value="10k-25k" style={{ color: "var(--s7-fg)" }}>
                                      $10,000 – $25,000
                                    </SelectItem>
                                    <SelectItem value="25k-50k" style={{ color: "var(--s7-fg)" }}>
                                      $25,000 – $50,000
                                    </SelectItem>
                                    <SelectItem value="50k+" style={{ color: "var(--s7-fg)" }}>
                                      $50,000+
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage style={{ color: "#f87171", fontSize: "0.75rem" }} />
                              </FormItem>
                            )}
                          />
                        </div>

                        <input
                          type="text"
                          name="website"
                          value={honeypot}
                          onChange={(event) => setHoneypot(event.target.value)}
                          tabIndex={-1}
                          autoComplete="off"
                          aria-hidden="true"
                          style={{
                            position: "absolute",
                            left: "-10000px",
                            width: "1px",
                            height: "1px",
                            opacity: 0,
                            pointerEvents: "none",
                          }}
                        />

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                style={{
                                  color: "var(--s7-fg-dim)",
                                  fontSize: "0.88rem",
                                  letterSpacing: "0.14em",
                                  textTransform: "uppercase",
                                  fontFamily: "monospace",
                                  fontWeight: 600,
                                }}
                              >
                                {t("contact.message")}
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder={t("contact.placeholder_message")}
                                  style={{ ...inputStyle, minHeight: "140px", resize: "none" }}
                                  className="universe-input"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage style={{ color: "#f87171", fontSize: "0.75rem" }} />
                            </FormItem>
                          )}
                        />

                        {submitError && (
                          <div
                            role="alert"
                            style={{
                              display: "flex",
                              gap: "0.75rem",
                              alignItems: "center",
                              padding: "0.75rem 1rem",
                              borderRadius: "8px",
                              background: "#dc26263d",
                              border: "1px solid #dc2626",
                              color: "#fca5a5",
                            }}
                          >
                            <AlertCircle size={18} />
                            <span style={{ fontSize: "0.9rem" }}>{submitError}</span>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={isLoading}
                          style={{
                            background: isLoading ? "rgba(34, 211, 238, 0.5)" : CYAN,
                            color: "#000",
                            padding: "0.875rem 2rem",
                            borderRadius: "9999px",
                            fontWeight: 700,
                            fontSize: "0.9rem",
                            letterSpacing: "0.05em",
                            border: "none",
                            cursor: isLoading ? "not-allowed" : "pointer",
                            fontFamily: "'Outfit', sans-serif",
                            alignSelf: "flex-start",
                            transition: "transform 0.15s, box-shadow 0.15s, background 0.2s",
                            opacity: isLoading ? 0.7 : 1,
                          }}
                          onMouseEnter={(e) => {
                            if (!isLoading) {
                              (e.currentTarget as HTMLButtonElement).style.transform =
                                "scale(1.03)";
                              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                                `0 0 30px rgba(34,211,238,0.35)`;
                            }
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                            (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                          }}
                        >
                          {isLoading ? "Sending..." : t("contact.send")} {!isLoading && "→"}
                        </button>
                      </form>
                    </Form>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </PublicLayout>
    </>
  );
}
