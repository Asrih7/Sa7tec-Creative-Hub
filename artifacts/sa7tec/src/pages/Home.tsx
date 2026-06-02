import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import {
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  Cloud,
  Gamepad2,
  Github,
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
import { useContent } from "@/lib/content-store";
import { useLanguage } from "@/lib/i18n";
import { assetSrc } from "@/lib/assets";

const ACCENTS = ["#22d3ee", "#a78bfa", "#34d399", "#fbbf24", "#f472b6", "#fb923c", "#60a5fa", "#14b8a6"];

const PORTFOLIO_IMAGE_FALLBACKS: Record<string, string> = {
  p1: "/assets/rubiks-challenge.jpg",
  p5: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80",
  p6: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
};

const MISSING_PORTFOLIO_IMAGES = ["portfolio-game.png", "portfolio-saas.png", "portfolio-dashboard.png"];

function portfolioImageFor(id: string, imageUrl: string) {
  if (!imageUrl || MISSING_PORTFOLIO_IMAGES.some((name) => imageUrl.includes(name))) {
    return PORTFOLIO_IMAGE_FALLBACKS[id] ?? imageUrl;
  }
  return imageUrl;
}

const iconMap = {
  Gamepad2,
  Smartphone,
  Globe: Globe2,
  Cloud,
  ShoppingCart,
  Zap,
  Palette,
  Rocket,
} as const;

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
  const y = useTransform(scrollYProgress, [0, 0.25], [0, -90]);
  const opacity = useTransform(scrollYProgress, [0, 0.22], [1, 0.35]);
  const services = content.services.slice(0, 5);

  return (
    <section id="home" className="s7-hero">
      <MagneticAura />
      <motion.div className="s7-hero-inner" style={{ y, opacity }}>
        <motion.p
          className="s7-kicker"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {t("home.year")} / {t("home.tagline")}
        </motion.p>

        <div className="s7-hero-title-wrap">
          <motion.h1
            initial={{ opacity: 0, y: 54 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            {content.siteInfo.title}
            <span>{t("home.manifesto_2")}</span>
          </motion.h1>
          <motion.div
            className="s7-hero-mark"
            initial={{ opacity: 0, scale: 0.88, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={assetSrc("/assets/sa7tec-logo.jpg")} alt="SA7TEC" />
          </motion.div>
        </div>

        <motion.p
          className="s7-hero-copy"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          {tr(content.siteInfo.heroSubheadline)}
        </motion.p>

        <motion.div
          className="s7-hero-actions"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.48 }}
        >
          <Link href="/contact" className="s7-button s7-button-primary">
            {t("home.cta_project")}
            <ArrowUpRight size={18} />
          </Link>
          <Link href="/games/rubiks-race" className="s7-button s7-button-ghost">
            <Play size={16} />
            {t("home.cta_games")}
          </Link>
        </motion.div>

        <motion.div
          className="s7-hero-strip"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.62 }}
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
    { title: t("home.prop1_title"), body: t("home.prop1_desc") },
    { title: t("home.prop2_title"), body: t("home.prop2_desc") },
    { title: t("home.prop3_title"), body: t("home.prop3_desc") },
  ];

  return (
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
        {pillars.map((pillar, index) => (
          <Reveal key={pillar.title} delay={index * 0.08}>
            <article>
              <span>0{index + 1}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function DomainUniverse() {
  const { t } = useLanguage();
  const domains = [
    {
      title: t("home.product_games"),
      body: t("home.product_games_desc"),
      icon: Gamepad2,
      color: "#22d3ee",
      tags: ["Puzzle systems", "Retention loops", "Store launch"],
    },
    {
      title: t("home.product_commerce"),
      body: t("home.product_commerce_desc"),
      icon: ShoppingCart,
      color: "#a78bfa",
      tags: ["Checkout", "Catalogs", "Growth"],
    },
    {
      title: t("home.product_education"),
      body: t("home.product_education_desc"),
      icon: BrainCircuit,
      color: "#34d399",
      tags: ["Lessons", "Quizzes", "Progress"],
    },
    {
      title: t("home.product_health"),
      body: t("home.product_health_desc"),
      icon: ShieldCheck,
      color: "#fbbf24",
      tags: ["Tracking", "Plans", "Motivation"],
    },
    {
      title: "SaaS / AI",
      body: "Intelligent platforms, dashboards, workflows, and automation engines.",
      icon: Cloud,
      color: "#f472b6",
      tags: ["AI features", "Dashboards", "Automation"],
    },
    {
      title: t("home.product_custom"),
      body: t("home.product_custom_desc"),
      icon: Layers3,
      color: "#60a5fa",
      tags: ["MVP", "Scale", "Ops tools"],
    },
  ];

  return (
    <section id="services" className="s7-section s7-domains">
      <SectionIntro
        eyebrow={t("home.products_id")}
        title={
          <>
            {t("home.products_headline")} <span>{t("home.products_reach")}</span>
          </>
        }
        body="SA7TEC builds ecosystems, not isolated screens. Each domain combines product strategy, interface craft, engineering, launch discipline, and post-launch iteration."
      />

      <div className="s7-domain-grid">
        {domains.map((domain, index) => {
          const Icon = domain.icon;
          return (
            <Reveal key={domain.title} delay={index * 0.05}>
              <motion.article
                className="s7-domain-card"
                style={{ "--domain-color": domain.color } as React.CSSProperties}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                <div className="s7-domain-light" />
                <div className="s7-domain-top">
                  <motion.div
                    className="s7-domain-icon"
                    whileHover={{ rotate: [0, -8, 8, 0], scale: 1.08 }}
                    transition={{ duration: 0.55 }}
                  >
                    <Icon size={30} />
                  </motion.div>
                  <span>0{index + 1}</span>
                </div>
                <div className="s7-domain-content">
                  <h3>{domain.title}</h3>
                  <p>{domain.body}</p>
                </div>
                <div className="s7-domain-tags">
                  {domain.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="s7-domain-reveal">
                  <span>Explore ecosystem</span>
                  <ArrowUpRight size={17} />
                </div>
              </motion.article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function ServicesDeepDive() {
  const { t, tr } = useLanguage();
  const { content } = useContent();

  return (
    <section className="s7-section s7-services">
      <SectionIntro
        eyebrow={t("section.what_we_build")}
        title={
          <>
            Product teams for <span>ambitious builds.</span>
          </>
        }
        body={t("section.what_we_build_sub")}
      />

      <div className="s7-service-list">
        {content.services.map((service, index) => {
          const Icon = iconMap[service.iconName as keyof typeof iconMap] ?? Sparkles;
          const color = service.color.startsWith("#") ? service.color : ACCENTS[index % ACCENTS.length];
          return (
            <Reveal key={service.id} delay={Math.min(index * 0.04, 0.24)}>
              <motion.article className="s7-service-row" whileHover={{ x: 8 }}>
                <div className="s7-service-index">0{index + 1}</div>
                <div className="s7-service-icon" style={{ color }}>
                  <Icon size={24} />
                </div>
                <h3>{tr(service.title)}</h3>
                <p>{tr(service.description)}</p>
                <ArrowUpRight size={21} />
              </motion.article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function FlagshipGame() {
  const { t, tr } = useLanguage();
  const { content } = useContent();
  const game = content.games[0];
  const shots = game?.screenshots?.length ? game.screenshots : [game?.imageUrl].filter(Boolean) as string[];

  if (!game) return null;

  return (
    <section id="games" className="s7-section s7-game">
      <div className="s7-game-shell">
        <Reveal>
          <div className="s7-game-copy">
            <p className="s7-eyebrow">{t("home.game_id")}</p>
            <span className="s7-status">{tr(game.statusBadge) || t("home.game_badge")}</span>
            <h2>{tr(game.title)}</h2>
            <h3>{tr(game.subtitle)}</h3>
            <p>{tr(game.description) || t("home.game_desc")}</p>
            <div className="s7-game-features">
              {[t("section.feat.levels"), t("section.feat.leaderboards"), t("section.feat.daily")].map((feature) => (
                <span key={feature}>
                  <CheckCircle2 size={16} />
                  {feature}
                </span>
              ))}
            </div>
            <Link href="/games/rubiks-race" className="s7-button s7-button-primary">
              {t("cta.explore_game")}
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="s7-phone-stage">
            {shots.slice(0, 3).map((shot, index) => (
              <motion.div
                key={shot}
                className={`s7-phone s7-phone-${index}`}
                animate={{ y: [0, index % 2 ? 12 : -12, 0] }}
                transition={{ duration: 5 + index, repeat: Infinity, ease: "easeInOut" }}
              >
                <img src={assetSrc(shot)} alt={`${tr(game.title)} screenshot ${index + 1}`} />
              </motion.div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function WorkShowcase() {
  const { t, tr } = useLanguage();
  const { content } = useContent();

  return (
    <section className="s7-section s7-work">
      <SectionIntro
        eyebrow={t("section.portfolio")}
        title={
          <>
            Digital products with <span>market shape.</span>
          </>
        }
        body={t("section.portfolio_sub")}
      />
      <div className="s7-work-grid">
        {content.portfolioItems.map((item, index) => (
          <Reveal key={item.id} delay={index * 0.05}>
            <motion.article className="s7-work-card" whileHover={{ y: -8 }}>
              <div className="s7-work-media">
                <img
                  src={assetSrc(portfolioImageFor(item.id, item.imageUrl))}
                  alt={tr(item.title)}
                  onError={(event) => {
                    const fallback = PORTFOLIO_IMAGE_FALLBACKS[item.id];
                    if (fallback && event.currentTarget.src !== assetSrc(fallback)) {
                      event.currentTarget.src = assetSrc(fallback);
                    }
                  }}
                />
              </div>
              <div className="s7-work-body">
                <span>{tr(item.category)}</span>
                <h3>{tr(item.title)}</h3>
                <p>{tr(item.description)}</p>
              </div>
            </motion.article>
          </Reveal>
        ))}
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
              <Icon size={24} />
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
        {content.stats.map((stat, index) => (
          <StatCard key={stat.id} value={stat.value} label={tr(stat.label)} active={inView} color={ACCENTS[index % ACCENTS.length]} />
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

function StatCard({ value, label, active, color }: { value: string; label: string; active: boolean; color: string }) {
  const count = useCountUp(value, active);
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
        {content.testimonials.map((item, index) => (
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
          <img src={assetSrc("/assets/sa7tec-logo.jpg")} alt="SA7TEC" />
          <strong>SA7TEC</strong>
        </div>
        <nav>
          <a href="#studio">{t("nav.studio")}</a>
          <a href="#services">{t("nav.services")}</a>
          <a href="#games">{t("nav.games")}</a>
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
          <a href={content.contactInfo.social.github} aria-label="GitHub">
            <Github size={18} />
          </a>
        </div>
      </div>
      <p className="s7-copyright">{t("home.copyright").replace("{year}", String(year))}</p>
    </footer>
  );
}

export default function Home() {
  return (
    <PublicLayout>
      <main>
        <Hero />
        <StudioManifesto />
        <DomainUniverse />
        <ServicesDeepDive />
        <FlagshipGame />
        <WorkShowcase />
        <Capabilities />
        <NumbersAndAbout />
        <Testimonials />
        <ContactFooter />
      </main>
    </PublicLayout>
  );
}
