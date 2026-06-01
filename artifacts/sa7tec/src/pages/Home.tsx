import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useContent } from "@/lib/content-store";
import { useLanguage } from "@/lib/i18n";
import { assetSrc } from "@/lib/assets";

const CYAN = "#22d3ee";
const VIOLET = "#a78bfa";

function useCountUp(target: number, inView: boolean, duration = 2200) {
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

function GridDots({ opacity = 0.06 }: { opacity?: number }) {
  return (
    <div
      style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,${opacity}) 1px, transparent 1px)`,
        backgroundSize: "36px 36px",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
      }}
    />
  );
}

function SceneEntry() {
  const letters = "SA7TEC".split("");
  return (
    <section
      style={{
        minHeight: "100dvh", background: "#000", display: "flex",
        flexDirection: "column", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
      }}
    >
      <GridDots />

      <div style={{
        position: "absolute", width: "70vw", height: "50vh", maxWidth: "900px",
        background: `radial-gradient(ellipse, rgba(34,211,238,0.07) 0%, transparent 70%)`,
        top: "50%", left: "50%", transform: "translate(-50%,-55%)", pointerEvents: "none",
      }} />

      <div style={{
        position: "absolute", width: "40vw", height: "40vh", maxWidth: "500px",
        background: `radial-gradient(ellipse, rgba(167,139,250,0.06) 0%, transparent 70%)`,
        bottom: "10%", right: "5%", pointerEvents: "none",
      }} />

      <div style={{ zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: "0.65rem", letterSpacing: "0.35em",
            textTransform: "uppercase", color: CYAN, marginBottom: "0.5rem",
          }}
        >
          SA7TEC — 2025
        </motion.div>

        <div style={{ display: "flex", gap: "0.02em" }}>
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 50, rotateX: -40 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: "clamp(4.5rem, 14vw, 10rem)",
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "-0.03em",
                lineHeight: 1,
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
            color: "rgba(255,255,255,0.35)",
            fontSize: "clamp(0.7rem, 1.5vw, 0.875rem)",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            fontFamily: "ui-monospace, monospace",
            textAlign: "center",
          }}
        >
          From Idea to Reality
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.4 }}
          style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}
        >
          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: `0 0 30px rgba(34,211,238,0.35)` }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: CYAN, color: "#000",
                padding: "0.75rem 2rem", borderRadius: "9999px",
                fontWeight: 700, fontSize: "0.875rem",
                letterSpacing: "0.05em", border: "none", cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              Start a Project
            </motion.button>
          </Link>
          <Link href="/games/rubiks-race">
            <motion.button
              whileHover={{ scale: 1.04, borderColor: "rgba(255,255,255,0.5)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "#fff", padding: "0.75rem 2rem",
                borderRadius: "9999px", fontWeight: 600,
                fontSize: "0.875rem", cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
                transition: "border-color 0.2s",
              }}
            >
              See Our Games
            </motion.button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        style={{
          position: "absolute", bottom: "2.5rem",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
        }}
      >
        <span style={{
          color: "rgba(255,255,255,0.25)", fontSize: "0.6rem",
          letterSpacing: "0.25em", textTransform: "uppercase", fontFamily: "monospace",
        }}>
          Scroll
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

function SceneManifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const lines = [
    { text: "Not a studio.", color: "#fff" },
    { text: "A signal.", color: CYAN },
  ];
  return (
    <section
      ref={ref}
      style={{
        background: "#000", padding: "18vh 5vw",
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: "5vw", right: "5vw",
        height: "1px", background: "rgba(255,255,255,0.05)",
      }} />
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{
            color: CYAN, fontSize: "0.65rem",
            letterSpacing: "0.35em", textTransform: "uppercase",
            fontFamily: "monospace", marginBottom: "3rem",
          }}
        >
          01 — WHAT WE ARE
        </motion.p>

        <div style={{ marginBottom: "4rem" }}>
          {lines.map((line, i) => (
            <div key={i} style={{ overflow: "hidden" }}>
              <motion.h2
                initial={{ y: "110%" }}
                animate={inView ? { y: 0 } : {}}
                transition={{ duration: 0.75, delay: 0.1 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontSize: "clamp(2.8rem, 8vw, 7rem)",
                  fontWeight: 900, color: line.color,
                  lineHeight: 1.05, letterSpacing: "-0.04em",
                  margin: 0, fontFamily: "'Outfit', sans-serif",
                }}
              >
                {line.text}
              </motion.h2>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2rem", maxWidth: "860px" }}>
          {[
            { label: "Mobile-first", desc: "Every pixel built for the phone you hold." },
            { label: "Product-native", desc: "We think in products, not deliverables." },
            { label: "Universe-scale", desc: "Each app is a world. We architect worlds." },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
              style={{
                borderLeft: `1px solid rgba(255,255,255,0.08)`,
                paddingLeft: "1.25rem",
              }}
            >
              <p style={{ color: "rgba(255,255,255,0.9)", fontWeight: 600, marginBottom: "0.5rem", fontFamily: "'Outfit', sans-serif" }}>
                {item.label}
              </p>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.875rem", lineHeight: 1.6, margin: 0 }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const PRODUCTS = [
  { id: "games", label: "Games", symbol: "⬡", desc: "Immersive puzzles & arcade", color: CYAN, delay: 0 },
  { id: "commerce", label: "Commerce", symbol: "◈", desc: "Next-gen shopping flows", color: VIOLET, delay: 0.05 },
  { id: "education", label: "Education", symbol: "◎", desc: "Interactive learning worlds", color: "#34d399", delay: 0.1 },
  { id: "health", label: "Health", symbol: "◇", desc: "Wellness & fitness systems", color: "#fbbf24", delay: 0.15 },
  { id: "custom", label: "Custom", symbol: "△", desc: "Bespoke digital products", color: "#f472b6", delay: 0.2 },
];

function SceneProducts() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [active, setActive] = useState<string | null>(null);

  return (
    <section
      style={{
        background: "#030303", padding: "16vh 5vw",
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: "5vw", right: "5vw",
        height: "1px", background: "rgba(255,255,255,0.05)",
      }} />
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          style={{
            color: VIOLET, fontSize: "0.65rem",
            letterSpacing: "0.35em", textTransform: "uppercase",
            fontFamily: "monospace", marginBottom: "1rem",
          }}
        >
          02 — PRODUCT UNIVERSE
        </motion.p>
        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800,
            color: "#fff", letterSpacing: "-0.03em", marginBottom: "5rem",
            fontFamily: "'Outfit', sans-serif", lineHeight: 1.15,
          }}
        >
          Five domains. <span style={{ color: VIOLET }}>Infinite reach.</span>
        </motion.h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {PRODUCTS.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 32, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + p.delay, ease: [0.22, 1, 0.36, 1] }}
              onHoverStart={() => setActive(p.id)}
              onHoverEnd={() => setActive(null)}
              whileHover={{ y: -6 }}
              style={{
                background: active === p.id ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${active === p.id ? p.color + "55" : "rgba(255,255,255,0.07)"}`,
                borderRadius: "16px", padding: "2rem 1.5rem",
                cursor: "default", transition: "background 0.2s, border-color 0.2s",
                position: "relative", overflow: "hidden",
              }}
            >
              {active === p.id && (
                <div style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  background: `radial-gradient(ellipse at 50% 0%, ${p.color}18 0%, transparent 70%)`,
                }} />
              )}
              <div style={{
                fontSize: "2rem", marginBottom: "1.25rem",
                color: active === p.id ? p.color : "rgba(255,255,255,0.3)",
                transition: "color 0.2s",
              }}>
                {p.symbol}
              </div>
              <p style={{
                color: "#fff", fontWeight: 700, fontSize: "1rem",
                marginBottom: "0.5rem", fontFamily: "'Outfit', sans-serif",
              }}>
                {p.label}
              </p>
              <p style={{
                color: "rgba(255,255,255,0.35)", fontSize: "0.8rem",
                lineHeight: 1.5, margin: 0,
              }}>
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
      boxShadow: `0 0 80px rgba(34,211,238,0.12), 0 60px 120px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)`,
      flexShrink: 0,
    }}>
      <div style={{
        position: "absolute", top: "1rem", left: "50%",
        transform: "translateX(-50%)", width: "90px", height: "26px",
        background: "#0d0d0d", borderRadius: "20px",
        border: "2px solid rgba(255,255,255,0.08)", zIndex: 10,
      }} />
      {screenshotUrl ? (
        <img
          src={screenshotUrl}
          alt="Game screenshot"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <div style={{
          width: "100%", height: "100%",
          background: "linear-gradient(135deg, #0a0a1a 0%, #0d1a2e 50%, #0a0a1a 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "6px",
            padding: "40px",
          }}>
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
      <div style={{
        position: "absolute", bottom: "0.6rem", left: "50%",
        transform: "translateX(-50%)", width: "80px", height: "4px",
        background: "rgba(255,255,255,0.25)", borderRadius: "9999px",
      }} />
    </div>
  );
}

