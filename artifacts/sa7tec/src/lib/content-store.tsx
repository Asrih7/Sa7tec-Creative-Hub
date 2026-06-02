import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { z } from "zod";
import type { LocalizedString } from "@/lib/i18n";
import { normalizeInput } from "@/lib/security";

const ContactSubmissionSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  projectType: z.string(),
  budgetRange: z.string(),
  message: z.string(),
  date: z.string(),
});

type ContactSubmission = z.infer<typeof ContactSubmissionSchema>;

export interface SiteContent {
  siteInfo: {
    title: string;
    tagline: LocalizedString;
    heroHeadline: LocalizedString;
    heroSubheadline: LocalizedString;
    aboutText: LocalizedString;
    heroBackgroundUrl?: string;
  };
  services: Array<{
    id: string;
    title: LocalizedString;
    description: LocalizedString;
    iconName: string;
    color: string;
  }>;
  games: Array<{
    id: string;
    title: LocalizedString;
    subtitle: LocalizedString;
    description: LocalizedString;
    statusBadge: LocalizedString;
    imageUrl: string;
    screenshots?: string[];
  }>;
  portfolioItems: Array<{
    id: string;
    category: LocalizedString;
    title: LocalizedString;
    description: LocalizedString;
    imageUrl: string;
  }>;
  testimonials: Array<{
    id: string;
    name: string;
    role: LocalizedString;
    company: string;
    quote: LocalizedString;
    avatarUrl?: string;
  }>;
  stats: Array<{
    id: string;
    label: LocalizedString;
    value: string;
  }>;
  processSteps: Array<{
    id: string;
    title: LocalizedString;
    description: LocalizedString;
  }>;
  contactInfo: {
    email: string;
    phone: string;
    address: LocalizedString;
    whatsapp: string;
    social: {
      linkedin: string;
      twitter: string;
      instagram: string;
      github: string;
    };
  };
  submissions: ContactSubmission[];
}

