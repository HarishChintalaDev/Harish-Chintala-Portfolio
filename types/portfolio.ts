export interface ProjectMetric {
  label: string;
  value: string;
  displayValue?: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  company: string;
  period: string;
  metrics: ProjectMetric[];
  problem: string;
  solution: string;
  architecture: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  featured?: boolean;
  category: "Automation" | "AI & ML" | "Performance" | "DevOps" | "Others";
}

export interface ExperienceMetric {
  label: string;
  value: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  current?: boolean;
  careerProgression?: string;
  summary?: string;
  achievements: string[];
  techStack: string[];
  logoText?: string;
  metrics?: ExperienceMetric[];
}

export interface SkillItem {
  name: string;
  level?: number;
  proficiency?: number;
  highlighted?: boolean;
}

export interface SkillCategoryGroup {
  category: string;
  iconName?: string;
  skills: SkillItem[];
}

export interface Award {
  id: string;
  title: string;
  organization: string;
  year: string;
  description: string;
  badge?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  credentialId?: string;
  credentialUrl?: string;
  fileUrl?: string;
  fileType?: "pdf" | "image";
  date?: string;
  issueDate?: string;
  skills: string[];
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  period: string;
  project: string;
  achievement: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
}

export interface AboutHighlight {
  title: string;
  description: string;
  iconName: "Zap" | "Bot" | "Smartphone" | "ShieldCheck";
}

export interface PersonalInfo {
  name: string;
  title: string;
  badge: string;
  location: string;
  email: string;
  altEmail?: string;
  phone: string;
  github: string;
  linkedin: string;
  coreFocus: string;
  availability: string;
  summary: string;
  heroMetrics?: { label: string; value: string }[];
  heroRoles: string[];
  story: string[];
  techBadges: string[];
}
