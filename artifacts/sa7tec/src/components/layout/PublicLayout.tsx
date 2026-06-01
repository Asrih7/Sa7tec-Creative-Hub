import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useContent } from "@/lib/content-store";
import { useLanguage } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const CYAN = "#22d3ee";

export function PublicLayout({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { content } = useContent();
  const { t } = useLanguage();
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navLinks = [
    { label: t("nav.home"), path: "/" },
    { label: t("nav.games"), path: "/games/rubiks-race" },
    { label: t("nav.contact"), path: "/contact" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        overflowX: "hidden",
      }}
    >
      {/* ─── Floating Header ─── */}
      <header
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          padding: scrolled ? "0.875rem 5vw" : "1.5rem 5vw",
          background: scrolled ? "rgba(0,0,0,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
          transition: "all 0.3s ease",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href="/">
          <div
            style={{
              display: "flex", alignItems: "center", gap: "0.6rem",
              textDecoration: "none", cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "32px", height: "32px", borderRadius: "8px",
                background: `${CYAN}18`, border: `1px solid ${CYAN}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <span style={{ color: CYAN, fontSize: "0.75rem", fontWeight: 800, fontFamily: "monospace" }}>S7</span>
            </div>
            <span style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 800,
              fontSize: "1.125rem", color: "#fff", letterSpacing: "-0.02em",
            }}>
              {content.siteInfo.title}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ alignItems: "center", gap: "2rem" }} className="hidden md:flex">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path}>
              <span
                style={{
                  fontSize: "0.875rem", fontWeight: 500,
                  color: location === link.path ? "#fff" : "rgba(255,255,255,0.4)",
                  cursor: "pointer", textDecoration: "none",
                  transition: "color 0.2s", letterSpacing: "0.01em",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {link.label}
              </span>
            </Link>
          ))}
          <LanguageSwitcher variant="header" />
          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: `0 0 20px rgba(34,211,238,0.3)` }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: CYAN, color: "#000",
                padding: "0.5rem 1.25rem", borderRadius: "9999px",
                fontWeight: 700, fontSize: "0.8rem",
                letterSpacing: "0.04em", border: "none", cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {t("cta.start_project")}
            </motion.button>
          </Link>
        </nav>

        {/* Mobile Controls */}
        <div style={{ alignItems: "center", gap: "0.75rem" }} className="flex md:hidden">
          <LanguageSwitcher variant="header" />
          <button
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff", borderRadius: "8px",
              width: "40px", height: "40px",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed", inset: 0, zIndex: 99,
              background: "rgba(0,0,0,0.97)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: "2rem", paddingTop: "5rem",
            }}
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.07 }}
              >
                <Link href={link.path}>
                  <span
                    onClick={() => setMenuOpen(false)}
                    style={{
                      fontSize: "2.5rem", fontWeight: 800,
                      color: location === link.path ? CYAN : "#fff",
                      cursor: "pointer", textDecoration: "none",
                      fontFamily: "'Outfit', sans-serif",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {link.label}
                  </span>
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link href="/contact">
                <button
                  onClick={() => setMenuOpen(false)}
                  style={{
                    background: CYAN, color: "#000",
                    padding: "0.9rem 2.5rem", borderRadius: "9999px",
                    fontWeight: 700, fontSize: "1rem",
                    border: "none", cursor: "pointer",
                    fontFamily: "'Outfit', sans-serif",
                    marginTop: "1rem",
                  }}
                >
                  {t("cta.start_project")}
                </button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main style={{ paddingTop: 0 }}>
        {children}
      </main>

      <WhatsAppButton />
    </div>
  );
}
