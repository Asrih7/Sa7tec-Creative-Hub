import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import CookieConsent, { hasConsented } from "@/components/CookieConsent";
import analytics from "@/lib/analytics";
import { useLanguage } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { assetSrc } from "@/lib/assets";

function scrollToSection(id: string, currentPath: string, navigate: (to: string) => void) {
  if (currentPath !== "/") {
    navigate("/");
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 260);
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function PublicLayout({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const [location, navigate] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const links = [
    { label: t("nav.studio"), id: "studio" },
    { label: t("nav.services"), id: "services" },
    { label: t("nav.projects"), id: "projects" },
    { label: t("nav.capabilities"), id: "capabilities" },
    { label: t("nav.numbers"), id: "numbers" },
  ];

  const themeLabel = isDark ? t("theme.toggle_light") : t("theme.toggle_dark");

  useEffect(() => {
    if (hasConsented()) {
      analytics.loadAnalytics();
      analytics.trackPage(location || window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (hasConsented()) {
      analytics.trackPage(location || window.location.pathname);
    }
  }, [location]);

  return (
    <div className="site-shell" style={{ minHeight: "100vh", background: "var(--s7-bg)", color: "var(--s7-fg)", overflowX: "clip" }}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: scrolled ? "0.75rem clamp(1rem, 4vw, 3rem)" : "1.1rem clamp(1rem, 4vw, 3rem)",
          transition: "padding 220ms ease, background 220ms ease, border-color 220ms ease",
          background: scrolled ? "var(--s7-header-bg)" : "transparent",
          borderBottom: scrolled ? "1px solid var(--s7-border)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(22px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(22px)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: "1480px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "auto minmax(0, 1fr) auto",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <button
            onClick={() => {
              navigate("/");
              window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 20);
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.7rem",
              background: "transparent",
              border: 0,
              color: "var(--s7-fg)",
              cursor: "pointer",
              padding: 0,
            }}
            aria-label="SA7TEC home"
          >
            <img
              src={assetSrc("/assets/sa7tec-logo.jpg")}
              alt="SA7TEC"
              loading="lazy"
              decoding="async"
              style={{ width: "2.75rem", height: "2.75rem", objectFit: "cover", borderRadius: "0.8rem" }}
            />
            <span style={{ fontSize: "1.02rem", fontWeight: 950, letterSpacing: "0" }}>SA7TEC</span>
          </button>

          <nav className="desktop-nav" aria-label="Primary navigation" style={{ justifySelf: "center", alignItems: "center", gap: "0.35rem" }}>
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id, location, navigate)}
                style={{
                  border: 0,
                  background: "transparent",
                  color: "var(--s7-fg-dim)",
                  cursor: "pointer",
                  padding: "0.65rem 0.8rem",
                  borderRadius: "999px",
                  fontWeight: 750,
                  transition: "color 160ms ease, background 160ms ease",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.color = "var(--s7-fg)";
                  event.currentTarget.style.background = "var(--s7-card-bg)";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.color = "var(--s7-fg-dim)";
                  event.currentTarget.style.background = "transparent";
                }}
              >
                {link.label}
              </button>
            ))}
            <Link
              href="/contact"
              style={{
                color: location === "/contact" ? "var(--s7-fg)" : "var(--s7-fg-dim)",
                padding: "0.65rem 0.8rem",
                borderRadius: "999px",
                fontWeight: 750,
              }}
            >
              {t("nav.contact")}
            </Link>
          </nav>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "end", gap: "0.55rem" }}>
            <div className="desktop-nav" style={{ alignItems: "center", gap: "0.55rem" }}>
              <LanguageSwitcher variant="header" />
              <button
                onClick={toggleTheme}
                aria-label={themeLabel}
                title={themeLabel}
                style={{
                  width: "2.65rem",
                  height: "2.65rem",
                  display: "grid",
                  placeItems: "center",
                  border: "1px solid var(--s7-border)",
                  borderRadius: "999px",
                  background: "var(--s7-card-bg)",
                  color: "var(--s7-fg)",
                  cursor: "pointer",
                }}
              >
                {isDark ? <Sun size={17} /> : <Moon size={17} />}
              </button>
              <Link href="/contact" className="s7-button s7-button-primary" style={{ minHeight: "2.65rem", padding: "0.72rem 1rem" }}>
                {t("cta.start_project")}
                <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="mobile-nav" style={{ alignItems: "center", gap: "0.5rem" }}>
              <button
                onClick={toggleTheme}
                aria-label={themeLabel}
                title={themeLabel}
                style={{
                  width: "2.55rem",
                  height: "2.55rem",
                  display: "grid",
                  placeItems: "center",
                  border: "1px solid var(--s7-border)",
                  borderRadius: "999px",
                  background: "var(--s7-card-bg)",
                  color: "var(--s7-fg)",
                  cursor: "pointer",
                }}
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button
                onClick={() => setMenuOpen((value) => !value)}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
                style={{
                  width: "2.75rem",
                  height: "2.75rem",
                  display: "grid",
                  placeItems: "center",
                  border: "1px solid var(--s7-border)",
                  borderRadius: "999px",
                  background: "var(--s7-card-bg)",
                  color: "var(--s7-fg)",
                  cursor: "pointer",
                }}
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 90,
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",
              padding: "6.6rem 1rem 1.5rem",
              background: "var(--s7-menu-bg)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              overflowY: "auto",
            }}
          >
            <nav style={{ display: "grid", gap: "0.4rem" }} aria-label="Mobile navigation">
              {links.map((link, index) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id, location, navigate)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1px solid var(--s7-border)",
                    borderRadius: "1rem",
                    background: "var(--s7-card-bg)",
                    color: "var(--s7-fg)",
                    padding: "1rem",
                    cursor: "pointer",
                    textAlign: "start",
                  }}
                >
                  <span style={{ color: "var(--s7-fg-muted)", fontFamily: "monospace" }}>0{index + 1}</span>
                  <strong style={{ fontSize: "1.35rem" }}>{link.label}</strong>
                  <ArrowUpRight size={18} />
                </button>
              ))}
            </nav>
            <LanguageSwitcher variant="drawer" />
            <Link href="/contact" className="s7-button s7-button-primary">
              {t("cta.start_project")}
              <ArrowUpRight size={18} />
            </Link>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <CookieConsent
        onAccept={() => {
          analytics.loadAnalytics();
          analytics.trackPage(window.location.pathname);
        }}
      />
      <WhatsAppButton />
    </div>
  );
}
