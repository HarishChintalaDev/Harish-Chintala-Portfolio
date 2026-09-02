export interface NavLink {
  name: string;
  href: string;
  id: string;
}

export interface SocialLink {
  platform: "gmail" | "linkedin" | "github";
  label: string;
  url: string;
  tooltip: string;
}

export interface CommandAction {
  id: string;
  iconName: "User" | "Briefcase" | "Code" | "Trophy" | "FileText" | "Mail" | "Phone";
  title: string;
  subtitle: string;
  actionType: "scroll" | "modal" | "email" | "phone" | "download";
  target?: string;
}

export interface SiteConfig {
  siteTitle: string;
  siteDescription: string;
  keywords: string[];
  author: string;
  ogTitle: string;
  ogDescription: string;
  twitterCard: string;
  locale: string;
}
