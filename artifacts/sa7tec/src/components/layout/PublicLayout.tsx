import { ReactNode, useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const CYAN = "#22d3ee";
const VIOLET = "#a78bfa";

/* Smooth-scroll helper — works across pages */
function scrollToSection(id: string, currentPath: string, navigate: (to: string) => void) {
  if (currentPath !== "/") {
    navigate("/");
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 400);
  } else {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }
}

export function PublicLayout({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const [location, navigate] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  /* Close services dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Scene anchors ── */
  const scenes = [
    { num: "01", label: t("nav.studio"),       id: "studio",       color: CYAN },
    { num: "02", label: t("nav.services"),      id: "services",     color: VIOLET },
    { num: "03", label: t("nav.games"),         id: "games",        color: "#34d399" },
    { num: "04", label: t("nav.capabilities"),  id: "capabilities", color: "#fbbf24" },
    { num: "05", label: t("nav.numbers"),       id: "numbers",      color: "#f472b6" },
  ];

  /* ── All services ── */
  const services = [
    { label: t("nav.service_games"),    symbol: "⬡", anchor: "services", color: CYAN },
    { label: t("nav.service_commerce"), symbol: "◈", anchor: "services", color: VIOLET },
    { label: t("nav.service_education"),symbol: "◎", anchor: "services", color: "#34d399" },
    { label: t("nav.service_health"),   symbol: "◇", anchor: "services", color: "#fbbf24" },
    { label: t("nav.service_custom"),   symbol: "△", anchor: "services", color: "#f472b6" },
  ];

  const ThemeToggle = () => (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      onClick={toggleTheme}
      aria-label={isDark ? t("theme.toggle_light") : t("theme.toggle_dark")}
      title={isDark ? t("theme.toggle_light") : t("theme.toggle_dark")}
      style={{
        background: "transparent",
        border: "1px solid var(--s7-border-2)",
        color: "var(--s7-fg-dim)",
        borderRadius: "8px",
        width: "34px", height: "34px",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", flexShrink: 0,
        transition: "border-color 0.2s, color 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = `${CYAN}55`;
        (e.currentTarget as HTMLButtonElement).style.color = CYAN;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--s7-border-2)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--s7-fg-dim)";
      }}
    >
      {isDark ? <Sun size={14} /> : <Moon size={14} />}
    </motion.button>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--s7-bg)", color: "var(--s7-fg)", overflowX: "hidden" }}>

      {/* ─── Fixed Header ─── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: scrolled ? "0.75rem 4vw" : "1.25rem 4vw",
        background: scrolled ? "var(--s7-header-bg)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid var(--s7-border)" : "none",
        transition: "padding 0.3s, background 0.3s, border-color 0.3s",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: "1rem",
      }}>

        {/* Logo — always Latin "SA7TEC" regardless of language */}
        <button
          onClick={() => { navigate("/"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          style={{
            background: "none", border: "none", padding: 0,
            display: "flex", alignItems: "center", gap: "0.55rem",
            cursor: "pointer", flexShrink: 0,
          }}
        >
          <div style={{
            width: "30px", height: "30px", borderRadius: "7px",
            background: `${CYAN}18`, border: `1px solid ${CYAN}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: CYAN, fontSize: "0.7rem", fontWeight: 800, fontFamily: "monospace" }}>S7</span>
          </div>
          {/* Always Latin, never translated */}
          <span style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 800,
            fontSize: "1.05rem", color: "var(--s7-fg)", letterSpacing: "-0.02em",
          }}>
            SA7TEC
          </span>
        </button>

        {/* ── Desktop Nav ── */}
        <nav
          style={{ display: "flex", alignItems: "center", gap: "0.25rem", flex: 1, justifyContent: "center" }}
          className="desktop-nav"
        >
          {scenes.map((scene) =>
            scene.id === "services" ? (
              /* Services dropdown */
              <div key="services" ref={servicesRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setServicesOpen((v) => !v)}
                  onMouseEnter={() => setServicesOpen(true)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "0.4rem",
                    padding: "0.4rem 0.65rem", borderRadius: "8px",
                    transition: "background 0.2s",
                  }}
                  onMouseLeave={() => {}}
                >
                  <span style={{
                    fontFamily: "monospace", fontSize: "0.55rem",
                    color: servicesOpen ? scene.color : "var(--s7-fg-muted)",
                    letterSpacing: "0.1em", transition: "color 0.2s",
                  }}>
                    {scene.num}
                  </span>
                  <span style={{
                    fontFamily: "'Outfit', sans-serif", fontSize: "0.8rem",
                    fontWeight: 500, color: servicesOpen ? "var(--s7-fg)" : "var(--s7-fg-dim)",
                    transition: "color 0.2s",
                  }}>
                    {scene.label}
                  </span>
                  <span style={{
                    color: "var(--s7-fg-muted)", fontSize: "0.6rem",
                    transition: "transform 0.2s", display: "inline-block",
                    transform: servicesOpen ? "rotate(180deg)" : "none",
                  }}>▾</span>
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      onMouseLeave={() => setServicesOpen(false)}
                      style={{
                        position: "absolute", top: "calc(100% + 8px)",
                        left: "50%", transform: "translateX(-50%)",
                        background: "var(--s7-menu-bg)",
                        border: "1px solid var(--s7-border)",
                        borderRadius: "14px", padding: "0.5rem",
                        minWidth: "200px", zIndex: 200,
                        boxShadow: "0 16px 48px rgba(0,0,0,0.3)",
                      }}
                    >
                      {services.map((svc) => (
                        <button
                          key={svc.label}
                          onClick={() => {
                            setServicesOpen(false);
                            scrollToSection(svc.anchor, location, navigate);
                          }}
                          style={{
                            width: "100%", background: "none", border: "none",
                            padding: "0.6rem 0.875rem", borderRadius: "9px",
                            display: "flex", alignItems: "center", gap: "0.75rem",
                            cursor: "pointer", transition: "background 0.15s",
                            textAlign: "start",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = "var(--s7-card-hover)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = "none";
                          }}
                        >
                          <span style={{ color: svc.color, fontSize: "1.1rem", lineHeight: 1 }}>{svc.symbol}</span>
                          <span style={{
                            color: "var(--s7-fg)", fontSize: "0.85rem",
                            fontWeight: 500, fontFamily: "'Outfit', sans-serif",
                          }}>
                            {svc.label}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Regular scene anchor */
              <SceneNavBtn
                key={scene.id}
                num={scene.num}
                label={scene.label}
                color={scene.color}
                onClick={() => scrollToSection(scene.id, location, navigate)}
              />
            )
          )}

          {/* Separator */}
          <div style={{ width: "1px", height: "18px", background: "var(--s7-border)", margin: "0 0.4rem" }} />

          {/* Contact page link */}
          <Link href="/contact">
            <span style={{
              padding: "0.4rem 0.65rem", borderRadius: "8px",
              fontFamily: "'Outfit', sans-serif", fontSize: "0.8rem",
              fontWeight: 500, color: location === "/contact" ? "var(--s7-fg)" : "var(--s7-fg-dim)",
              cursor: "pointer", transition: "color 0.2s",
            }}>
              {t("nav.contact")}
            </span>
          </Link>
        </nav>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <LanguageSwitcher variant="header" />
            <ThemeToggle />
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: `0 0 20px rgba(34,211,238,0.3)` }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: CYAN, color: "#000",
                  padding: "0.45rem 1.15rem", borderRadius: "9999px",
                  fontWeight: 700, fontSize: "0.78rem",
                  letterSpacing: "0.04em", border: "none", cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif", whiteSpace: "nowrap",
                }}
              >
                {t("cta.start_project")} →
              </motion.button>
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="mobile-nav" style={{ display: "none", alignItems: "center", gap: "0.5rem" }}>
            <ThemeToggle />
            <LanguageSwitcher variant="header" />
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              style={{
                background: "var(--s7-card-bg)",
                border: "1px solid var(--s7-border-2)",
                color: "var(--s7-fg)", borderRadius: "8px",
                width: "38px", height: "38px",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}
            >
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Full-screen Mobile Menu ─── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed", inset: 0, zIndex: 99,
              background: "var(--s7-menu-bg)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              display: "flex", flexDirection: "column",
              padding: "6rem 8vw 3rem",
              overflowY: "auto",
            }}
          >
            {/* Scenes list */}
            <div style={{ flex: 1 }}>
              {[...scenes, { num: "06", label: t("nav.contact"), id: "contact", color: CYAN }].map((scene, i) => (
                <motion.div
                  key={scene.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.06, duration: 0.35 }}
                  style={{ borderBottom: "1px solid var(--s7-border)", paddingBottom: "1.25rem", marginBottom: "1.25rem" }}
                >
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      if (scene.id === "contact") {
                        navigate("/contact");
                      } else {
                        scrollToSection(scene.id, location, navigate);
                      }
                    }}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: "1rem", width: "100%",
                      padding: 0,
                    }}
                  >
                    <span style={{
                      fontFamily: "monospace", fontSize: "0.6rem",
                      color: scene.color, letterSpacing: "0.15em",
                      minWidth: "2rem",
                    }}>
                      {scene.num}
                    </span>
                    <span style={{
                      fontFamily: "'Outfit', sans-serif", fontSize: "clamp(1.8rem, 6vw, 2.5rem)",
                      fontWeight: 800, color: "var(--s7-fg)", letterSpacing: "-0.03em",
                    }}>
                      {scene.label}
                    </span>
                  </button>

                  {/* Services sub-list */}
                  {scene.id === "services" && (
                    <div style={{ paddingLeft: "3rem", marginTop: "0.75rem", display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
                      {services.map((svc) => (
                        <button
                          key={svc.label}
                          onClick={() => {
                            setMenuOpen(false);
                            scrollToSection("services", location, navigate);
                          }}
                          style={{
                            background: `${svc.color}12`,
                            border: `1px solid ${svc.color}33`,
                            color: svc.color,
                            borderRadius: "9999px",
                            padding: "0.35rem 0.9rem",
                            fontSize: "0.75rem", fontFamily: "'Outfit', sans-serif",
                            fontWeight: 600, cursor: "pointer",
                          }}
                        >
                          {svc.symbol} {svc.label}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ paddingTop: "1rem" }}
            >
              <Link href="/contact">
                <button
                  onClick={() => setMenuOpen(false)}
                  style={{
                    background: CYAN, color: "#000",
                    padding: "1rem 2.5rem", borderRadius: "9999px",
                    fontWeight: 700, fontSize: "1rem",
                    border: "none", cursor: "pointer",
                    fontFamily: "'Outfit', sans-serif", width: "100%",
                  }}
                >
                  {t("cta.start_project")} →
                </button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>{children}</main>
      <WhatsAppButton />
    </div>
  );
}

/* ── Scene Nav Button (desktop) ── */
function SceneNavBtn({
  num, label, color, onClick,
}: { num: string; label: string; color: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `${color}08` : "none",
        border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", gap: "0.4rem",
        padding: "0.4rem 0.65rem", borderRadius: "8px",
        transition: "background 0.2s",
      }}
    >
      <span style={{
        fontFamily: "monospace", fontSize: "0.55rem",
        color: hovered ? color : "var(--s7-fg-muted)",
        letterSpacing: "0.1em", transition: "color 0.2s",
      }}>
        {num}
      </span>
      <span style={{
        fontFamily: "'Outfit', sans-serif", fontSize: "0.8rem",
        fontWeight: 500,
        color: hovered ? "var(--s7-fg)" : "var(--s7-fg-dim)",
        transition: "color 0.2s",
      }}>
        {label}
      </span>
    </button>
  );
}
