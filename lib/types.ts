export interface ProjectMetric {
  label: string;
  value: string;
}

export interface CaseStudyData {
  id?: string;
  problem?: string;
  research?: Array<{ method: string; count?: string; insight: string }>;
  wireframes?: string[];
  hiFidelity?: string[];
  photos?: string[];
  prototype?: string | null;
  testing?: { participants?: number; taskSuccess?: string; usabilityScore?: string };
  lessons?: string;
  figmaEmbed?: string | null;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  overview: string;
  role: string;
  duration: string;
  year: string;
  company: string;
  coverImage: string;
  accentColor: string;
  featured: boolean;
  published?: boolean;
  order?: number;
  category: string[];
  tags: string[];
  tools: string[];
  metrics: ProjectMetric[];
  gallery?: string[];
  prototypeUrl?: string | null;
  liveUrl?: string | null;
  caseStudy?: CaseStudyData | null;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  logo?: string | null;
  color: string;
  order?: number;
  current?: boolean;
}

export interface SkillItem {
  id: string;
  name: string;
  level: number;
  icon: string;
  category: string;
  order?: number;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  period: string;
  location: string;
  highlight?: string | null;
  order?: number;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar?: string | null;
  quote: string;
  featured?: boolean;
}

export interface SocialItem {
  id: string;
  platform: string;
  url: string;
  icon: string;
  order?: number;
  active?: boolean;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: string;
  order?: number;
  published?: boolean;
}

export interface SiteSettings {
  heroName: string;
  heroTitle: string;
  heroRoles: string;
  heroBio: string;
  yearsExperience: string;
  productsShipped: string;
  usersImpacted: string;
  email: string;
  resumeUrl?: string;
  heroImage?: string;
}