function SceneGame() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const { content } = useContent();
  const game = content.games[0];
  const screenshot = assetSrc(game?.screenshots?.[0] ?? game?.imageUrl ?? "");

  const features = ["5,000+ Levels", "Time Attack", "Global Leaderboards", "Daily Challenges", "Neon Aesthetic"];

  return (
    <section
      style={{
        background: "#000", position: "relative",
        overflow: "hidden", padding: "16vh 5vw",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: "5vw", right: "5vw",
        height: "1px", background: "rgba(255,255,255,0.05)",
      }} />
      <div style={{
        position: "absolute", right: "-10%", top: "50%", transform: "translateY(-50%)",
        width: "60vw", height: "80%",
        background: `radial-gradient(ellipse, rgba(34,211,238,0.04) 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          style={{
            color: CYAN, fontSize: "0.65rem",
            letterSpacing: "0.35em", textTransform: "uppercase",
            fontFamily: "monospace", marginBottom: "4rem",
          }}
        >
          03 — FLAGSHIP TITLE
        </motion.p>

        <div
          ref={ref}
          style={{
            display: "flex", alignItems: "center",
            gap: "clamp(3rem, 8vw, 8rem)",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "1 1 320px" }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1 }}
              style={{
                display: "inline-block",
                background: `${CYAN}18`, border: `1px solid ${CYAN}44`,
                color: CYAN, fontSize: "0.65rem",
                letterSpacing: "0.25em", textTransform: "uppercase",
                fontFamily: "monospace", padding: "0.35rem 0.9rem",
                borderRadius: "9999px", marginBottom: "1.5rem",
              }}
            >
              Live on App Store
            </motion.div>

            <div style={{ overflow: "hidden", marginBottom: "1rem" }}>
              <motion.h2
                initial={{ y: "110%" }}
                animate={inView ? { y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 5rem)",
                  fontWeight: 900, color: "#fff",
                  letterSpacing: "-0.04em", lineHeight: 1,
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
              style={{
                color: "rgba(255,255,255,0.4)", fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
                lineHeight: 1.7, marginBottom: "2.5rem", maxWidth: "480px",
              }}
            >
              A colorful timed puzzle with 5,000 levels. Match colors, beat the clock, climb global rankings.
            </motion.p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginBottom: "2.5rem" }}>
              {features.map((f, i) => (
                <motion.span
                  key={f}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.55 + i * 0.07 }}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.6)", fontSize: "0.75rem",
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
                  Explore the Game →
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

const CAPABILITIES = [
  { label: "Mobile Games", symbol: "⬡", color: CYAN, desc: "Puzzle, arcade, strategy" },
  { label: "E-Commerce", symbol: "◈", color: VIOLET, desc: "Shop, checkout, loyalty" },
  { label: "Education", symbol: "◎", color: "#34d399", desc: "Learn, quiz, progress" },
  { label: "Health & Fitness", symbol: "◇", color: "#fbbf24", desc: "Track, plan, motivate" },
  { label: "Custom Apps", symbol: "△", color: "#f472b6", desc: "Bespoke solutions" },
  { label: "UI / UX Design", symbol: "○", color: "#fb923c", desc: "Interface that moves" },
];

function SceneCapabilities() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      style={{
        background: "#030303", padding: "16vh 5vw",
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: "5vw", right: "5vw",
        height: "1px", background: "rgba(255,255,255,0.05)",
      }} />
      <GridDots opacity={0.03} />

      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          style={{
            color: "#34d399", fontSize: "0.65rem",
            letterSpacing: "0.35em", textTransform: "uppercase",
            fontFamily: "monospace", marginBottom: "1rem",
          }}
        >
          04 — CAPABILITIES
        </motion.p>
        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800,
            color: "#fff", letterSpacing: "-0.03em", marginBottom: "4rem",
            fontFamily: "'Outfit', sans-serif", lineHeight: 1.15,
          }}
        >
          What we build.{" "}
          <span style={{ color: "#34d399" }}>How we think.</span>
        </motion.h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1px",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "16px",
          overflow: "hidden",
          background: "rgba(255,255,255,0.06)",
        }}>
          {CAPABILITIES.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
              onHoverStart={() => setHovered(i)}
              onHoverEnd={() => setHovered(null)}
              whileHover={{ zIndex: 1 }}
              style={{
                background: hovered === i ? "rgba(255,255,255,0.04)" : "#030303",
                padding: "2.5rem 2rem",
                cursor: "default",
                position: "relative", overflow: "hidden",
                transition: "background 0.25s",
              }}
            >
              {hovered === i && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: "absolute", inset: 0, pointerEvents: "none",
                    background: `radial-gradient(ellipse at 30% 30%, ${c.color}14 0%, transparent 70%)`,
                  }}
                />
              )}
              <div style={{
                fontSize: "1.8rem",
                color: hovered === i ? c.color : "rgba(255,255,255,0.2)",
                marginBottom: "1.25rem", transition: "color 0.25s",
                lineHeight: 1,
              }}>
                {c.symbol}
              </div>
              <p style={{
                color: hovered === i ? "#fff" : "rgba(255,255,255,0.75)",
                fontWeight: 700, fontSize: "0.95rem",
                marginBottom: "0.4rem", fontFamily: "'Outfit', sans-serif",
                transition: "color 0.25s",
              }}>
                {c.label}
              </p>
              <p style={{
                color: "rgba(255,255,255,0.3)", fontSize: "0.8rem",
                margin: 0, lineHeight: 1.5,
              }}>
                {c.desc}
              </p>
              {hovered === i && (
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  height: "2px",
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

function StatCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const isNumber = /[\d]+/.test(value);
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
          fontSize: "clamp(3rem, 8vw, 6rem)",
          fontWeight: 900, color: "#fff",
          letterSpacing: "-0.04em", lineHeight: 1,
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
          color: "rgba(255,255,255,0.3)", fontSize: "0.75rem",
          letterSpacing: "0.25em", textTransform: "uppercase",
          fontFamily: "monospace", marginTop: "0.75rem",
        }}
      >
        {label}
      </motion.p>
    </div>
  );
}

function SceneNumbers() {
  const { content } = useContent();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const stats = content.stats.length > 0 ? content.stats : [
    { id: "s1", label: { en: "Projects Delivered" }, value: "50+" },
    { id: "s2", label: { en: "Active Users" }, value: "1M+" },
    { id: "s3", label: { en: "App Store Rating" }, value: "4.9" },
  ];

  return (
    <section
      style={{
        background: "#000", padding: "16vh 5vw",
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: "5vw", right: "5vw",
        height: "1px", background: "rgba(255,255,255,0.05)",
      }} />
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 80% 60% at 50% 50%, rgba(167,139,250,0.04) 0%, transparent 70%)`,
      }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <motion.p
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          style={{
            color: VIOLET, fontSize: "0.65rem",
            letterSpacing: "0.35em", textTransform: "uppercase",
            fontFamily: "monospace", marginBottom: "5rem", textAlign: "center",
          }}
        >
          05 — BY THE NUMBERS
        </motion.p>

        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(stats.length, 3)}, 1fr)`,
          gap: "2rem",
        }}>
          {stats.slice(0, 3).map((stat) => (
            <StatCounter
              key={stat.id}
              value={stat.value}
              label={typeof stat.label === "string" ? stat.label : stat.label.en}
            />
          ))}
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

function SceneTransmit() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const { content } = useContent();

  return (
    <section
      ref={ref}
      style={{
        background: "#000", minHeight: "70vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "16vh 5vw", position: "relative", overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 70% 70% at 50% 50%, rgba(34,211,238,0.06) 0%, transparent 70%)`,
      }} />
      <GridDots opacity={0.04} />

      <div style={{ textAlign: "center", zIndex: 1 }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          style={{
            color: CYAN, fontSize: "0.65rem",
            letterSpacing: "0.35em", textTransform: "uppercase",
            fontFamily: "monospace", marginBottom: "2rem",
          }}
        >
          06 — TRANSMISSION
        </motion.p>

        <div style={{ overflow: "hidden", marginBottom: "0.5rem" }}>
          <motion.h2
            initial={{ y: "110%" }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: "clamp(3rem, 9vw, 7.5rem)",
              fontWeight: 900, color: "#fff",
              letterSpacing: "-0.04em", lineHeight: 1,
              margin: 0, fontFamily: "'Outfit', sans-serif",
            }}
          >
            Got an idea?
          </motion.h2>
        </div>

        <div style={{ overflow: "hidden", marginBottom: "3rem" }}>
          <motion.h2
            initial={{ y: "110%" }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: "clamp(3rem, 9vw, 7.5rem)",
              fontWeight: 900, color: CYAN,
              letterSpacing: "-0.04em", lineHeight: 1,
              margin: 0, fontFamily: "'Outfit', sans-serif",
            }}
          >
            Let's build.
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
              Transmit your idea →
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{
            marginTop: "4rem",
            display: "flex", gap: "2rem", justifyContent: "center",
            flexWrap: "wrap",
          }}
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
              style={{
                color: "rgba(255,255,255,0.25)",
                fontSize: "0.75rem", letterSpacing: "0.15em",
                textTransform: "uppercase", textDecoration: "none",
                fontFamily: "monospace", transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
            >
              {s.label}
            </a>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1 }}
          style={{
            color: "rgba(255,255,255,0.12)", fontSize: "0.7rem",
            fontFamily: "monospace", marginTop: "3rem", letterSpacing: "0.1em",
          }}
        >
          © {new Date().getFullYear()} SA7TEC — All rights reserved
        </motion.p>
      </div>
    </section>
  );
}

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
