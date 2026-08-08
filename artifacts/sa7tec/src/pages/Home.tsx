import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import {
  ArrowUpRight,
  BrainCircuit,
  Cloud,
  Code2,
  Cpu,
  Database,
  MonitorSmartphone,
  PenTool,
  Gamepad2,
  Globe2,
  Instagram,
  Layers3,
  Linkedin,
  Mail,
  MapPin,
  Palette,
  Phone,
  Play,
  Rocket,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Seo } from "@/components/Seo";
import { useContent } from "@/lib/content-store";
import { useLanguage } from "@/lib/i18n";
import type { LocalizedString } from "@/lib/i18n";
import { assetSrc } from "@/lib/assets";
import { TiltCard } from "@/components/ui/tilt-card";
import { SectionWrapper } from "@/components/ui/section-wrapper";

const ACCENTS = ["#22d3ee", "#a78bfa", "#34d399", "#fbbf24", "#f472b6", "#fb923c", "#60a5fa", "#14b8a6"];

function sourceText(value: LocalizedString) {
  return typeof value === "string" ? value : value.en;
}

function mediumImageFallback(imageUrl: string) {
  const filename = imageUrl.split("/").pop();
  return filename ? `https://miro.medium.com/v2/resize:fit:1024/${filename}` : "";
}

const iconMap = {
  Gamepad2,
  Smartphone,
  Code2,
  Globe: Globe2,
  Cloud,
  ShoppingCart,
  Zap,
  Palette,
  Rocket,
} as const;

// The editor can choose an icon name, but the public feature grid must never
// repeat a glyph: it makes scanning the offer much harder.
const serviceIcons = [Gamepad2, Smartphone, Code2, Globe2, Cloud, ShoppingCart, Zap, Palette, Rocket, Cpu, Database, MonitorSmartphone, PenTool];

function useCountUp(value: string, active: boolean) {
  const numeric = Number.parseFloat(value.replace(/[^\d.]/g, ""));
  const suffix = value.replace(/[\d.]/g, "");
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current || Number.isNaN(numeric)) return;
    started.current = true;
    const start = performance.now();
    const duration = 1800;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(numeric * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [active, numeric]);

  if (Number.isNaN(numeric)) return value;
  if (!active) return value;
  // Keep the published value visible until the animation has advanced. This
  // avoids a misleading flash of "0+", "0M+", or "0.0" on entry.
  if (count <= 0) return value;
  const formatted = numeric % 1 === 0 ? Math.round(count).toLocaleString() : count.toFixed(1);
  return `${formatted}${suffix}`;
}

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 42 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionIntro({
  eyebrow,
  title,
  body,
  align = "split",
}: {
  eyebrow: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  align?: "split" | "center";
}) {
  return (
    <Reveal className={`s7-section-intro ${align === "center" ? "is-center" : ""}`}>
      <div>
        <p className="s7-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {body ? <p>{body}</p> : null}
    </Reveal>
  );
}

function MagneticAura() {
  const reduceMotion = useReducedMotion();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduceMotion) return;
    const onMove = (event: MouseEvent) => {
      setMouse({
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduceMotion]);

  return (
    <div className="s7-ambient" aria-hidden="true">
      <motion.div
        className="s7-orbit s7-orbit-a"
        animate={reduceMotion ? undefined : { x: mouse.x * 22, y: mouse.y * 14 }}
        transition={{ type: "spring", stiffness: 55, damping: 24 }}
      />
      <motion.div
        className="s7-orbit s7-orbit-b"
        animate={reduceMotion ? undefined : { x: mouse.x * -16, y: mouse.y * -18 }}
        transition={{ type: "spring", stiffness: 45, damping: 26 }}
      />
      <div className="s7-grid" />
    </div>
  );
}

