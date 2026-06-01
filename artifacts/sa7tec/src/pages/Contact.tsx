import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useContent } from "@/lib/content-store";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CYAN = "#22d3ee";
const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#fff",
  borderRadius: "10px",
  padding: "0.75rem 1rem",
  fontSize: "0.9rem",
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

  const formSchema = z.object({
    name: z.string().min(2, t("contact.err_name")),
    email: z.string().email(t("contact.err_email")),
    projectType: z.string().min(1, t("contact.err_project")),
    budgetRange: z.string().min(1, t("contact.err_budget")),
    message: z.string().min(10, t("contact.err_message")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", projectType: "", budgetRange: "", message: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addSubmission(values);
    setIsSubmitted(true);
    toast({ title: t("contact.toast_sent"), description: t("contact.toast_sent_desc") });
  }

  return (
    <PublicLayout>
      <div
        style={{
          minHeight: "100vh", background: "#000",
          paddingTop: "120px", paddingBottom: "80px",
          padding: "120px 5vw 80px",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div style={{
          position: "absolute", top: "10%", right: "-10%",
          width: "50vw", height: "50vw",
          background: `radial-gradient(ellipse, rgba(34,211,238,0.05) 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", left: "-10%",
          width: "40vw", height: "40vw",
          background: `radial-gradient(ellipse, rgba(167,139,250,0.04) 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: "5rem" }}
          >
            <p style={{
              color: CYAN, fontSize: "0.65rem", letterSpacing: "0.35em",
              textTransform: "uppercase", fontFamily: "monospace", marginBottom: "1.5rem",
            }}>
              TRANSMIT — CONTACT
            </p>
            <h1 style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: 900, color: "#fff",
              letterSpacing: "-0.04em", lineHeight: 1.05,
              fontFamily: "'Outfit', sans-serif", margin: 0,
            }}>
              {t("contact.title_a")}{" "}
              <span style={{ color: CYAN }}>{t("contact.title_b")}</span>
            </h1>
            <p style={{
              color: "rgba(255,255,255,0.35)", fontSize: "1rem",
              lineHeight: 1.7, marginTop: "1.5rem", maxWidth: "540px",
            }}>
              {t("contact.subtitle")}
            </p>
          </motion.div>

          {/* Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "4rem",
            alignItems: "start",
          }}
          className="contact-grid"
          >
            {/* Left: contact info */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
            >
              {[
                { label: t("contact.email_us"), value: content.contactInfo.email, href: `mailto:${content.contactInfo.email}`, color: CYAN },
                { label: t("contact.call_us"), value: content.contactInfo.phone, href: `tel:${content.contactInfo.phone}`, color: "#a78bfa" },
                { label: t("contact.visit_us"), value: tr(content.contactInfo.address), href: undefined, color: "#34d399" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    borderLeft: `1px solid ${item.color}33`,
                    paddingLeft: "1.25rem",
                  }}
                >
                  <p style={{
                    color: "rgba(255,255,255,0.3)", fontSize: "0.65rem",
                    letterSpacing: "0.2em", textTransform: "uppercase",
                    fontFamily: "monospace", marginBottom: "0.5rem",
                  }}>
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      style={{
                        color: "#fff", fontWeight: 600, fontSize: "0.9rem",
                        textDecoration: "none", fontFamily: "'Outfit', sans-serif",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = item.color)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p style={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem", margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                      {item.value}
                    </p>
                  )}
                </div>
              ))}

              {/* Socials */}
              <div style={{ marginTop: "1rem" }}>
                <p style={{
                  color: "rgba(255,255,255,0.2)", fontSize: "0.65rem",
                  letterSpacing: "0.25em", textTransform: "uppercase",
                  fontFamily: "monospace", marginBottom: "1rem",
                }}>
                  SIGNAL
                </p>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  {[
                    { name: "Twitter", href: content.contactInfo.social.twitter },
                    { name: "LinkedIn", href: content.contactInfo.social.linkedin },
                    { name: "Instagram", href: content.contactInfo.social.instagram },
                  ].map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "rgba(255,255,255,0.3)",
                        fontSize: "0.75rem", textDecoration: "none",
                        letterSpacing: "0.1em", fontFamily: "monospace",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = CYAN)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
                    >
                      {s.name} ↗
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: form */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    padding: "5rem 2rem", textAlign: "center",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "16px",
                    background: "rgba(255,255,255,0.02)",
                    minHeight: "400px",
                  }}
                >
                  <div style={{
                    width: "64px", height: "64px", borderRadius: "50%",
                    background: `${CYAN}18`, border: `1px solid ${CYAN}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "1.5rem",
                  }}>
                    <CheckCircle2 style={{ color: CYAN, width: "28px", height: "28px" }} />
                  </div>
                  <h3 style={{
                    fontSize: "1.75rem", fontWeight: 800, color: "#fff",
                    fontFamily: "'Outfit', sans-serif", marginBottom: "0.75rem",
                  }}>
                    {t("contact.success_title")}
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "2rem" }}>
                    {t("contact.success_desc")}
                  </p>
                  <button
                    onClick={() => { setIsSubmitted(false); form.reset(); }}
                    style={{
                      background: "transparent",
                      border: `1px solid ${CYAN}44`,
                      color: CYAN, padding: "0.6rem 1.5rem",
                      borderRadius: "9999px", cursor: "pointer",
                      fontSize: "0.875rem", fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    {t("contact.send_another")}
                  </button>
                </motion.div>
              ) : (
                <div
                  style={{
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "16px",
                    background: "rgba(255,255,255,0.02)",
                    padding: "clamp(1.5rem, 4vw, 3rem)",
                  }}
                >
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="form-2col">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "monospace" }}>
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
                              <FormLabel style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "monospace" }}>
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

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="form-2col">
                        <FormField
                          control={form.control}
                          name="projectType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "monospace" }}>
                                {t("contact.project_type")}
                              </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="universe-select" style={inputStyle}>
                                    <SelectValue placeholder={t("contact.placeholder_select_service")} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent style={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)" }}>
                                  {content.services.map((s) => {
                                    const label = typeof s.title === "string" ? s.title : s.title.en;
                                    return <SelectItem key={s.id} value={label} style={{ color: "#fff" }}>{label}</SelectItem>;
                                  })}
                                  <SelectItem value="Other" style={{ color: "#fff" }}>{t("contact.other")}</SelectItem>
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
                              <FormLabel style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "monospace" }}>
                                {t("contact.budget")}
                              </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="universe-select" style={inputStyle}>
                                    <SelectValue placeholder={t("contact.placeholder_select_range")} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent style={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)" }}>
                                  <SelectItem value="<10k" style={{ color: "#fff" }}>Under $10,000</SelectItem>
                                  <SelectItem value="10k-25k" style={{ color: "#fff" }}>$10,000 – $25,000</SelectItem>
                                  <SelectItem value="25k-50k" style={{ color: "#fff" }}>$25,000 – $50,000</SelectItem>
                                  <SelectItem value="50k+" style={{ color: "#fff" }}>$50,000+</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage style={{ color: "#f87171", fontSize: "0.75rem" }} />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "monospace" }}>
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

                      <button
                        type="submit"
                        style={{
                          background: CYAN, color: "#000",
                          padding: "0.875rem 2rem",
                          borderRadius: "9999px", fontWeight: 700,
                          fontSize: "0.9rem", letterSpacing: "0.05em",
                          border: "none", cursor: "pointer",
                          fontFamily: "'Outfit', sans-serif",
                          alignSelf: "flex-start",
                          transition: "transform 0.15s, box-shadow 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.03)";
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 30px rgba(34,211,238,0.35)`;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                        }}
                      >
                        {t("contact.send")} →
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
  );
}
