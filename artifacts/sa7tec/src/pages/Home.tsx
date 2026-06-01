import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useContent } from "@/lib/content-store";
import { useLanguage } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { assetSrc } from "@/lib/assets";

const CYAN = "#22d3ee";
const VIOLET = "#a78bfa";

/* ─── Utilities ─── */
function useCountUp(target: number, inView: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);
  return count;
}

function GridDots({ opacity = 0.055 }: { opacity?: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(circle, var(--s7-dot) 1px, transparent 1px)`,
        backgroundSize: "36px 36px",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        opacity,
      }}
    />
  );
}

/* ─── Scene 01: Entry ─── */
function SceneEntry() {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const letters = "SA7TEC".split("");

  // Cursor parallax
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = (currentTarget as HTMLElement).getBoundingClientRect();
    setMouse({
      x: ((clientX - left) / width - 0.5) * 2,
      y: ((clientY - top) / height - 0.5) * 2,
    });
  }, []);

  return (
    <section
      onMouseMove={handleMouseMove}
      style={{
        minHeight: "100dvh",
        background: "var(--s7-bg)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
      }}
    >
      <GridDots />

      {/* Parallax cyan glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: "70vw", height: "55vh", maxWidth: "900px",
          background: `radial-gradient(ellipse, ${isDark ? "rgba(34,211,238,0.08)" : "rgba(34,211,238,0.12)"} 0%, transparent 70%)`,
          top: "50%", left: "50%",
          transform: `translate(calc(-50% + ${mouse.x * 24}px), calc(-55% + ${mouse.y * 16}px))`,
          pointerEvents: "none",
          transition: "transform 0.15s ease-out",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: "40vw", height: "40vh", maxWidth: "500px",
          background: `radial-gradient(ellipse, ${isDark ? "rgba(167,139,250,0.06)" : "rgba(167,139,250,0.09)"} 0%, transparent 70%)`,
          bottom: "10%", right: "5%",
          transform: `translate(${mouse.x * -16}px, ${mouse.y * -10}px)`,
          pointerEvents: "none",
          transition: "transform 0.25s ease-out",
        }}
      />

      <div style={{ zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", padding: "0 5vw" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: "0.65rem", letterSpacing: "0.35em",
            textTransform: "uppercase", color: CYAN,
          }}
        >
          {t("home.year")}
        </motion.div>

        {/* Letter-by-letter wordmark */}
        <div style={{ display: "flex", gap: "0.02em" }} aria-label="SA7TEC">
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 50, rotateX: -40 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: "clamp(4.5rem, 14vw, 10rem)",
                fontWeight: 900, color: "var(--s7-fg)",
                letterSpacing: "-0.03em", lineHeight: 1,
                fontFamily: "'Outfit', sans-serif",
                display: "inline-block",
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          style={{
            color: "var(--s7-fg-dim)",
            fontSize: "clamp(0.7rem, 1.5vw, 0.875rem)",
            letterSpacing: "0.35em", textTransform: "uppercase",
            fontFamily: "ui-monospace, monospace", textAlign: "center",
          }}
        >
          {t("home.tagline")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.4 }}
          style={{ display: "flex", gap: "1rem", marginTop: "1rem", flexWrap: "wrap", justifyContent: "center" }}
        >
          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: `0 0 32px rgba(34,211,238,0.4)` }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: CYAN, color: "#000",
                padding: "0.75rem 2rem", borderRadius: "9999px",
                fontWeight: 700, fontSize: "0.875rem",
                letterSpacing: "0.05em", border: "none", cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {t("home.cta_project")}
            </motion.button>
          </Link>
          <Link href="/games/rubiks-race">
            <motion.button
              whileHover={{ scale: 1.04, borderColor: "var(--s7-border-2)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: "transparent",
                border: "1px solid var(--s7-border-2)",
                color: "var(--s7-fg)", padding: "0.75rem 2rem",
                borderRadius: "9999px", fontWeight: 600,
                fontSize: "0.875rem", cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
                transition: "border-color 0.2s",
              }}
            >
              {t("home.cta_games")}
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        aria-hidden="true"
        style={{
          position: "absolute", bottom: "2.5rem",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
        }}
      >
        <span style={{
          color: "var(--s7-fg-muted)", fontSize: "0.6rem",
          letterSpacing: "0.25em", textTransform: "uppercase", fontFamily: "monospace",
        }}>
          {t("home.scroll")}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "1px", height: "48px",
            background: `linear-gradient(to bottom, ${CYAN}, transparent)`,
          }}
        />
      </motion.div>
    </section>
  );
}

/* ─── Scene 02: Manifesto ─── */
function SceneManifesto() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  const lines = [
    { text: t("home.manifesto_1"), color: "var(--s7-fg)" },
    { text: t("home.manifesto_2"), color: CYAN },
  ];

  const props = [
    { title: t("home.prop1_title"), desc: t("home.prop1_desc") },
    { title: t("home.prop2_title"), desc: t("home.prop2_desc") },
    { title: t("home.prop3_title"), desc: t("home.prop3_desc") },
  ];

  return (
    <section
      ref={ref}
      style={{ background: "var(--s7-bg)", padding: "18vh 5vw", position: "relative", overflow: "hidden" }}
    >
      <div style={{
        position: "absolute", top: 0, left: "5vw", right: "5vw",
        height: "1px", background: "var(--s7-separator)",
      }} />
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{
            color: CYAN, fontSize: "0.65rem", letterSpacing: "0.35em",
            textTransform: "uppercase", fontFamily: "monospace", marginBottom: "3rem",
          }}
        >
          {t("home.manifesto_id")}
        </motion.p>

        <div style={{ marginBottom: "4rem" }}>
          {lines.map((line, i) => (
            <div key={i} style={{ overflow: "hidden" }}>
              <motion.h2
                initial={{ y: "110%" }}
                animate={inView ? { y: 0 } : {}}
                transition={{ duration: 0.75, delay: 0.1 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontSize: "clamp(2.8rem, 8vw, 7rem)", fontWeight: 900,
                  color: line.color, lineHeight: 1.05, letterSpacing: "-0.04em",
                  margin: 0, fontFamily: "'Outfit', sans-serif",
                }}
              >
                {line.text}
              </motion.h2>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem", maxWidth: "860px" }}>
          {props.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
              style={{ borderLeft: `1px solid var(--s7-border)`, paddingLeft: "1.25rem" }}
            >
              <p style={{ color: "var(--s7-fg)", fontWeight: 600, marginBottom: "0.5rem", fontFamily: "'Outfit', sans-serif" }}>
                {item.title}
              </p>
              <p style={{ color: "var(--s7-fg-dim)", fontSize: "0.875rem", lineHeight: 1.6, margin: 0 }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Scene 03: Products ─── */
function SceneProducts() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [active, setActive] = useState<string | null>(null);

  const products = [
    { id: "games",     label: t("home.product_games"),     symbol: "⬡", desc: t("home.product_games_desc"),     color: CYAN,      delay: 0 },
    { id: "commerce",  label: t("home.product_commerce"),  symbol: "◈", desc: t("home.product_commerce_desc"),  color: VIOLET,    delay: 0.05 },
    { id: "education", label: t("home.product_education"), symbol: "◎", desc: t("home.product_education_desc"), color: "#34d399", delay: 0.1 },
    { id: "health",    label: t("home.product_health"),    symbol: "◇", desc: t("home.product_health_desc"),    color: "#fbbf24", delay: 0.15 },
    { id: "custom",    label: t("home.product_custom"),    symbol: "△", desc: t("home.product_custom_desc"),    color: "#f472b6", delay: 0.2 },
  ];

  return (
    <section style={{ background: "var(--s7-bg-alt)", padding: "16vh 5vw", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: "5vw", right: "5vw", height: "1px", background: "var(--s7-separator)" }} />
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          style={{ color: VIOLET, fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", fontFamily: "monospace", marginBottom: "1rem" }}
        >
          {t("home.products_id")}
        </motion.p>
        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800,
            color: "var(--s7-fg)", letterSpacing: "-0.03em", marginBottom: "5rem",
            fontFamily: "'Outfit', sans-serif", lineHeight: 1.15,
          }}
        >
          {t("home.products_headline")}{" "}
          <span style={{ color: VIOLET }}>{t("home.products_reach")}</span>
        </motion.h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1.25rem" }}>
          {products.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 32, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + p.delay, ease: [0.22, 1, 0.36, 1] }}
              onHoverStart={() => setActive(p.id)}
              onHoverEnd={() => setActive(null)}
              whileHover={{ y: -6 }}
              style={{
                background: active === p.id ? "var(--s7-card-hover)" : "var(--s7-card-bg)",
                border: `1px solid ${active === p.id ? p.color + "55" : "var(--s7-border)"}`,
                borderRadius: "16px", padding: "2rem 1.5rem",
                cursor: "default", transition: "background 0.2s, border-color 0.2s",
                position: "relative", overflow: "hidden",
              }}
            >
              {active === p.id && (
                <div aria-hidden="true" style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  background: `radial-gradient(ellipse at 50% 0%, ${p.color}18 0%, transparent 70%)`,
                }} />
              )}
              <div style={{
                fontSize: "2rem", marginBottom: "1.25rem",
                color: active === p.id ? p.color : "var(--s7-fg-muted)",
                transition: "color 0.2s",
              }}>
                {p.symbol}
              </div>
              <p style={{ color: "var(--s7-fg)", fontWeight: 700, fontSize: "1rem", marginBottom: "0.5rem", fontFamily: "'Outfit', sans-serif" }}>
                {p.label}
              </p>
              <p style={{ color: "var(--s7-fg-dim)", fontSize: "0.8rem", lineHeight: 1.5, margin: 0 }}>
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Phone Mockup ─── */
function PhoneMockup({ screenshotUrl }: { screenshotUrl: string }) {
  return (
    <div style={{
      width: "clamp(200px, 22vw, 280px)",
      aspectRatio: "9/19.5",
      background: "#0d0d0d",
      borderRadius: "2.5rem",
      border: "2px solid rgba(255,255,255,0.12)",
      overflow: "hidden",
      position: "relative",
      boxShadow: `0 0 80px rgba(34,211,238,0.12), 0 60px 120px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)`,
      flexShrink: 0,
    }}>
      {/* Notch */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "1rem", left: "50%",
        transform: "translateX(-50%)", width: "90px", height: "26px",
        background: "#0d0d0d", borderRadius: "20px",
        border: "2px solid rgba(255,255,255,0.08)", zIndex: 10,
      }} />
      {screenshotUrl ? (
        <img
          src={screenshotUrl}
          alt="Game screenshot"
          loading="lazy"
          decoding="async"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <div style={{
          width: "100%", height: "100%",
          background: "linear-gradient(135deg, #0a0a1a 0%, #0d1a2e 50%, #0a0a1a 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "6px", padding: "40px" }}>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} style={{
                width: "32px", height: "32px", borderRadius: "6px",
                background: [CYAN, VIOLET, "#34d399", "#fbbf24", "#f472b6"][i % 5],
                opacity: 0.8,
              }} />
            ))}
          </div>
        </div>
      )}
      {/* Home bar */}
      <div aria-hidden="true" style={{
        position: "absolute", bottom: "0.6rem", left: "50%",
        transform: "translateX(-50%)", width: "80px", height: "4px",
        background: "rgba(255,255,255,0.25)", borderRadius: "9999px",
      }} />
    </div>
  );
}

/* ─── Scene 04: Game ─── */
function SceneGame() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const { content } = useContent();
  const game = content.games[0];
  const screenshot = assetSrc(game?.screenshots?.[0] ?? game?.imageUrl ?? "");

  const features = [
    t("section.feat.levels"),
    t("rubiks.time_attack"),
    t("section.feat.leaderboards"),
    t("section.feat.daily"),
    t("section.feat.dark"),
  ];

  return (
    <section style={{ background: "var(--s7-bg)", position: "relative", overflow: "hidden", padding: "16vh 5vw" }}>
      <div style={{ position: "absolute", top: 0, left: "5vw", right: "5vw", height: "1px", background: "var(--s7-separator)" }} />
      <div aria-hidden="true" style={{
        position: "absolute", right: "-10%", top: "50%", transform: "translateY(-50%)",
        width: "60vw", height: "80%",
        background: `radial-gradient(ellipse, var(--s7-glow-cyan) 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          style={{ color: CYAN, fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", fontFamily: "monospace", marginBottom: "4rem" }}
        >
          {t("home.game_id")}
        </motion.p>

        <div ref={ref} style={{ display: "flex", alignItems: "center", gap: "clamp(3rem, 8vw, 8rem)", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 320px" }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1 }}
              style={{
                display: "inline-block",
                background: `${CYAN}18`, border: `1px solid ${CYAN}44`,
                color: CYAN, fontSize: "0.65rem", letterSpacing: "0.25em",
                textTransform: "uppercase", fontFamily: "monospace",
                padding: "0.35rem 0.9rem", borderRadius: "9999px", marginBottom: "1.5rem",
              }}
            >
              {t("home.game_badge")}
            </motion.div>

            <div style={{ overflow: "hidden", marginBottom: "1rem" }}>
              <motion.h2
                initial={{ y: "110%" }}
                animate={inView ? { y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 900,
                  color: "var(--s7-fg)", letterSpacing: "-0.04em", lineHeight: 1,
                  margin: 0, fontFamily: "'Outfit', sans-serif",
                }}
              >
                Rubik's Race
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.45 }}
              style={{ color: "var(--s7-fg-dim)", fontSize: "clamp(0.9rem, 1.5vw, 1rem)", lineHeight: 1.7, marginBottom: "2.5rem", maxWidth: "480px" }}
            >
              {t("home.game_desc")}
            </motion.p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginBottom: "2.5rem" }}>
              {features.map((f, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.55 + i * 0.07 }}
                  style={{
                    background: "var(--s7-card-bg)", border: "1px solid var(--s7-border)",
                    color: "var(--s7-fg-dim)", fontSize: "0.75rem",
                    padding: "0.4rem 0.9rem", borderRadius: "9999px",
                    fontFamily: "monospace", letterSpacing: "0.05em",
                  }}
                >
                  {f}
                </motion.span>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.85 }}
            >
              <Link href="/games/rubiks-race">
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: `0 0 30px rgba(34,211,238,0.3)` }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background: CYAN, color: "#000",
                    padding: "0.8rem 2rem", borderRadius: "9999px",
                    fontWeight: 700, fontSize: "0.875rem",
                    letterSpacing: "0.05em", border: "none", cursor: "pointer",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  {t("home.game_cta")}
                </motion.button>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 60, rotate: 4 }}
            animate={inView ? { opacity: 1, x: 0, rotate: -2 } : {}}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ rotate: 0, scale: 1.02 }}
            style={{ flex: "0 0 auto" }}
          >
            <PhoneMockup screenshotUrl={screenshot} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Scene 05: Capabilities ─── */