function Hero() {
  const { t, tr } = useLanguage();
  const { content } = useContent();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.25], [0, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.22], [1, 0.35]);
  const services = content.services.slice(0, 4);

  return (
    <section id="home" className="s7-hero">
      <MagneticAura />
      <motion.div className="s7-hero-inner" style={{ y, opacity }}>
        <div className="s7-hero-copygroup">
          <motion.p
            className="s7-kicker"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t("home.year")} / {t("home.tagline")}
          </motion.p>

          <motion.div
            className="s7-hero-copy"
            initial={{ opacity: 0, y: 54 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="s7-hero-label">{content.siteInfo.title}</p>
            <h1>{tr(content.siteInfo.heroHeadline)}</h1>
            <p>{tr(content.siteInfo.heroSubheadline)}</p>
          </motion.div>

          <motion.div
            className="s7-hero-actions"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            <Link href="/contact" className="s7-button s7-button-primary">
              {t("home.cta_project")}
              <ArrowUpRight size={18} />
            </Link>
            <a href="#projects" className="s7-button s7-button-ghost">
              <Play size={16} />
              View published work
            </a>
          </motion.div>
          <motion.p
            className="s7-hero-copy-note"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.56 }}
          >
            We help product founders, startups, and agencies ship modern mobile, web, and AI-driven experiences.
          </motion.p>

          <motion.div
            className="s7-hero-strip"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.48 }}
          >
            {services.map((service, index) => {
              const Icon = iconMap[service.iconName as keyof typeof iconMap] ?? Layers3;
              return (
                <div key={service.id}>
                  <Icon size={17} color={ACCENTS[index % ACCENTS.length]} />
                  <span>{tr(service.title)}</span>
                </div>
              );
            })}
          </motion.div>
        </div>

        <motion.div
          className="s7-hero-visual"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="s7-visual-card">
            <div className="s7-visual-brand">
              <img src={assetSrc("/assets/sa7tec-logo.jpg")} alt="SA7TEC" loading="lazy" decoding="async" />
              <div>
                <strong>SA7TEC</strong>
                <span>Product studio</span>
              </div>
            </div>
            <div className="s7-visual-mockup">
              <div className="s7-visual-device">
                <div className="s7-device-top">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="s7-device-screen">
                  <img
                    src={assetSrc("/assets/medium-projects/deviceframe-pro.png")}
                    alt="Product preview"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="s7-device-status">
                    <span>Live preview</span>
                    <strong>92% task completion</strong>
                  </div>
                </div>
              </div>
              <div className="s7-visual-band">
                <span>Mobile-first UX</span>
                <span>Scalable SaaS</span>
                <span>AI-powered flows</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      <div className="s7-scroll-cue" aria-hidden="true">
        <span>{t("home.scroll")}</span>
        <i />
      </div>
    </section>
  );
}

function StudioManifesto() {
  const { t, tr } = useLanguage();
  const { content } = useContent();
  const pillars = [
    { icon: Smartphone, title: t("home.prop1_title"), body: t("home.prop1_desc") },
    { icon: Layers3, title: t("home.prop2_title"), body: t("home.prop2_desc") },
    { icon: Globe2, title: t("home.prop3_title"), body: t("home.prop3_desc") },
  ];

  return (
    <SectionWrapper>
      <section id="studio" className="s7-section s7-manifesto">
        <SectionIntro
          eyebrow={t("home.manifesto_id")}
          title={
            <>
              {t("home.manifesto_1")} <span>{t("home.manifesto_2")}</span>
            </>
          }
          body={tr(content.siteInfo.aboutText)}
        />
        <div className="s7-manifesto-grid">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <Reveal key={pillar.title} delay={index * 0.08}>
                <article>
                  <div className="s7-manifesto-icon">
                    <Icon size={32} />
                  </div>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.body}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>
    </SectionWrapper>
  );
}

