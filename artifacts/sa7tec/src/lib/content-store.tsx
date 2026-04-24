import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { z } from "zod";

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
    tagline: string;
    heroHeadline: string;
    heroSubheadline: string;
    aboutText: string;
  };
  services: Array<{
    id: string;
    title: string;
    description: string;
    iconName: string;
    color: string;
  }>;
  games: Array<{
    id: string;
    title: string;
    subtitle: string;
    description: string;
    statusBadge: string;
    imageUrl: string;
  }>;
  portfolioItems: Array<{
    id: string;
    category: string;
    title: string;
    description: string;
    imageUrl: string;
  }>;
  testimonials: Array<{
    id: string;
    name: string;
    role: string;
    company: string;
    quote: string;
    avatarUrl?: string;
  }>;
  stats: Array<{
    id: string;
    label: string;
    value: string;
  }>;
  processSteps: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
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
    tagline: "From Idea to Reality.",
    heroHeadline: "We Build Mobile Experiences That Matter",
    heroSubheadline: "Games, e-commerce, and custom apps crafted with precision and creativity.",
    aboutText: "We are a young mobile app studio focused on creating unforgettable digital experiences.",
  },
  services: [
    { id: "1", title: "Mobile Games", description: "Immersive puzzles and brain teasers that captivate users.", iconName: "Gamepad2", color: "cyan" },
    { id: "2", title: "E-Commerce Apps", description: "Seamless shopping experiences designed to convert.", iconName: "ShoppingCart", color: "violet" },
    { id: "3", title: "Education Platforms", description: "Interactive learning tools that make knowledge accessible.", iconName: "GraduationCap", color: "lime" },
    { id: "4", title: "Health & Fitness", description: "Trackers and planners that motivate healthier lifestyles.", iconName: "HeartPulse", color: "orange" },
  ],
  games: [
    {
      id: "rubiks-race",
      title: "Rubik's Race",
      subtitle: "The Ultimate Puzzle Challenge",
      description: "A colorful timed puzzle game with 5,000 levels. Can you beat the clock?",
      statusBadge: "Available Now",
      imageUrl: "/assets/rubiks-challenge.jpg",
    }
  ],
  portfolioItems: [
    { id: "p1", category: "E-Commerce", title: "ShopSync", description: "Next-gen retail app.", imageUrl: "/assets/portfolio-ecommerce.png" },
    { id: "p2", category: "Education", title: "LearnLogic", description: "Gamified learning.", imageUrl: "/assets/portfolio-education.png" },
    { id: "p3", category: "Health", title: "FitFlow", description: "Daily activity tracker.", imageUrl: "/assets/portfolio-health.png" },
  ],
  testimonials: [
    { id: "t1", name: "Alex Chen", role: "CEO", company: "TechStart", quote: "SA7TEC delivered our app ahead of schedule with incredible attention to detail." }
  ],
  stats: [
    { id: "s1", label: "Projects Delivered", value: "50+" },
    { id: "s2", label: "Active Users", value: "1M+" },
    { id: "s3", label: "App Store Rating", value: "4.9" }
  ],
  processSteps: [
    { id: "ps1", title: "Idea", description: "We brainstorm and define the core concept." },
    { id: "ps2", title: "Design", description: "Crafting beautiful and intuitive interfaces." },
    { id: "ps3", title: "Build", description: "Robust development with cutting-edge tech." },
    { id: "ps4", title: "Launch", description: "Deploying to the world and scaling up." }
  ],
  contactInfo: {
    email: "hello@sa7tec.com",
    phone: "+1 (555) 123-4567",
    address: "San Francisco, CA",
    whatsapp: "+15551234567",
    social: { linkedin: "https://linkedin.com", twitter: "https://twitter.com", instagram: "https://instagram.com", github: "https://github.com" }
  },
  submissions: []
};

type ContentContextType = {
  content: SiteContent;
  updateContent: (newContent: Partial<SiteContent>) => void;
  addSubmission: (sub: Omit<ContactSubmission, "id" | "date">) => void;
  deleteSubmission: (id: string) => void;
};

const ContentContext = createContext<ContentContextType | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<SiteContent>(() => {
    try {
      const stored = localStorage.getItem("sa7tec_content_v1");
      if (stored) return { ...DEFAULT_CONTENT, ...JSON.parse(stored) };
    } catch (e) {
      console.error("Failed to load content", e);
    }
    return DEFAULT_CONTENT;
  });

  useEffect(() => {
    localStorage.setItem("sa7tec_content_v1", JSON.stringify(content));
  }, [content]);

  const updateContent = (newContent: Partial<SiteContent>) => {
    setContentState(prev => ({ ...prev, ...newContent }));
  };

  const addSubmission = (sub: Omit<ContactSubmission, "id" | "date">) => {
    const submission: ContactSubmission = {
      ...sub,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    setContentState(prev => ({
      ...prev,
      submissions: [submission, ...prev.submissions],
    }));
  };

  const deleteSubmission = (id: string) => {
    setContentState(prev => ({
      ...prev,
      submissions: prev.submissions.filter(s => s.id !== id),
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