const DEFAULT_CONTENT: SiteContent = {
  siteInfo: {
    title: "SA7TEC",
    tagline: { en: "Digital Products That Matter", fr: "Des produits numériques qui comptent", ar: "منتجات رقمية تترك أثرًا" },
    heroHeadline: {
      en: "We Build Digital Products That Transform Businesses",
      fr: "Nous créons des produits numériques qui transforment les entreprises",
      ar: "نبني منتجات رقمية تحول الأعمال",
    },
    heroSubheadline: {
      en: "From mobile apps and games to SaaS platforms, AI solutions, and web products—we engineer experiences that matter.",
      fr: "Des applications mobiles et des jeux aux plateformes SaaS, aux solutions IA et aux produits web—nous créons des expériences qui comptent.",
      ar: "من تطبيقات الهاتف والألعاب إلى منصات SaaS وحلول الذكاء الاصطناعي والمنتجات الويب—نحن نصنع تجارب تترك أثرًا.",
    },
    aboutText: {
      en: "We are a full-service digital product studio specializing in building mobile apps, web platforms, games, and custom solutions for innovative companies.",
      fr: "Nous sommes un studio de produits numériques complet spécialisé dans la création d'applications mobiles, de plateformes web, de jeux et de solutions personnalisées pour les entreprises innovantes.",
      ar: "نحن استوديو شامل لمنتجات رقمية متخصص في بناء تطبيقات الهاتف المحمول والمنصات الويب والألعاب والحلول المخصصة للشركات المبتكرة.",
    },
    heroBackgroundUrl: "/assets/hero-bg.png",
  },
  services: [
    {
      id: "1",
      title: { en: "Mobile Games", fr: "Jeux mobiles", ar: "ألعاب الجوال" },
      description: {
        en: "Immersive, engaging puzzles and arcade games designed to captivate players.",
        fr: "Jeux de puzzle et arcade immersifs et engageants conçus pour captiver les joueurs.",
        ar: "ألعاب ألغاز وأركيد غامرة وجذابة مصممة لآسر اللاعبين.",
      },
      iconName: "Gamepad2",
      color: "cyan",
    },
    {
      id: "2",
      title: { en: "Mobile Apps", fr: "Applications mobiles", ar: "تطبيقات الهاتف المحمول" },
      description: {
        en: "Native iOS and Android applications built for performance and user delight.",
        fr: "Applications iOS et Android natives conçues pour la performance et le plaisir des utilisateurs.",
        ar: "تطبيقات iOS و Android أصلية مصممة للأداء والرضا.",
      },
      iconName: "Smartphone",
      color: "violet",
    },
    {
      id: "3",
      title: { en: "Web Development", fr: "Développement web", ar: "تطوير الويب" },
      description: {
        en: "Modern web applications and progressive web apps (PWA) that scale.",
        fr: "Applications web modernes et applications web progressives (PWA) évolutives.",
        ar: "تطبيقات ويب حديثة وتطبيقات ويب تقدمية قابلة للتوسع.",
      },
      iconName: "Globe",
      color: "#34d399",
    },
    {
      id: "4",
      title: { en: "SaaS & Platforms", fr: "SaaS & Plateformes", ar: "SaaS والمنصات" },
      description: {
        en: "Scalable SaaS products and digital platforms built for businesses.",
        fr: "Produits SaaS évolutifs et plateformes numériques conçus pour les entreprises.",
        ar: "منتجات SaaS قابلة للتوسع ومنصات رقمية مبنية للعمل.",
      },
      iconName: "Cloud",
      color: "#fbbf24",
    },
    {
      id: "5",
      title: { en: "E-Commerce", fr: "E-commerce", ar: "التجارة الإلكترونية" },
      description: {
        en: "Beautiful, conversion-focused shopping experiences with seamless checkout.",
        fr: "Belles expériences d'achat axées sur la conversion avec un paiement fluide.",
        ar: "تجارب تسوق جميلة ومركزة على التحويل مع دفع سلس.",
      },
      iconName: "ShoppingCart",
      color: "#f472b6",
    },
    {
      id: "6",
      title: { en: "AI & Automation", fr: "IA & Automatisation", ar: "الذكاء الاصطناعي والأتمتة" },
      description: {
        en: "AI-powered features and intelligent automation for smarter products.",
        fr: "Fonctionnalités alimentées par l'IA et automatisation intelligente pour des produits plus intelligents.",
        ar: "ميزات مدعومة بالذكاء الاصطناعي والأتمتة الذكية للمنتجات الأذكى.",
      },
      iconName: "Zap",
      color: "#ec4899",
    },
    {
      id: "7",
      title: { en: "UI/UX Design", fr: "Design UI/UX", ar: "تصميم UI/UX" },
      description: {
        en: "Thoughtful design systems and interfaces that prioritize user experience.",
        fr: "Systèmes de conception réfléchis et interfaces qui privilégient l'expérience utilisateur.",
        ar: "أنظمة تصميم مدروسة وواجهات تعطي الأولوية لتجربة المستخدم.",
      },
      iconName: "Palette",
      color: "#06b6d4",
    },
    {
      id: "8",
      title: { en: "Startup MVP", fr: "MVP de démarrage", ar: "MVP للشركات الناشئة" },
      description: {
        en: "Rapid MVP development to validate your product idea with real users.",
        fr: "Développement rapide de MVP pour valider l'idée de votre produit auprès d'utilisateurs réels.",
        ar: "تطوير سريع لـ MVP للتحقق من فكرة منتجك مع المستخدمين الحقيقيين.",
      },
      iconName: "Rocket",
      color: "#14b8a6",
    },
  ],
  games: [
    {
      id: "rubiks-race",
      title: { en: "Rubik's Race", fr: "Rubik's Race", ar: "Rubik's Race" },
      subtitle: {
        en: "The Ultimate Puzzle Challenge",
        fr: "Le défi de puzzle ultime",
        ar: "تحدي الألغاز الأقصى",
      },
      description: {
        en: "A colorful timed puzzle game with 5,000 levels. Can you beat the clock?",
        fr: "Un puzzle coloré chronométré de 5 000 niveaux. Battras-tu le chrono ?",
        ar: "لعبة ألغاز ملونة محدودة بالوقت تضم 5000 مستوى. هل تستطيع التغلب على الساعة؟",
      },
      statusBadge: { en: "Available Now", fr: "Disponible", ar: "متاحة الآن" },
      imageUrl: "/assets/rubiks-challenge.jpg",
      screenshots: [
        "/assets/rubiks-game.jpg",
        "/assets/rubiks-loading.jpg",
        "/assets/rubiks-challenge.jpg",
      ],
    },
  ],
  portfolioItems: [
    {
      id: "p1",
      category: { en: "Mobile Game", fr: "Jeu mobile", ar: "لعبة محمول" },
      title: { en: "Rubik's Race", fr: "Rubik's Race", ar: "Rubik's Race" },
      description: { en: "5,000-level puzzle game with 1M+ downloads on app stores.", fr: "Jeu de puzzle avec plus de 5 000 niveaux et 1M+ téléchargements.", ar: "لعبة ألغاز مع أكثر من 5000 مستوى و1M+ تنزيل." },
      imageUrl: "/assets/rubiks-challenge.jpg",
    },
    {
      id: "p2",
      category: { en: "E-Commerce", fr: "E-commerce", ar: "تجارة إلكترونية" },
      title: { en: "ShopSync", fr: "ShopSync", ar: "ShopSync" },
      description: { en: "Next-gen retail app with AI-powered recommendations and seamless checkout.", fr: "Application de détail nouvelle génération avec recommandations alimentées par l'IA.", ar: "تطبيق تجزئة من الجيل الجديد مع توصيات قائمة على الذكاء الاصطناعي." },
      imageUrl: "/assets/portfolio-ecommerce.png",
    },
    {
      id: "p3",
      category: { en: "Education", fr: "Éducation", ar: "تعليم" },
      title: { en: "LearnLogic", fr: "LearnLogic", ar: "LearnLogic" },
      description: { en: "Gamified learning platform with 50K+ active students and adaptive lessons.", fr: "Plateforme d'apprentissage ludifiée avec 50K+ étudiants actifs.", ar: "منصة تعلم بأسلوب الألعاب مع أكثر من 50K مستخدم نشط." },
      imageUrl: "/assets/portfolio-education.png",
    },
    {
      id: "p4",
      category: { en: "Health & Wellness", fr: "Santé", ar: "صحة" },
      title: { en: "FitFlow", fr: "FitFlow", ar: "FitFlow" },
      description: { en: "AI-powered fitness app with personalized workout plans and real-time tracking.", fr: "Application de fitness alimentée par l'IA avec plans d'entraînement personnalisés.", ar: "تطبيق لياقة بقوة الذكاء الاصطناعي مع خطط تدريب شخصية." },
      imageUrl: "/assets/portfolio-health.png",
    },
    {
      id: "p5",
      category: { en: "SaaS", fr: "SaaS", ar: "SaaS" },
      title: { en: "WorkHub Pro", fr: "WorkHub Pro", ar: "WorkHub Pro" },
      description: { en: "Team collaboration SaaS platform used by 5,000+ companies worldwide.", fr: "Plateforme SaaS de collaboration d'équipe utilisée par 5 000+ entreprises.", ar: "منصة SaaS للتعاون بين الفريق يستخدمها 5000+ شركة." },
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80",
    },
    {
      id: "p6",
      category: { en: "Web App", fr: "Application web", ar: "تطبيق ويب" },
      title: { en: "DataViz Dashboard", fr: "Tableau de bord DataViz", ar: "لوحة معلومات DataViz" },
      description: { en: "Real-time analytics dashboard processing 10M+ data points daily.", fr: "Tableau de bord analytique en temps réel traitant 10M+ points de données quotidiens.", ar: "لوحة معلومات تحليلية في الوقت الفعلي تعالج 10M+ نقطة بيانات يوميًا." },
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
    },
  ],
  testimonials: [
    {
      id: "t1",
      name: "Alex Chen",
      role: { en: "CEO & Founder", fr: "PDG et Fondateur", ar: "الرئيس التنفيذي والمؤسس" },
      company: "TechStart",
      quote: {
        en: "SA7TEC delivered our app ahead of schedule with incredible attention to detail. Their team understood our vision immediately.",
        fr: "SA7TEC a livré notre application en avance avec un souci du détail incroyable. Leur équipe a immédiatement compris notre vision.",
        ar: "سلّمت SA7TEC تطبيقنا قبل الموعد مع اهتمام مذهل بالتفاصيل. فهمت الفريق رؤيتنا فورًا.",
      },
    },
    {
      id: "t2",
      name: "Maria Rodriguez",
      role: { en: "Product Manager", fr: "Directrice Produit", ar: "مدير المنتج" },
      company: "EduTech Solutions",
      quote: {
        en: "Working with SA7TEC was a game-changer. They transformed our educational platform into something truly exceptional.",
        fr: "Travailler avec SA7TEC a été un tournant. Ils ont transformé notre plateforme éducative en quelque chose de vraiment exceptionnel.",
        ar: "العمل مع SA7TEC كان نقطة تحول. لقد حولوا منصتنا التعليمية إلى شيء استثنائي حقًا.",
      },
    },
    {
      id: "t3",
      name: "James Mitchell",
      role: { en: "Founder", fr: "Fondateur", ar: "المؤسس" },
      company: "FitWell Startup",
      quote: {
        en: "The SA7TEC team doesn't just build apps—they build products. Their strategic thinking elevated our entire project.",
        fr: "L'équipe SA7TEC ne se contente pas de construire des applications—elle construit des produits. Leur réflexion stratégique a amélioré tout notre projet.",
        ar: "فريق SA7TEC لا ينشئ التطبيقات فحسب—فهم ينشئون منتجات. كان تفكيرهم الاستراتيجي قد حسّن مشروعنا بالكامل.",
      },
    },
  ],
  stats: [
    { id: "s1", label: { en: "Projects Delivered", fr: "Projets livrés", ar: "مشاريع منجزة" }, value: "50+" },
    { id: "s2", label: { en: "Active Users", fr: "Utilisateurs actifs", ar: "مستخدمون نشطون" }, value: "1M+" },
    { id: "s3", label: { en: "App Store Rating", fr: "Note App Store", ar: "تقييم المتجر" }, value: "4.9" },
  ],
  processSteps: [
    {
      id: "ps1",
      title: { en: "Idea", fr: "Idée", ar: "الفكرة" },
      description: {
        en: "We brainstorm and define the core concept.",
        fr: "Nous imaginons et définissons le concept central.",
        ar: "نعصف الأفكار ونحدد الفكرة الأساسية.",
      },
    },
    {
      id: "ps2",
      title: { en: "Design", fr: "Design", ar: "التصميم" },
      description: {
        en: "Crafting beautiful and intuitive interfaces.",
        fr: "Conception d'interfaces belles et intuitives.",
        ar: "تصميم واجهات أنيقة وسهلة الاستخدام.",
      },
    },
    {
      id: "ps3",
      title: { en: "Build", fr: "Développement", ar: "التطوير" },
      description: {
        en: "Robust development with cutting-edge tech.",
        fr: "Développement robuste avec une tech de pointe.",
        ar: "تطوير متين بأحدث التقنيات.",
      },
    },
    {
      id: "ps4",
      title: { en: "Launch", fr: "Lancement", ar: "الإطلاق" },
      description: {
        en: "Deploying to the world and scaling up.",
        fr: "Déploiement mondial et passage à l'échelle.",
        ar: "النشر للعالم والتوسّع.",
      },
    },
  ],
  contactInfo: {
    email: "asrihsoufiane@gmail.com",
    phone: "+212-677604950",
    address: { en: "Tetouan, Morocco", fr: "Tétouan, Maroc", ar: "تطوان، المغرب" },
    whatsapp: "+212677604950",
    social: { linkedin: "https://www.linkedin.com/company/sa7tech/", twitter: "https://x.com", instagram: "https://www.instagram.com/sa7_tec?igsh=cWtxc3h6dzJjNTB4", github: "https://github.com" },
  },
  submissions: [],
};

