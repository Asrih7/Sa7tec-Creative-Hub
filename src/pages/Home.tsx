import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  Code2,
  ExternalLink,
  Layers3,
  Mail,
  MapPin,
  Palette,
  Rocket,
  ShieldCheck,
  Linkedin,
  Instagram,
  Phone,
  Smartphone,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import { Link } from "@/lib/nav";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Seo } from "@/components/Seo";
import { assetSrc } from "@/lib/assets";
import { useContent } from "@/lib/content-store";
import { useLanguage } from "@/lib/i18n";
import "@/rebrand.css";

const iconMap = { Smartphone, Code2, Layers3, Zap, Palette, Rocket, Bot, Workflow };
const accents = ["purple", "pink", "blue", "orange", "green", "violet"];

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedStat({ value }: { value: string }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const target = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : value;
  const decimals = match?.[1].includes(".") ? match[1].split(".")[1].length : 0;

  useEffect(() => {
    if (!ref.current || !match) {
      setDisplay(value);
      return;
    }
    const node = ref.current;
    let frame = 0;
    let started = false;
    const animate = () => {
      const startedAt = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - startedAt) / 1100, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay((target * eased).toFixed(decimals));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.45 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [decimals, target, value]);

  return (
    <div ref={ref}>
      {display}
      {suffix}
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: React.ReactNode;
  body?: string;
}) {
  return (
    <div className="cb-section-title">
      <span className="cb-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {body && <p>{body}</p>}
    </div>
  );
}

function SiteFooter() {
  const { content } = useContent();
  const { tr } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="cb-footer">
      <div className="cb-container">
        <div className="cb-footer-grid">
          <div className="cb-footer-brand">
            <div className="cb-footer-logo-row">
              <img src={assetSrc("/assets/sa7tec-logo.jpg")} alt="SA7TEC" loading="lazy" />
              <strong>SA7TEC</strong>
            </div>
            <p>{tr(content.siteInfo.tagline)}</p>
            <div className="cb-footer-socials">
              <a
                href={content.contactInfo.social.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin size={17} />
              </a>
              <a
                href={content.contactInfo.social.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <Instagram size={17} />
              </a>
            </div>
          </div>

          <div className="cb-footer-column">
            <h3>Explore</h3>
            <a href="/#services">Services</a>
            <a href="/#process">Process</a>
            <a href="/#work">Portfolio</a>
            <Link href="/blog">Blog</Link>
          </div>

          <div className="cb-footer-column cb-footer-contact">
            <h3>Contact</h3>
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
          </div>

          <div className="cb-footer-action">
            <span className="cb-eyebrow">Built in Morocco · Working worldwide</span>
            <h3>Have a product idea?</h3>
            <Link href="/contact" className="cb-button cb-button-primary">
              Start a conversation <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        <div className="cb-footer-bottom">
          <span>© {year} SA7TEC. All rights reserved.</span>
          <span>Digital products for ambitious teams.</span>
        </div>
      </div>
    </footer>
  );
}

function ProductPreview() {
  return (
    <div className="cb-product-preview">
      <div className="cb-preview-glow" />
      <div className="cb-phone">
        <div className="cb-phone-top">
          <span />
          <span>09:41</span>
          <span>•••</span>
        </div>
        <div className="cb-phone-heading">
          <small>SA7TEC / STUDIO</small>
          <strong>
            Launch
            <br />
            <em>something useful.</em>
          </strong>
        </div>
        <div className="cb-phone-card cb-phone-card-main">
          <span>PRODUCT PULSE</span>
          <strong>92%</strong>
          <small>clarity score</small>
          <div className="cb-bars">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
        <div className="cb-phone-row">
          <div>
            <small>ACTIVE USERS</small>
            <strong>1M+</strong>
          </div>
          <div>
            <small>RATING</small>
            <strong>4.9</strong>
          </div>
        </div>
      </div>
      <div className="cb-float cb-float-top">
        <Sparkles size={14} />
        <span>React Native ready</span>
      </div>
      <div className="cb-float cb-float-bottom">
        <Check size={14} />
        <span>MVP in 6 weeks</span>
      </div>
    </div>
  );
}

export default function Home() {
  const { content } = useContent();
  const { tr } = useLanguage();
  const featured = content.portfolioItems.slice(0, 4);
  const statItems = [
    ...content.stats,
    {
      id: "capabilities",
      value: `${content.services.length}+`,
      label: { en: "Capabilities", fr: "Capacités", ar: "قدرات" },
    },
  ].slice(0, 4);
  const advantages = [
    {
      icon: ShieldCheck,
      title: "A partner, not a vendor",
      text: "You work directly with the people shaping the product, from first conversation to launch.",
    },
    {
      icon: Rocket,
      title: "Built for startup speed",
      text: "Clear milestones, focused scope and a practical path from idea to useful first release.",
    },
    {
      icon: Sparkles,
      title: "Design that earns trust",
      text: "Every screen is made to remove friction, explain value and make the next step obvious.",
    },
  ];

  return (
    <PublicLayout>
      <Seo
        title="SA7TEC | Digital products for ambitious startups"
        description="SA7TEC is a product studio from Morocco building mobile apps, web platforms, SaaS products and AI experiences for ambitious startups."
        path="/"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "SA7TEC",
            url: "https://sa7tec.com/",
            logo: "https://sa7tec.com/assets/sa7tec-logo.jpg",
            description:
              "SA7TEC is a digital product studio building mobile apps, web platforms, SaaS products and AI experiences.",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Tetouan",
              addressCountry: "MA",
            },
            sameAs: [
              "https://www.linkedin.com/company/sa7tech/",
              "https://www.instagram.com/sa7_tec/",
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "SA7TEC",
            url: "https://sa7tec.com/",
          },
        ]}
      />
      <div className="cb-site">
        <main>
          <section className="cb-hero">
            <div className="cb-container cb-hero-grid">
              <Reveal className="cb-hero-copy">
                <div className="cb-location-pill">
                  <span /> Morocco based · working worldwide
                </div>
                <h1>
                  Digital products
                  <br />
                  built for <em>momentum.</em>
                </h1>
                <p>
                  We turn ambitious ideas into mobile apps, web platforms and SaaS products that are
                  clear, useful and ready to grow.
                </p>
                <div className="cb-hero-actions">
                  <Link href="/contact" className="cb-button cb-button-primary">
                    Start your project <ArrowUpRight size={17} />
                  </Link>
                  <a href="#work" className="cb-button cb-button-ghost">
                    View our work <ArrowRight size={17} />
                  </a>
                </div>
                <div className="cb-hero-meta">
                  <span>
                    <Check size={13} /> Strategy included
                  </span>
                  <span>
                    <Check size={13} /> Senior team
                  </span>
                  <span>
                    <Check size={13} /> No agency layers
                  </span>
                </div>
              </Reveal>
              <Reveal delay={0.12}>
                <ProductPreview />
              </Reveal>
            </div>
          </section>

          <section className="cb-stats">
            <div className="cb-container cb-stats-grid">
              {statItems.map((stat) => (
                <div key={stat.id}>
                  <strong>
                    <AnimatedStat value={stat.value} />
                  </strong>
                  <span>{tr(stat.label)}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="cb-section" id="services">
            <div className="cb-container">
              <Reveal>
                <SectionTitle
                  eyebrow="Our services"
                  title={
                    <>
                      Everything your business
                      <br />
                      <em>needs to move.</em>
                    </>
                  }
                  body="From the first product decision to the last pixel, we bring the strategy, design and engineering needed to ship with confidence."
                />
              </Reveal>
              <div className="cb-service-grid">
                {content.services.map((service, index) => {
                  const Icon = iconMap[service.iconName as keyof typeof iconMap] || Code2;
                  return (
                    <Reveal
                      key={service.id}
                      delay={index * 0.045}
                      className={`cb-service-card cb-accent-${accents[index % accents.length]}`}
                    >
                      <div className="cb-service-icon">
                        <Icon size={21} />
                      </div>
                      <span className="cb-service-number">0{index + 1}</span>
                      <h3>{tr(service.title)}</h3>
                      <p>{tr(service.description)}</p>
                      <Link href="/contact" className="cb-learn">
                        Learn more <ArrowUpRight size={14} />
                      </Link>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="cb-section cb-section-dark" id="process">
            <div className="cb-container cb-process-layout">
              <Reveal>
                <SectionTitle
                  eyebrow="Our process"
                  title={
                    <>
                      A simple path from
                      <br />
                      <em>idea to impact.</em>
                    </>
                  }
                  body="You always know what we are solving, what comes next and how the product is moving forward."
                />
              </Reveal>
              <div className="cb-process-stepper" aria-label="Our process">
                {content.processSteps.slice(0, 3).map((step, index) => (
                  <Reveal key={step.id} delay={index * 0.12} className="cb-process-step">
                    <div className="cb-process-step-top">
                      <span className="cb-process-step-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {index < 2 && <span className="cb-process-step-line" aria-hidden="true" />}
                    </div>
                    <div className="cb-process-step-copy">
                      <h3>{tr(step.title)}</h3>
                      <p>{tr(step.description)}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section className="cb-section cb-why">
            <div className="cb-container">
              <Reveal>
                <SectionTitle
                  eyebrow="Why SA7TEC"
                  title={
                    <>
                      A tech partner that is
                      <br />
                      <em>actually in your corner.</em>
                    </>
                  }
                />
              </Reveal>
              <div className="cb-advantage-grid">
                {advantages.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Reveal key={item.title} delay={index * 0.08} className="cb-advantage-card">
                      <Icon size={23} />
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="cb-section cb-work" id="work">
            <div className="cb-container">
              <div className="cb-work-heading">
                <Reveal>
                  <SectionTitle
                    eyebrow="Featured work"
                    title={
                      <>
                        Ideas turned into
                        <br />
                        <em>real products.</em>
                      </>
                    }
                    body="A selection of experiments, tools and platforms from the SA7TEC workbench."
                  />
                </Reveal>
                <Link href="/blog" className="cb-button cb-button-outline">
                  See all projects <ArrowRight size={16} />
                </Link>
              </div>
              <div className="cb-work-grid">
                {featured.map((project, index) => (
                  <Reveal
                    key={project.id}
                    delay={index * 0.08}
                    className={`cb-work-card cb-work-card-${index + 1}`}
                  >
                    <div className="cb-work-image">
                      <img
                        src={assetSrc(project.imageUrl)}
                        alt={tr(project.title)}
                        loading="lazy"
                      />
                      <span className="cb-live-label">
                        <i /> Featured project
                      </span>
                      <a
                        href={project.linkUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${tr(project.title)}`}
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                    <div className="cb-work-body">
                      <span>{tr(project.category)}</span>
                      <h3>{tr(project.title)}</h3>
                      <p>{tr(project.description)}</p>
                      <a
                        href={project.linkUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="cb-learn"
                      >
                        Read the case study <ArrowRight size={14} />
                      </a>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section className="cb-section cb-reviews">
            <div className="cb-container">
              <Reveal>
                <SectionTitle
                  eyebrow="Client voices"
                  title={
                    <>
                      Good products leave
                      <br />
                      <em>a lasting feeling.</em>
                    </>
                  }
                />
              </Reveal>
              <div className="cb-review-grid">
                {content.testimonials.map((testimonial, index) => (
                  <Reveal key={testimonial.id} delay={index * 0.08} className="cb-review-card">
                    <span className="cb-review-quote">“</span>
                    <p>{tr(testimonial.quote)}</p>
                    <strong>{testimonial.name}</strong>
                    <small>
                      {tr(testimonial.role)} · {testimonial.company}
                    </small>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section className="cb-final-cta">
            <div className="cb-container cb-final-inner">
              <div>
                <span className="cb-eyebrow">Your next chapter</span>
                <h2>
                  Have a good idea?
                  <br />
                  <em>Make it real.</em>
                </h2>
              </div>
              <Link href="/contact" className="cb-button cb-button-light">
                Get a free quote <ArrowUpRight size={17} />
              </Link>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    </PublicLayout>
  );
}
