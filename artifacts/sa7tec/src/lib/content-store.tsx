import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { z } from "zod";
import type { LocalizedString } from "@/lib/i18n";

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
    tagline: { en: "From Idea to Reality.", fr: "De l'idée à la réalité.", ar: "من الفكرة إلى الواقع." },
    heroHeadline: {
      en: "We Build Mobile Experiences That Matter",
      fr: "Nous créons des expériences mobiles qui comptent",
      ar: "نصنع تجارب جوال تترك أثرًا",
    },
    heroSubheadline: {
      en: "Games, e-commerce, and custom apps crafted with precision and creativity.",
      fr: "Jeux, e-commerce et applications sur mesure conçus avec précision et créativité.",
      ar: "ألعاب وتطبيقات تجارة إلكترونية وتطبيقات مخصصة مصممة بدقة وإبداع.",
    },
    aboutText: {
      en: "We are a young mobile app studio focused on creating unforgettable digital experiences.",
      fr: "Nous sommes un jeune studio mobile dédié à la création d'expériences numériques inoubliables.",
      ar: "نحن استوديو شاب لتطوير تطبيقات الجوال نركّز على ابتكار تجارب رقمية لا تُنسى.",
    },
  },
  services: [
    {
      id: "1",
      title: { en: "Mobile Games", fr: "Jeux mobiles", ar: "ألعاب الجوال" },
      description: {
        en: "Immersive puzzles and brain teasers that captivate users.",
        fr: "Puzzles immersifs et casse-têtes qui captivent les joueurs.",
        ar: "ألغاز غامرة وتحديات ذهنية تأسر المستخدمين.",
      },
      iconName: "Gamepad2",
      color: "cyan",
    },
    {
      id: "2",
      title: { en: "E-Commerce Apps", fr: "Applis e-commerce", ar: "تطبيقات التجارة الإلكترونية" },
      description: {
        en: "Seamless shopping experiences designed to convert.",
        fr: "Des expériences d'achat fluides conçues pour convertir.",
        ar: "تجارب تسوق سلسة مصمَّمة لتحقيق التحويلات.",
      },
      iconName: "ShoppingCart",
      color: "violet",
    },
    {
      id: "3",
      title: { en: "Education Platforms", fr: "Plateformes éducatives", ar: "منصات تعليمية" },
      description: {
        en: "Interactive learning tools that make knowledge accessible.",
        fr: "Outils d'apprentissage interactifs qui rendent le savoir accessible.",
        ar: "أدوات تعلّم تفاعلية تجعل المعرفة في متناول الجميع.",
      },
      iconName: "GraduationCap",
      color: "lime",
    },
    {
      id: "4",
      title: { en: "Health & Fitness", fr: "Santé et bien-être", ar: "الصحة واللياقة" },
      description: {
        en: "Trackers and planners that motivate healthier lifestyles.",
        fr: "Trackers et planificateurs qui encouragent un mode de vie sain.",
        ar: "تطبيقات متابعة وتخطيط تحفّز على نمط حياة صحي.",
      },
      iconName: "HeartPulse",
      color: "orange",
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
    },
  ],
  portfolioItems: [
    {
      id: "p1",
      category: { en: "E-Commerce", fr: "E-commerce", ar: "تجارة إلكترونية" },
      title: { en: "ShopSync", fr: "ShopSync", ar: "ShopSync" },
      description: { en: "Next-gen retail app.", fr: "Une appli retail nouvelle génération.", ar: "تطبيق تجزئة من الجيل الجديد." },
      imageUrl: "/assets/portfolio-ecommerce.png",
    },
    {
      id: "p2",
      category: { en: "Education", fr: "Éducation", ar: "تعليم" },
      title: { en: "LearnLogic", fr: "LearnLogic", ar: "LearnLogic" },
      description: { en: "Gamified learning.", fr: "Apprentissage ludifié.", ar: "تعلّم بأسلوب الألعاب." },
      imageUrl: "/assets/portfolio-education.png",
    },
    {
      id: "p3",
      category: { en: "Health", fr: "Santé", ar: "صحة" },
      title: { en: "FitFlow", fr: "FitFlow", ar: "FitFlow" },
      description: { en: "Daily activity tracker.", fr: "Tracker d'activité quotidien.", ar: "متعقّب نشاط يومي." },
      imageUrl: "/assets/portfolio-health.png",
    },
  ],
  testimonials: [
    {
      id: "t1",
      name: "Alex Chen",
      role: { en: "CEO", fr: "PDG", ar: "الرئيس التنفيذي" },
      company: "TechStart",
      quote: {
        en: "SA7TEC delivered our app ahead of schedule with incredible attention to detail.",
        fr: "SA7TEC a livré notre application en avance avec un souci du détail incroyable.",
        ar: "سلّمت SA7TEC تطبيقنا قبل الموعد مع اهتمام مذهل بالتفاصيل.",
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
    email: "hello@sa7tec.com",
    phone: "+1 (555) 123-4567",
    address: { en: "San Francisco, CA", fr: "San Francisco, CA", ar: "سان فرانسيسكو، كاليفورنيا" },
    whatsapp: "+15551234567",
    social: { linkedin: "https://linkedin.com", twitter: "https://twitter.com", instagram: "https://instagram.com", github: "https://github.com" },
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
      ...sub,
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
