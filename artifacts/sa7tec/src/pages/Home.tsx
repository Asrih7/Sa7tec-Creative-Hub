import { motion } from "framer-motion";
import { Link } from "wouter";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useContent } from "@/lib/content-store";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight, Gamepad2, ShoppingCart, GraduationCap, HeartPulse, Smartphone, Layers, Code, Zap } from "lucide-react";

const IconMap: Record<string, any> = {
  Gamepad2, ShoppingCart, GraduationCap, HeartPulse, Smartphone
};

export default function Home() {
  const { content } = useContent();
  const { t, tr, lang } = useLanguage();

  const heroHeadline = tr(content.siteInfo.heroHeadline);
  const featureKeys = ["section.feat.levels", "section.feat.dark", "section.feat.leaderboards", "section.feat.daily"] as const;

  return (
    <PublicLayout>
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-[#091223] z-0" />
        
        <div 
          className="absolute inset-0 z-0 opacity-40 mix-blend-screen"
          style={{ 
            backgroundImage: `url(${import.meta.env.BASE_URL}assets/hero-bg.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 blur-[150px] rounded-full z-0" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/20 blur-[150px] rounded-full z-0" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-slate-300 mb-8 backdrop-blur-md">
              <span className="flex w-2 h-2 rounded-full bg-primary mr-2 rtl:mr-0 rtl:ml-2 animate-pulse" />
              {tr(content.siteInfo.tagline)}
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-tight mb-6 text-white">
              {heroHeadline.split(' ').map((word, i) => {
                const lower = word.toLowerCase();
                const accent = lang === 'en'
                  ? lower === 'matter'
                  : lang === 'fr'
                    ? lower === 'comptent'
                    : word === 'أثرًا';
                return accent ? (
                  <span key={i} className="text-gradient"> {word}</span>
                ) : (
                  <span key={i}> {word}</span>
                );
              })}
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              {tr(content.siteInfo.heroSubheadline)}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full text-lg glow-cyan transition-all hover:scale-105">
                  {t("cta.start_your_project")}
                  <ArrowRight className="w-5 h-5 ml-2 rtl:ml-0 rtl:mr-2" />
                </Button>
              </Link>
              <Link href="/games/rubiks-race">
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-white/20 text-white hover:bg-white/10 text-lg backdrop-blur-sm transition-all">
                  {t("cta.view_flagship")}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <section className="py-24 relative bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">{t("section.what_we_build")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("section.what_we_build_sub")}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.services.map((service, i) => {
              const Icon = IconMap[service.iconName] || Smartphone;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 group"
                >
                  <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center text-white
                    ${service.color === 'cyan' ? 'bg-primary/20 text-primary glow-cyan' : ''}
                    ${service.color === 'violet' ? 'bg-secondary/20 text-secondary glow-violet' : ''}
                    ${service.color === 'lime' ? 'bg-lime-500/20 text-lime-500 shadow-[0_0_20px_-5px_rgba(132,204,22,0.5)]' : ''}
                    ${service.color === 'orange' ? 'bg-orange-500/20 text-orange-500 shadow-[0_0_20px_-5px_rgba(249,115,22,0.5)]' : ''}
                  `}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-display font-bold mb-3 group-hover:text-primary transition-colors">{tr(service.title)}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {tr(service.description)}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 3. FEATURED GAME: RUBIK'S RACE */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative h-[600px] w-full max-w-[400px] mx-auto">
                <div className="absolute top-10 left-[-20px] w-64 aspect-[9/19] rounded-[2.5rem] overflow-hidden border border-white/20 shadow-2xl opacity-60 rotate-[-10deg] blur-[2px] transition-all duration-500 hover:blur-none hover:opacity-100 hover:rotate-[-5deg] hover:z-20">
                  <img src={`${import.meta.env.BASE_URL}assets/rubiks-loading.jpg`} alt="Loading" className="w-full h-full object-cover" />
                </div>
                <div className="absolute top-20 right-[-20px] w-64 aspect-[9/19] rounded-[2.5rem] overflow-hidden border border-white/20 shadow-2xl opacity-60 rotate-[10deg] blur-[2px] transition-all duration-500 hover:blur-none hover:opacity-100 hover:rotate-[5deg] hover:z-20">
                  <img src={`${import.meta.env.BASE_URL}assets/rubiks-game.jpg`} alt="Game" className="w-full h-full object-cover" />
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[280px] aspect-[9/19] rounded-[2.5rem] overflow-hidden border border-white/30 shadow-[0_0_50px_-12px_hsl(var(--secondary))] z-10">
                  <img src={`${import.meta.env.BASE_URL}assets/rubiks-challenge.jpg`} alt="Challenge" className="w-full h-full object-cover" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary mb-6 glow-violet">
                {t("section.flagship_badge")}
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
                Rubik's <span className="text-gradient">Race</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {t("section.flagship_desc")}
              </p>
              
              <ul className="space-y-4 mb-10">
                {featureKeys.map((key, i) => (
                  <li key={i} className="flex items-center text-lg">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 rtl:mr-0 rtl:ml-3 text-primary">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    {t(key)}
                  </li>
                ))}
              </ul>
              
              <Link href="/games/rubiks-race">
                <Button size="lg" className="h-14 px-8 rounded-full bg-white text-black hover:bg-slate-200 font-bold text-lg">
                  {t("cta.explore_game")}
                  <ChevronRight className="w-5 h-5 ml-1 rtl:ml-0 rtl:mr-1" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. PORTFOLIO GALLERY */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">{t("section.portfolio")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("section.portfolio_sub")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.portfolioItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-6 bg-card border border-border">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <img 
                    src={`${import.meta.env.BASE_URL}${item.imageUrl.replace('/assets/', 'assets/')}`} 
                    alt={tr(item.title)} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-6 left-6 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                    <Button variant="secondary" size="sm" className="rounded-full rounded-b-none bg-primary/90 text-white hover:bg-primary">
                      {t("section.portfolio_view")}
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-primary font-medium mb-1">{tr(item.category)}</div>
                  <h3 className="text-2xl font-display font-bold mb-2">{tr(item.title)}</h3>
                  <p className="text-muted-foreground">{tr(item.description)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. STATS STRIP */}
      <section className="py-16 border-y border-border bg-card/50 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border">
            {content.stats.map((stat, i) => (
              <motion.div 
                key={stat.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="py-4 md:py-0"
              >
                <div className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-2" dir="ltr">{stat.value}</div>
                <div className="text-sm md:text-base text-primary uppercase tracking-widest font-semibold">{tr(stat.label)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PROCESS */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">{t("section.process")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("section.process_sub")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary/10 via-primary/50 to-secondary/10 -z-10" />

            {content.processSteps.map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="w-24 h-24 mx-auto bg-[#091223] border-2 border-primary/30 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_-10px_hsl(var(--primary))] relative z-10">
                  {i === 0 && <Layers className="w-10 h-10 text-primary" />}
                  {i === 1 && <Gamepad2 className="w-10 h-10 text-primary" />}
                  {i === 2 && <Code className="w-10 h-10 text-primary" />}
                  {i === 3 && <Zap className="w-10 h-10 text-primary" />}
                  <div className="absolute -top-3 -right-3 rtl:-right-auto rtl:-left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-xl font-display font-bold mb-3">{tr(step.title)}</h3>
                <p className="text-muted-foreground">{tr(step.description)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="glass-panel border-primary/20 bg-[#132442]/80 p-12 md:p-20 rounded-[3rem] text-center max-w-5xl mx-auto shadow-[0_0_50px_-12px_hsl(var(--primary))]">
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">{t("section.cta_headline")}</h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              {t("section.cta_sub")}
            </p>
            <Link href="/contact">
              <Button size="lg" className="h-16 px-10 text-xl rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold glow-cyan transition-transform hover:scale-105">
                {t("cta.start_today")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