function SceneCapabilities() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [hovered, setHovered] = useState<number | null>(null);

  const capabilities = [
    { label: t("home.cap_games"),  symbol: "⬡", color: CYAN,      desc: t("home.cap_games_desc") },
    { label: t("home.cap_ecom"),   symbol: "◈", color: VIOLET,    desc: t("home.cap_ecom_desc") },
    { label: t("home.cap_edu"),    symbol: "◎", color: "#34d399", desc: t("home.cap_edu_desc") },
    { label: t("home.cap_health"), symbol: "◇", color: "#fbbf24", desc: t("home.cap_health_desc") },
    { label: t("home.cap_custom"), symbol: "△", color: "#f472b6", desc: t("home.cap_custom_desc") },
    { label: t("home.cap_design"), symbol: "○", color: "#fb923c", desc: t("home.cap_design_desc") },
  ];

  return (
    <section style={{ background: "var(--s7-bg-alt)", padding: "16vh 5vw", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: "5vw", right: "5vw", height: "1px", background: "var(--s7-separator)" }} />
      <GridDots opacity={0.03} />

      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          style={{ color: "#34d399", fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", fontFamily: "monospace", marginBottom: "1rem" }}
        >
          {t("home.cap_id")}
        </motion.p>
        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800,
            color: "var(--s7-fg)", letterSpacing: "-0.03em", marginBottom: "4rem",
            fontFamily: "'Outfit', sans-serif", lineHeight: 1.15,
          }}
        >
          {t("home.cap_headline")}{" "}
          <span style={{ color: "#34d399" }}>{t("home.cap_think")}</span>
        </motion.h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1px",
          border: "1px solid var(--s7-border)",
          borderRadius: "16px", overflow: "hidden",
          background: "var(--s7-border)",
        }}>
          {capabilities.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
              onHoverStart={() => setHovered(i)}
              onHoverEnd={() => setHovered(null)}
              style={{
                background: hovered === i ? "var(--s7-card-hover)" : "var(--s7-bg-alt)",
                padding: "2.5rem 2rem",
                cursor: "default", position: "relative", overflow: "hidden",
                transition: "background 0.25s",
              }}
            >
              {hovered === i && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  aria-hidden="true"
                  style={{
                    position: "absolute", inset: 0, pointerEvents: "none",
                    background: `radial-gradient(ellipse at 30% 30%, ${c.color}14 0%, transparent 70%)`,
                  }}
                />
              )}
              <div style={{
                fontSize: "1.8rem",
                color: hovered === i ? c.color : "var(--s7-fg-muted)",
                marginBottom: "1.25rem", transition: "color 0.25s", lineHeight: 1,
              }}>
                {c.symbol}
              </div>
              <p style={{
                color: hovered === i ? "var(--s7-fg)" : "var(--s7-fg-dim)",
                fontWeight: 700, fontSize: "0.95rem",
                marginBottom: "0.4rem", fontFamily: "'Outfit', sans-serif", transition: "color 0.25s",
              }}>
                {c.label}
              </p>
              <p style={{ color: "var(--s7-fg-dim)", fontSize: "0.8rem", margin: 0, lineHeight: 1.5 }}>
                {c.desc}
              </p>
              {hovered === i && (
                <div aria-hidden="true" style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: "2px",
                  background: `linear-gradient(to right, ${c.color}, transparent)`,
                }} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Stat Counter ─── */
function StatCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const isNumber = /\d/.test(value);
  const numericPart = parseFloat(value.replace(/[^\d.]/g, ""));
  const suffix = value.replace(/[\d.]/g, "").trim();
  const count = useCountUp(isNumber ? numericPart : 0, inView, 2000);
  const display = isNumber
    ? (Number.isInteger(numericPart) ? count.toString() : count.toFixed(1)) + suffix
    : value;

  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 900,
          color: "var(--s7-fg)", letterSpacing: "-0.04em", lineHeight: 1,
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        {display}
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{
          color: "var(--s7-fg-dim)", fontSize: "0.75rem",
          letterSpacing: "0.25em", textTransform: "uppercase",
          fontFamily: "monospace", marginTop: "0.75rem",
        }}
      >
        {label}
      </motion.p>
    </div>
  );
}

/* ─── Scene 06: Numbers ─── */
function SceneNumbers() {
  const { t, lang } = useLanguage();
  const { content } = useContent();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const stats = content.stats.length > 0 ? content.stats : [
    { id: "s1", label: { en: "Projects Delivered", fr: "Projets livrés", ar: "مشاريع مكتملة" }, value: "50+" },
    { id: "s2", label: { en: "Active Users", fr: "Utilisateurs actifs", ar: "مستخدم نشط" }, value: "1M+" },
    { id: "s3", label: { en: "App Store Rating", fr: "Note App Store", ar: "تقييم App Store" }, value: "4.9" },
  ];

  return (
    <section style={{ background: "var(--s7-bg)", padding: "16vh 5vw", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: "5vw", right: "5vw", height: "1px", background: "var(--s7-separator)" }} />
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 80% 60% at 50% 50%, var(--s7-glow-violet) 0%, transparent 70%)`,
      }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <motion.p
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          style={{
            color: VIOLET, fontSize: "0.65rem", letterSpacing: "0.35em",
            textTransform: "uppercase", fontFamily: "monospace",
            marginBottom: "5rem", textAlign: "center",
          }}
        >
          {t("home.numbers_id")}
        </motion.p>

        <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(stats.length, 3)}, 1fr)`, gap: "2rem" }}>
          {stats.slice(0, 3).map((stat) => {
            const labelObj = stat.label as { en?: string; fr?: string; ar?: string } | string;
            const label = typeof labelObj === "string"
              ? labelObj
              : labelObj[lang as keyof typeof labelObj] ?? labelObj.en ?? "";
            return <StatCounter key={stat.id} value={stat.value} label={label} />;
          })}
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: "1px", marginTop: "6rem",
            background: `linear-gradient(to right, transparent, ${VIOLET}, transparent)`,
            transformOrigin: "left",
          }}
        />
      </div>
    </section>
  );
}

