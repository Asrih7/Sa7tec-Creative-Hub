import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "@/lib/nav";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import CookieConsent, { hasConsented } from "@/components/CookieConsent";
import analytics from "@/lib/analytics";
import { useLanguage } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { assetSrc } from "@/lib/assets";

function scrollToSection(id: string, currentPath: string, navigate: (to: string) => void) {
  if (currentPath !== "/") {
    navigate("/");
    window.setTimeout(
      () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }),
      260,
    );
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

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = "";
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const links = [
    { label: "Services", id: "services" },
    { label: "Process", id: "process" },
    { label: "Portfolio", id: "work" },
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
    <div className={`site-shell s7-shell ${location === "/" ? "cb-home-shell" : ""}`}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className={`s7-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="s7-header-inner">
          <button
            onClick={() => {
              navigate("/");
              window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 20);
            }}
            className="s7-logo-button"
            aria-label="SA7TEC home"
          >
            <img
              src={assetSrc("/assets/sa7tec-logo.jpg")}
              alt="SA7TEC"
              loading="lazy"
              decoding="async"
            />
            <span>SA7TEC</span>
          </button>

          <nav className="s7-nav desktop-nav" aria-label="Primary navigation">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id, location, navigate)}
                className="s7-nav-link"
              >
                {link.label}
              </button>
            ))}
            <Link
              href="/blog"
              className={`s7-nav-link ${location === "/blog" ? "is-active" : ""}`}
              aria-current={location === "/blog" ? "page" : undefined}
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className={`s7-nav-link ${location === "/contact" ? "is-active" : ""}`}
              aria-current={location === "/contact" ? "page" : undefined}
            >
              {t("nav.contact")}
            </Link>
          </nav>

          <div className="s7-header-actions">
            <div className="s7-desktop-actions desktop-nav">
              <button
                onClick={toggleTheme}
                aria-label={themeLabel}
                title={themeLabel}
                className="s7-theme-toggle"
              >
                {isDark ? <Sun size={17} /> : <Moon size={17} />}
              </button>
              {location !== "/contact" ? (
                <Link href="/contact" className="s7-button s7-button-primary s7-header-cta">
                  {t("cta.start_project")}
                  <ArrowUpRight size={16} />
                </Link>
              ) : null}
            </div>

            <div className="s7-mobile-actions mobile-nav">
              <button
                onClick={toggleTheme}
                aria-label={themeLabel}
                title={themeLabel}
                className="s7-theme-toggle"
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button
                onClick={() => setMenuOpen((value) => !value)}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
                className="s7-menu-toggle"
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
            className="s7-drawer-menu"
          >
            <nav className="s7-drawer-nav" aria-label="Mobile navigation">
              {links.map((link, index) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id, location, navigate)}
                  className="s7-drawer-link"
                >
                  <span>0{index + 1}</span>
                  <strong>{link.label}</strong>
                  <ArrowUpRight size={18} />
                </button>
              ))}
            </nav>
            <Link href="/blog" className="s7-drawer-link" onClick={() => setMenuOpen(false)}>
              <span>04</span>
              <strong>Blog</strong>
              <ArrowUpRight size={18} />
            </Link>
            <Link href="/contact" className="s7-drawer-link" onClick={() => setMenuOpen(false)}>
              <span>05</span>
              <strong>{t("nav.contact")}</strong>
              <ArrowUpRight size={18} />
            </Link>
            {location !== "/contact" ? (
              <Link href="/contact" className="s7-button s7-button-primary s7-drawer-cta" onClick={() => setMenuOpen(false)}>
                {t("cta.start_project")}
                <ArrowUpRight size={18} />
              </Link>
            ) : null}
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
