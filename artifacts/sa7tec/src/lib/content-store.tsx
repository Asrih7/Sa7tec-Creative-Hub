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
  portfolioItems: Array<{
    id: string;
    category: LocalizedString;
    title: LocalizedString;
    description: LocalizedString;
    imageUrl: string;
    linkUrl?: string;
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
    title: "SA7TEC / PRODUCT STUDIO",
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
  portfolioItems: [
    {
      id: "p1",
      category: { en: "Learning Platform", fr: "Plateforme d'apprentissage", ar: "منصة التعلم" },
      title: { en: "We Built a Free Platform to Learn Angular and Ace Your Next Interview", fr: "Nous avons construit une plateforme gratuite pour apprendre Angular et réussir votre prochain entretien", ar: "لقد بنينا منصة مجانية لتعلم Angular والنجاح في مقابلتك القادمة" },
      description: { en: "Stop googling scattered tutorials. Everything you need to master Angular is in one place.", fr: "Arrêtez de chercher sur Google des tutoriels dispersés. Tout ce dont vous avez besoin pour maîtriser Angular est en un seul endroit.", ar: "توقف عن البحث عن دروس متفرقة. كل ما تحتاجه لإتقان Angular في مكان واحد." },
      imageUrl: "/assets/medium-projects/angular-courses-portal.png",
      linkUrl: "https://medium.com/@asrihsoufiane/i-built-a-free-platform-to-learn-angular-and-ace-your-next-interview-heres-why-you-need-it-2bd64117b2e9",
    },
    {
      id: "p2",
      category: { en: "Web Development", fr: "Développement web", ar: "تطوير الويب" },
      title: { en: "DeviceFrame Pro: Revolutionizing Web Development Testing in 2026", fr: "DeviceFrame Pro: Révolutionner les tests de développement web en 2026", ar: "DeviceFrame Pro: تحويل اختبار تطوير الويب في 2026" },
      description: { en: "The professional's choice for cross-device development and responsive testing workflows.", fr: "Le choix du professionnel pour le développement multi-appareils et les flux de test réactifs.", ar: "اختيار المحترف لتطوير متعدد الأجهزة وسير عمل الاختبار المتجاوب." },
      imageUrl: "/assets/medium-projects/deviceframe-pro.png",
      linkUrl: "https://medium.com/@asrihsoufiane/deviceframe-pro-revolutionizing-web-development-testing-in-2026-3cfefc97c204",
    },
    {
      id: "p4",
      category: { en: "Developer Resources", fr: "Ressources pour développeurs", ar: "موارد المطورين" },
      title: { en: "Frontend Cheat Sheets: Your Ultimate Developer Reference Hub", fr: "Aide-mémoire Frontend: Votre centre de référence ultime pour développeurs", ar: "Frontend Cheat Sheets: Your Ultimate Developer Reference Hub" },
      description: { en: "A comprehensive application consolidating essential frontend references in one searchable interface.", fr: "Une application complète consolidant les références frontend essentielles dans une interface recherchable.", ar: "تطبيق شامل يوحد المراجع الأمامية الأساسية في واجهة قابلة للبحث." },
      imageUrl: "/assets/medium-projects/frontend-cheat-sheets.png",
      linkUrl: "https://medium.com/@asrihsoufiane/frontend-cheat-sheets-your-ultimate-developer-reference-hub-260e4ee43129",
    },
    {
      id: "p5",
      category: { en: "Learning Tools", fr: "Outils d'apprentissage", ar: "أدوات التعلم" },
      title: { en: "Introducing AngularQuizMe — A Smarter Way to Master Angular Through Quizzes", fr: "Présentation d'AngularQuizMe — Un moyen plus intelligent de maîtriser Angular par des quiz", ar: "تقديم AngularQuizMe — طريقة أذكى لإتقان Angular من خلال الاختبارات" },
      description: { en: "Learn Angular by doing with a comprehensive quiz platform designed for developers.", fr: "Apprenez Angular en pratiquant avec une plateforme de quiz complète conçue pour les développeurs.", ar: "تعلم Angular من خلال الممارسة مع منصة اختبار شاملة مصممة للمطورين." },
      imageUrl: "/assets/medium-projects/angularquizme.png",
      linkUrl: "https://medium.com/@asrihsoufiane/introducing-angularquizme-a-smarter-way-to-master-angular-through-quizzes-3a5f12ba5fd4",
    },
    {
      id: "p7",
      category: { en: "UI Components", fr: "Composants UI", ar: "مكونات واجهة المستخدم" },
      title: { en: "Enhance Your Angular Projects with ng-payment-card-form Component", fr: "Améliorez vos projets Angular avec le composant ng-payment-card-form", ar: "عزز مشاريع Angular الخاصة بك بمكون ng-payment-card-form" },
      description: { en: "A reusable Angular component with automatic formatting, validation, and dynamic backgrounds.", fr: "Un composant Angular réutilisable avec formatage automatique, validation et arrière-plans dynamiques.", ar: "مكون Angular قابل لإعادة الاستخدام مع التنسيق التلقائي والتحقق والخلفيات الديناميكية." },
      imageUrl: "/assets/medium-projects/payment-card-form.png",
      linkUrl: "https://medium.com/@asrihsoufiane/enhance-your-angular-projects-with-the-ng-payment-card-form-component-6ace092ad75a",
    },
    {
      id: "p8",
      category: { en: "Chatbot Integration", fr: "Intégration Chatbot", ar: "تكامل Chatbot" },
      title: { en: "Simplify Angular Development with NgChatbotAngular: Your Chatbot Solution", fr: "Simplifiez le développement Angular avec NgChatbotAngular: Votre solution chatbot", ar: "بسّط تطوير Angular باستخدام NgChatbotAngular: حل الدردشة الخاص بك" },
      description: { en: "An Angular component for creating chat interfaces with fully customizable UI and easy integration.", fr: "Un composant Angular pour créer des interfaces de chat avec une interface utilisateur entièrement personnalisable.", ar: "مكون Angular لإنشاء واجهات الدردشة مع واجهة مستخدم قابلة للتخصيص بالكامل." },
      imageUrl: "/assets/medium-projects/ng-chatbot-angular.gif",
      linkUrl: "https://medium.com/@asrihsoufiane/simplify-angular-development-with-ngchatbotangular-your-chatbot-solution-cbdf87899b01",
    },
    {
      id: "p9",
      category: { en: "Development Tools", fr: "Outils de développement", ar: "أدوات التطوير" },
      title: { en: "Enhance Development Efficiency: Streamline Workflows with ng-capture-screenshots", fr: "Améliorez l'efficacité du développement: Rationalisez les flux de travail avec ng-capture-screenshots", ar: "عزز كفاءة التطوير: بسّط سير العمل باستخدام ng-capture-screenshots" },
      description: { en: "Automate screenshot capture for different devices and screen sizes in your Angular applications.", fr: "Automatisez la capture d'écran pour différents appareils et tailles d'écran dans vos applications Angular.", ar: "أتمتة التقاط لقطات الشاشة لأجهزة وأحجام شاشات مختلفة في تطبيقات Angular الخاصة بك." },
      imageUrl: "/assets/sa7tec-logo.jpg",
      linkUrl: "https://medium.com/@asrihsoufiane/enhance-development-efficiency-streamline-web-workflows-with-ng-capture-screenshots-9d3fc21c32ae",
    },
    {
      id: "p10",
      category: { en: "TypeScript Tools", fr: "Outils TypeScript", ar: "أدوات TypeScript" },
      title: { en: "Streamlining TypeScript Refactoring: Guide to ts-file-refactor", fr: "Rationaliser la refactorisation TypeScript: Guide de ts-file-refactor", ar: "تبسيط إعادة هيكلة TypeScript: دليل ts-file-refactor" },
      description: { en: "Automate symbol renaming, file moves, and clean up import paths at scale across codebases.", fr: "Automatisez la modification de noms de symboles, le déplacement de fichiers et le nettoyage des imports à grande échelle.", ar: "أتمتة إعادة تسمية الرموز ونقل الملفات وتنظيف مسارات الاستيراد على نطاق واسع." },
      imageUrl: "/assets/sa7tec-logo.jpg",
      linkUrl: "https://medium.com/@asrihsoufiane/streamlining-typescript-refactoring-a-comprehensive-guide-to-ts-file-refactor-npm-package-017f53db521b",
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

const HIDDEN_PORTFOLIO_TITLES = [
  "Angular 21: The Game-Changing Release That's Reshaping Modern Web Development",
  "Angular 21: The Game-Changing Release That’s Reshaping Modern Web Development",
  "Unlocking the Power of Angular: A Step-by-Step Guide",
];

const MEDIUM_IMAGE_BY_SLUG = {
  "i-built-a-free-platform-to-learn-angular-and-ace-your-next-interview-heres-why-you-need-it": "/assets/medium-projects/angular-courses-portal.png",
  "deviceframe-pro-revolutionizing-web-development-testing-in-2026": "/assets/medium-projects/deviceframe-pro.png",
  "frontend-cheat-sheets-your-ultimate-developer-reference-hub": "/assets/medium-projects/frontend-cheat-sheets.png",
  "introducing-angularquizme-a-smarter-way-to-master-angular-through-quizzes": "/assets/medium-projects/angularquizme.png",
  "enhance-your-angular-projects-with-the-ng-payment-card-form-component": "/assets/medium-projects/payment-card-form.png",
  "simplify-angular-development-with-ngchatbotangular-your-chatbot-solution": "/assets/medium-projects/ng-chatbot-angular.gif",
  "enhance-development-efficiency-streamline-web-workflows-with-ng-capture-screenshots": "/assets/medium-projects/ng-capture-screenshots.png",
  "streamlining-typescript-refactoring-a-comprehensive-guide-to-ts-file-refactor-npm-package": "/assets/medium-projects/ts-file-refactor.png",
} as const;

function localizedSource(value: LocalizedString) {
  return typeof value === "string" ? value : value.en;
}

function normalizedTitle(value: string) {
  return value.trim().replace(/[’‘]/g, "'").toLowerCase();
}

function isHiddenPortfolioItem(item: SiteContent["portfolioItems"][number]) {
  const title = normalizedTitle(localizedSource(item.title));
  return HIDDEN_PORTFOLIO_TITLES.some((hiddenTitle) => normalizedTitle(hiddenTitle) === title);
}

function mediumImageForLink(linkUrl?: string) {
  if (!linkUrl) return "";
  const cleanUrl = linkUrl.split("?")[0];
  const match = Object.entries(MEDIUM_IMAGE_BY_SLUG).find(([slug]) => cleanUrl.includes(slug));
  return match?.[1] || "";
}
function normalizePortfolioImages(items: SiteContent["portfolioItems"]) {
  return items.map((item) => {
    const mediumImage = mediumImageForLink(item.linkUrl);
    const preserveCustomLogo = item.imageUrl?.endsWith("/sa7tec-logo.jpg");
    return mediumImage && !preserveCustomLogo ? { ...item, imageUrl: mediumImage } : item;
  });
}

function visiblePortfolioItems(items: SiteContent["portfolioItems"]) {
  return normalizePortfolioImages(items.filter((item) => !isHiddenPortfolioItem(item)));
}

function restorePortfolioItems(parsed: Partial<SiteContent>) {
  const defaults = visiblePortfolioItems(DEFAULT_CONTENT.portfolioItems);
  if (!Array.isArray(parsed.portfolioItems)) return defaults;
  const storedItems = visiblePortfolioItems(parsed.portfolioItems);
  const hasPublishedLinks = storedItems.some((item) => typeof item.linkUrl === "string" && item.linkUrl.length > 0);
  const hasLegacyGameItem = storedItems.some((item) => item.imageUrl?.includes("rubiks"));
  return hasPublishedLinks && !hasLegacyGameItem ? storedItems : defaults;
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<SiteContent>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const normalizedParsed = {
          ...parsed,
          siteInfo: {
            ...parsed.siteInfo,
            title: parsed.siteInfo?.title === "SA7TEC" ? DEFAULT_CONTENT.siteInfo.title : parsed.siteInfo?.title,
          },
        };
        return {
          ...DEFAULT_CONTENT,
          ...normalizedParsed,
          siteInfo: { ...DEFAULT_CONTENT.siteInfo, ...(normalizedParsed.siteInfo || {}) },
          portfolioItems: restorePortfolioItems(normalizedParsed),
          contactInfo: {
            ...DEFAULT_CONTENT.contactInfo,
            ...(normalizedParsed.contactInfo || {}),
            social: { ...DEFAULT_CONTENT.contactInfo.social, ...((normalizedParsed.contactInfo && normalizedParsed.contactInfo.social) || {}) },
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