/* ─── Scene 07: Transmit ─── */
function SceneTransmit() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const { content } = useContent();

  return (
    <section
      ref={ref}
      style={{
        background: "var(--s7-bg)", minHeight: "70vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "16vh 5vw", position: "relative", overflow: "hidden",
      }}
    >
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 70% 70% at 50% 50%, var(--s7-glow-cyan) 0%, transparent 70%)`,
      }} />
      <GridDots opacity={0.04} />

      <div style={{ textAlign: "center", zIndex: 1 }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          style={{ color: CYAN, fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", fontFamily: "monospace", marginBottom: "2rem" }}
        >
          {t("home.transmit_id")}
        </motion.p>

        <div style={{ overflow: "hidden", marginBottom: "0.5rem" }}>
          <motion.h2
            initial={{ y: "110%" }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: "clamp(3rem, 9vw, 7.5rem)", fontWeight: 900,
              color: "var(--s7-fg)", letterSpacing: "-0.04em", lineHeight: 1,
              margin: 0, fontFamily: "'Outfit', sans-serif",
            }}
          >
            {t("home.transmit_1")}
          </motion.h2>
        </div>

        <div style={{ overflow: "hidden", marginBottom: "3rem" }}>
          <motion.h2
            initial={{ y: "110%" }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: "clamp(3rem, 9vw, 7.5rem)", fontWeight: 900,
              color: CYAN, letterSpacing: "-0.04em", lineHeight: 1,
              margin: 0, fontFamily: "'Outfit', sans-serif",
            }}
          >
            {t("home.transmit_2")}
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
        >
          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: `0 0 40px rgba(34,211,238,0.4)` }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: CYAN, color: "#000",
                padding: "1rem 2.5rem", borderRadius: "9999px",
                fontWeight: 700, fontSize: "1rem",
                letterSpacing: "0.05em", border: "none", cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {t("home.transmit_cta")}
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{ marginTop: "4rem", display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap" }}
        >
          {[
            { label: "Twitter", href: content.contactInfo.social.twitter },
            { label: "LinkedIn", href: content.contactInfo.social.linkedin },
            { label: "Instagram", href: content.contactInfo.social.instagram },
            { label: "GitHub", href: content.contactInfo.social.github },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              style={{
                color: "var(--s7-fg-muted)", fontSize: "0.75rem",
                letterSpacing: "0.15em", textTransform: "uppercase",
                textDecoration: "none", fontFamily: "monospace",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--s7-fg)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--s7-fg-muted)")}
            >
              {s.label}
            </a>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1 }}
          style={{ color: "var(--s7-fg-muted)", fontSize: "0.7rem", fontFamily: "monospace", marginTop: "3rem", letterSpacing: "0.1em" }}
        >
          {t("home.copyright").replace("{year}", String(new Date().getFullYear()))}
        </motion.p>
      </div>
    </section>
  );
}

/* ─── Export ─── */
export default function Home() {
  return (
    <PublicLayout>
      <SceneEntry />
      <SceneManifesto />
      <SceneProducts />
      <SceneGame />
      <SceneCapabilities />
      <SceneNumbers />
      <SceneTransmit />
    </PublicLayout>
  );
}
