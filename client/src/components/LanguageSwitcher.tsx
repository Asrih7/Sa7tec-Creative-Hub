import { useLanguage, LANGUAGES, type Lang } from "@/lib/i18n";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Variant = "header" | "drawer" | "admin";

const FLAG_MAP: Record<string, ReactNode> = {
  en: (
    <svg width="24" height="24" viewBox="0 0 60 30" style={{ borderRadius: "4px", overflow: "hidden" }}>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0 0L60 30M60 0L0 30" stroke="white" strokeWidth="6" />
      <path d="M0 0L60 30M60 0L0 30" stroke="#C8102E" strokeWidth="4" />
      <path d="M30 0v30M0 15h60" stroke="white" strokeWidth="10" />
      <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  ),
  fr: (
    <svg width="24" height="24" viewBox="0 0 60 30" style={{ borderRadius: "4px" }}>
      <rect width="20" height="30" fill="#002395" />
      <rect x="20" width="20" height="30" fill="white" />
      <rect x="40" width="20" height="30" fill="#ED2939" />
    </svg>
  ),
  ar: (
    <svg width="24" height="24" viewBox="0 0 60 30" style={{ borderRadius: "4px", overflow: "hidden" }}>
      <rect width="60" height="30" fill="#006C35" />
      <g transform="translate(5, 3)">
        <text x="0" y="7" fontSize="6" fill="white" fontFamily="Arial, sans-serif" fontWeight="bold">
          الله
        </text>
      </g>
      <line x1="8" y1="18" x2="48" y2="18" stroke="white" strokeWidth="1.5" />
      <path d="M 48 18 Q 50 16 52 18" stroke="white" strokeWidth="1.2" fill="none" />
    </svg>
  ),
};

export function LanguageSwitcher({ variant = "header" }: { variant?: Variant }) {
  const { lang, setLang } = useLanguage();

  if (variant === "header") {
    return (
      <div style={{
        display: "flex", gap: "0.3rem", alignItems: "center", flexShrink: 0,
      }}>
        {LANGUAGES.map((l) => (
          <motion.button
            key={l.code}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setLang(l.code as Lang)}
            style={{
              background: lang === l.code ? "rgba(34, 211, 238, 0.2)" : "transparent",
              border: lang === l.code ? "2px solid rgba(34, 211, 238, 0.6)" : "1px solid var(--s7-border-2)",
              color: "var(--s7-fg)",
              width: "42px", height: "42px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s, border-color 0.2s, transform 0.2s",
              padding: 0,
            }}
            aria-label={`Switch to ${l.label}`}
            title={l.label}
          >
            {FLAG_MAP[l.code]}
          </motion.button>
        ))}
      </div>
    );
  }

  // For drawer and admin variants, show flags with labels
  return (
    <div style={{ display: "flex", gap: "0.5rem", flexDirection: "column" }}>
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code as Lang)}
          style={{
            background: lang === l.code ? "var(--s7-card-hover)" : "transparent",
            border: `1px solid ${lang === l.code ? "var(--s7-border)" : "var(--s7-border-2)"}`,
            color: "var(--s7-fg)",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background 0.2s, border-color 0.2s",
            width: "100%",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
          title={l.label}
        >
          <div style={{ width: "24px", height: "24px" }}>
            {FLAG_MAP[l.code]}
          </div>
          {l.label}
        </button>
      ))}
    </div>
  );
}

