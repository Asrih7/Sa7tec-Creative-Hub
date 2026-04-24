import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Trophy, Clock, Zap, Download } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/lib/i18n";
import { useContent } from "@/lib/content-store";
import { assetSrc } from "@/lib/assets";

export default function RubiksRace() {
  const [activeImage, setActiveImage] = useState(0);
  const { t, tr } = useLanguage();
  const { content } = useContent();

  const game = content.games[0];
  const rawShots = (game?.screenshots ?? []).filter(Boolean);
  const screenshots = (rawShots.length > 0 ? rawShots : [game?.imageUrl].filter(Boolean) as string[]).map(assetSrc);

  return (
    <PublicLayout>
      <div className="pt-24 pb-10 bg-background relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/40 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-secondary/40 blur-[120px] rounded-full mix-blend-screen" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
            {t("rubiks.back")}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
                  {game ? tr(game.statusBadge) : t("rubiks.flagship")}
                </div>
                <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-4">
                  {game ? tr(game.title) : <span><span>Rubik's </span><span className="text-gradient">Race</span></span>}
                </h1>
                <p className="text-2xl font-light text-muted-foreground">
                  {game ? tr(game.subtitle) : t("rubiks.subtitle")}
                </p>
              </div>

              <p className="text-lg leading-relaxed text-foreground/80">
                {game ? tr(game.description) : t("rubiks.desc")}
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg" dir="ltr">5,000+</h4>
                    <p className="text-sm text-muted-foreground">{t("rubiks.levels")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{t("rubiks.time_attack")}</h4>
                    <p className="text-sm text-muted-foreground">{t("rubiks.global_lb")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-lime-500/10 flex items-center justify-center text-lime-500">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg" dir="ltr">60 FPS</h4>
                    <p className="text-sm text-muted-foreground">{t("rubiks.smooth")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{t("rubiks.daily")}</h4>
                    <p className="text-sm text-muted-foreground">{t("rubiks.special")}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <Button size="lg" className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full glow-cyan w-full sm:w-auto" disabled>
                  <Download className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t("rubiks.coming_ios")}
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-border hover:bg-white/5 w-full sm:w-auto" disabled>
                  <Download className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t("rubiks.coming_android")}
                </Button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-[9/19] max-w-[320px] mx-auto rounded-[3rem] p-3 glass-panel border border-white/10 glow-violet shadow-2xl">
                <div className="absolute top-0 inset-x-0 h-6 flex justify-center">
                  <div className="w-32 h-6 bg-black rounded-b-3xl"></div>
                </div>
                
                <div className="relative w-full h-full rounded-[2.25rem] overflow-hidden bg-black">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeImage}
                      src={screenshots[activeImage]}
                      alt="Rubik's Race Gameplay"
                      initial={{ opacity: 0, filter: "blur(10px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, filter: "blur(10px)" }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex justify-center gap-4 mt-8">
                {screenshots.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-16 h-24 rounded-xl overflow-hidden transition-all duration-300 ${
                      activeImage === idx 
                        ? "ring-2 ring-primary scale-110 shadow-lg shadow-primary/20" 
                        : "opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img src={src} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
