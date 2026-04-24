import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronRight, Hexagon } from "lucide-react";
import { useContent } from "@/lib/content-store";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function PublicLayout({ children }: { children: ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { content } = useContent();
  const { t, tr } = useLanguage();
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.games"), path: "/games/rubiks-race" },
    { name: t("nav.contact"), path: "/contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-primary-foreground">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border/50 py-3 shadow-lg shadow-black/5" : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500 overflow-hidden">
              <Hexagon className="w-6 h-6 absolute" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl leading-none tracking-tight text-foreground">{content.siteInfo.title}</span>
              <span className="text-[10px] font-medium text-primary uppercase tracking-widest leading-none mt-0.5">{tr(content.siteInfo.tagline)}</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === link.path ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <LanguageSwitcher variant="header" />
            <Link href="/contact">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 rounded-full shadow-[0_0_15px_-3px_hsl(var(--primary))] hover:shadow-[0_0_25px_-3px_hsl(var(--primary))] transition-all duration-300">
                {t("cta.start_project")}
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher variant="header" />
            <button
              className="p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24 px-6 md:hidden flex flex-col"
          >
            <nav className="flex flex-col gap-6 text-2xl font-display font-semibold">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between border-b border-border pb-4 ${
                    location === link.path ? "text-primary" : "text-foreground"
                  }`}
                >
                  {link.name}
                  <ChevronRight className="w-5 h-5 opacity-50" />
                </Link>
              ))}
              <div className="pt-4">
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button size="lg" className="w-full bg-primary text-primary-foreground rounded-full text-lg h-14">
                    {t("cta.start_your_project")}
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border pt-20 pb-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, hsl(var(--primary)) 0%, transparent 70%)', backgroundPosition: 'center -500px', backgroundSize: '1000px 1000px', backgroundRepeat: 'no-repeat' }} />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 group mb-6">
                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500 overflow-hidden">
                  <Hexagon className="w-6 h-6 absolute" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-2xl leading-none tracking-tight text-foreground">{content.siteInfo.title}</span>
                </div>
              </Link>
              <p className="text-muted-foreground max-w-md text-lg leading-relaxed mb-8">
                {tr(content.siteInfo.aboutText)}
              </p>
              <div className="flex gap-4">
                <a href={content.contactInfo.social.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary hover:bg-secondary hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </a>
                <a href={content.contactInfo.social.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary hover:bg-secondary hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                </a>
                <a href={content.contactInfo.social.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary hover:bg-secondary hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-display font-semibold text-lg mb-6 text-foreground">{t("footer.explore")}</h4>
              <ul className="space-y-3">
                <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.home")}</Link></li>
                <li><Link href="/games/rubiks-race" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.games")}</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.contact")}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-display font-semibold text-lg mb-6 text-foreground">{t("footer.contact")}</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li className="hover:text-foreground transition-colors"><a href={`mailto:${content.contactInfo.email}`}>{content.contactInfo.email}</a></li>
                <li className="hover:text-foreground transition-colors"><a href={`tel:${content.contactInfo.phone}`} dir="ltr">{content.contactInfo.phone}</a></li>
                <li>{tr(content.contactInfo.address)}</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} SA7TEC Studio. {t("footer.rights")}</p>
            <div className="mt-4 md:mt-0 flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">{t("footer.privacy")}</a>
              <a href="#" className="hover:text-foreground transition-colors">{t("footer.terms")}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