type ContentContextType = {
  content: SiteContent;
  updateContent: (newContent: Partial<SiteContent>) => void;
  addSubmission: (sub: Omit<ContactSubmission, "id" | "date">) => void;
  deleteSubmission: (id: string) => void;
};

const ContentContext = createContext<ContentContextType | null>(null);

const STORAGE_KEY = "sa7tec_content_v1";

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<SiteContent>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_CONTENT,
          ...parsed,
          siteInfo: { ...DEFAULT_CONTENT.siteInfo, ...(parsed.siteInfo || {}) },
          contactInfo: {
            ...DEFAULT_CONTENT.contactInfo,
            ...(parsed.contactInfo || {}),
            social: { ...DEFAULT_CONTENT.contactInfo.social, ...((parsed.contactInfo && parsed.contactInfo.social) || {}) },
          },
        };
      }
    } catch (e) {
      console.error("Failed to load content", e);
    }
    return DEFAULT_CONTENT;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  const updateContent = (newContent: Partial<SiteContent>) => {
    setContentState((prev) => ({ ...prev, ...newContent }));
  };

  const addSubmission = (sub: Omit<ContactSubmission, "id" | "date">) => {
    const submission: ContactSubmission = {
      name: normalizeInput(sub.name, 100),
      email: normalizeInput(sub.email, 254).toLowerCase(),
      projectType: normalizeInput(sub.projectType, 80),
      budgetRange: normalizeInput(sub.budgetRange, 40),
      message: normalizeInput(sub.message, 5000),
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    setContentState((prev) => ({
      ...prev,
      submissions: [submission, ...prev.submissions],
    }));
  };

  const deleteSubmission = (id: string) => {
    setContentState((prev) => ({
      ...prev,
      submissions: prev.submissions.filter((s) => s.id !== id),
    }));
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, addSubmission, deleteSubmission }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}