function ServicesDeepDive() {
  const { t, tr } = useLanguage();
  const { content } = useContent();

  return (
    <SectionWrapper>
      <section id="services" className="s7-section s7-services">
        <SectionIntro
          eyebrow={t("section.what_we_build")}
          title={
            <>
              Product teams for <span>ambitious builds.</span>
            </>
          }
          body={t("section.what_we_build_sub")}
        />

        <div className="s7-service-grid">
          {content.services.filter((service) => tr(service.title).trim() && tr(service.description).trim()).map((service, index) => {
            const Icon = serviceIcons[index % serviceIcons.length];
            const color = service.color.startsWith("#") ? service.color : ACCENTS[index % ACCENTS.length];
            return (
              <Reveal key={service.id} delay={Math.min(index * 0.04, 0.24)}>
                <TiltCard className="h-full">
                  <motion.article
                    className="s7-service-card h-full"
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.24, ease: "easeOut" }}
                  >
                    <div className="s7-service-card-top">
                      <div className="s7-service-icon" style={{ color, background: `${color}16` }}>
                        <Icon size={22} />
                      </div>
                    </div>
                    <h3>{tr(service.title)}</h3>
                    <p>{tr(service.description)}</p>
                  </motion.article>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </section>
    </SectionWrapper>
  );
}

function WorkShowcase() {
  const { t } = useLanguage();
  const { content } = useContent();
  const mediumProjects = content.portfolioItems.filter(
    (item) => item.linkUrl && item.imageUrl && sourceText(item.title).trim() && sourceText(item.description).trim(),
  );

  if (!mediumProjects.length) return null;

  return (
    <section id="projects" className="s7-section s7-work">
      <SectionIntro
        eyebrow={t("section.portfolio")}
        title={
          <>
            Published <span>Medium projects.</span>
          </>
        }
        body="Real articles and product writeups from the SA7TEC Medium portfolio, using their published images and source links."
      />
      <div className="s7-work-grid">
        {mediumProjects.map((item, index) => {
          return (
            <Reveal key={item.id} delay={index * 0.05}>
              <motion.article className="s7-work-card" whileHover={{ y: -8, scale: 1.01 }}>
                <div className="s7-work-media">
                  <img
                    src={assetSrc(item.imageUrl)}
                    alt={sourceText(item.title)}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={(event) => {
                      const fallback = mediumImageFallback(item.imageUrl);
                      if (fallback && event.currentTarget.src !== fallback) {
                        event.currentTarget.src = fallback;
                      }
                    }}
                  />
                  <div className="s7-work-overlay">
                    <span className="s7-work-pill">{sourceText(item.category)}</span>
                  </div>
                </div>
                <div className="s7-work-body">
                  <div className="s7-work-meta">
                    <span>{sourceText(item.category)}</span>
                    <span className="s7-work-badge">Medium</span>
                  </div>
                  <h3>{sourceText(item.title)}</h3>
                  <p>{sourceText(item.description)}</p>
                  <a className="s7-work-link" href={item.linkUrl} target="_blank" rel="noreferrer">
                    <span>Read Project</span>
                    <ArrowUpRight size={18} />
                  </a>
                </div>
              </motion.article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function Capabilities() {
  const { t } = useLanguage();
  const capabilities = [
    [t("home.cap_games"), t("home.cap_games_desc"), Gamepad2],
    [t("home.cap_ecom"), t("home.cap_ecom_desc"), ShoppingCart],
    [t("home.cap_edu"), t("home.cap_edu_desc"), BrainCircuit],
    [t("home.cap_health"), t("home.cap_health_desc"), ShieldCheck],
    [t("home.cap_custom"), t("home.cap_custom_desc"), Layers3],
    [t("home.cap_design"), t("home.cap_design_desc"), Palette],
  ] as const;

  return (
    <section id="capabilities" className="s7-section s7-capabilities">
      <SectionIntro
        eyebrow={t("home.cap_id")}
        title={
          <>
            {t("home.cap_headline")} <span>{t("home.cap_think")}</span>
          </>
        }
        body="Strategy, UX, engineering, motion, systems thinking, and operational polish connect across every SA7TEC engagement."
      />
      <div className="s7-capability-grid">
        {capabilities.map(([title, body, Icon], index) => (
          <Reveal key={title} delay={index * 0.05}>
            <article>
              <div className="s7-capability-icon" style={{ background: `${ACCENTS[index % ACCENTS.length]}22`, color: ACCENTS[index % ACCENTS.length] }}>
                <Icon size={24} />
              </div>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function NumbersAndAbout() {
  const { t, tr } = useLanguage();
  const { content } = useContent();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="numbers" className="s7-section s7-numbers" ref={ref}>
      <div className="s7-numbers-head">
        <p className="s7-eyebrow">{t("home.numbers_id")}</p>
        <h2>
          Proof of momentum, <span>without losing craft.</span>
        </h2>
      </div>
      <div className="s7-stat-grid">
        {content.stats.filter((stat) => tr(stat.label).trim()).map((stat, index) => (
          <StatCard
            key={stat.id}
            id={stat.id}
            value={stat.value}
            label={tr(stat.label)}
            active={inView}
            color={ACCENTS[index % ACCENTS.length]}
          />
        ))}
      </div>
      <Reveal>
        <div className="s7-about-panel">
          <div>
            <p className="s7-eyebrow">About SA7TEC</p>
            <h3>{tr(content.siteInfo.heroHeadline)}</h3>
          </div>
          <p>{tr(content.siteInfo.aboutText)}</p>
        </div>
      </Reveal>
    </section>
  );
}

function StatCard({ id, value, label, active, color }: { id?: string; value: string; label: string; active: boolean; color: string }) {
  // Provide sensible fallbacks when admin/content contains empty or zero values
  const normalized = (val: string) => (typeof val === "string" ? val.trim() : "");
  let displayValue = normalized(value);

  const looksLikeZero = displayValue === "" || /^0(\D|$)/.test(displayValue);
  if (looksLikeZero) {
    if (id === "s1") displayValue = "50+";
    else if (id === "s2") displayValue = "1M+";
    else if (id === "s3") displayValue = "4.9";
    else displayValue = "50+";
  }

  const count = useCountUp(displayValue, active);
  return (
    <article>
      <strong>{count}</strong>
      <span>{label}</span>
      <i style={{ background: color }} />
    </article>
  );
}

function Testimonials() {
  const { tr } = useLanguage();
  const { content } = useContent();
  if (!content.testimonials.length) return null;

  return (
    <section className="s7-section s7-testimonials">
      <div className="s7-marquee" aria-hidden="true">
        <span>SA7TEC / PRODUCT STUDIO / MOBILE / GAMES / AI / SAAS / CUSTOM SOFTWARE / </span>
      </div>
      <div className="s7-testimonial-grid">
        {content.testimonials.filter((item) => item.name.trim() && tr(item.quote).trim()).map((item, index) => (
          <Reveal key={item.id} delay={index * 0.08}>
            <article>
              <p>"{tr(item.quote)}"</p>
              <div>
                <strong>{item.name}</strong>
                <span>
                  {tr(item.role)} / {item.company}
                </span>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ContactFooter() {
  const { t, tr } = useLanguage();
  const { content } = useContent();
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="s7-footer">
      <div className="s7-footer-cta">
        <Reveal>
          <p className="s7-eyebrow">{t("home.transmit_id")}</p>
          <h2>
            {t("home.transmit_1")} <span>{t("home.transmit_2")}</span>
          </h2>
          <Link href="/contact" className="s7-button s7-button-primary">
            {t("home.transmit_cta")}
            <ArrowUpRight size={18} />
          </Link>
        </Reveal>
      </div>
      <div className="s7-footer-bottom">
        <div>
          <img src={assetSrc("/assets/sa7tec-logo.jpg")} alt="SA7TEC" loading="lazy" decoding="async" />
          <strong>SA7TEC</strong>
        </div>
        <nav>
          <a href="#studio">{t("nav.studio")}</a>
          <a href="#services">{t("nav.services")}</a>
          <a href="#projects">{t("nav.projects")}</a>
          <a href="#capabilities">{t("nav.capabilities")}</a>
        </nav>
        <address>
          <a href={`mailto:${content.contactInfo.email}`}>
            <Mail size={15} />
            {content.contactInfo.email}
          </a>
          <a href={`tel:${content.contactInfo.phone}`}>
            <Phone size={15} />
            {content.contactInfo.phone}
          </a>
          <span>
            <MapPin size={15} />
            {tr(content.contactInfo.address)}
          </span>
        </address>
        <div className="s7-socials">
          <a href={content.contactInfo.social.linkedin} aria-label="LinkedIn">
            <Linkedin size={18} />
          </a>
          <a href={content.contactInfo.social.instagram} aria-label="Instagram">
            <Instagram size={18} />
          </a>
       
        </div>
      </div>
      <p className="s7-copyright">{t("home.copyright").replace("{year}", String(year))}</p>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Seo
        title="SA7TEC | Digital Product Studio for Mobile Apps, Games, AI & SaaS"
        description="SA7TEC builds premium mobile apps, games, AI products, SaaS platforms, e-commerce experiences, dashboards, and custom software for ambitious teams."
        path="/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "SA7TEC",
          url: "https://sa7tec.com/",
          description: "A premium digital product studio specializing in mobile apps, games, AI, SaaS, and custom software.",
          publisher: {
            "@type": "Organization",
            name: "SA7TEC",
            url: "https://sa7tec.com/",
            logo: "https://sa7tec.com/assets/sa7tec-logo.jpg",
          },
        }}
      />
      <PublicLayout>
        <div>
          <Hero />
          <StudioManifesto />
          <ServicesDeepDive />
          <WorkShowcase />
          <Capabilities />
          <NumbersAndAbout />
          <Testimonials />
          <ContactFooter />
        </div>
      </PublicLayout>
    </>
  );
}
