import {
  PersonalInfo,
  Experience,
  Project,
  SkillCategoryGroup,
  Award,
  Certification,
  Education,
  NavLink,
  CommandAction,
} from "@/types";

import personal from "@/content/personal.json";
import experiences from "@/content/experiences.json";
import projects from "@/content/projects.json";
import skills from "@/content/skills.json";
import awards from "@/content/awards.json";
import certifications from "@/content/certifications.json";
import education from "@/content/education.json";
import siteConfig from "@/content/siteConfig.json";

export const masterData = {
  personal,
  experiences,
  projects,
  skills,
  awards,
  certifications,
  education,
  siteConfig,
};

export const PERSONAL_INFO: PersonalInfo = masterData.personal as PersonalInfo;
export const EXPERIENCES: Experience[] = masterData.experiences as Experience[];
export const PROJECTS: Project[] = masterData.projects as Project[];
export const SKILL_CATEGORIES: SkillCategoryGroup[] = masterData.skills as SkillCategoryGroup[];
export const AWARDS: Award[] = masterData.awards as Award[];
export const CERTIFICATIONS: Certification[] = masterData.certifications as Certification[];
export const EDUCATION: Education = masterData.education as Education;

export const PROJECT_CATEGORIES = [
  "All",
  "Automation",
  "AI & ML",
  "Performance",
  "DevOps",
  "Others",
] as const;

export const SITE_TITLE = masterData.siteConfig.siteTitle;
export const SITE_DESCRIPTION = masterData.siteConfig.siteDescription;
export const CANONICAL_URL = masterData.siteConfig.canonicalUrl;
export const NAV_LINKS: NavLink[] = masterData.siteConfig.navLinks as NavLink[];
export const COMMAND_ACTIONS: CommandAction[] = masterData.siteConfig.commandActions as CommandAction[];

export const SITE_CONFIG = {
  siteTitle: masterData.siteConfig.siteTitle,
  siteDescription: masterData.siteConfig.siteDescription,
  canonicalUrl: masterData.siteConfig.canonicalUrl,
  author: masterData.personal.name,
  keywords: [
    "Senior SDET",
    "Automation Architect",
    "Playwright Specialist",
    "Appium Lead",
    "Python Test Automation",
    "AI OCR QA Specialist",
    "Fire TV Testing",
    "Salesforce",
    "Angular",
    "Apache JMeter",
    "Harish Chintala",
  ],
  ogTitle: masterData.siteConfig.siteTitle,
  ogDescription: masterData.siteConfig.siteDescription,
  locale: "en_US",
};

export const JSON_LD_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: masterData.personal.name,
  jobTitle: masterData.personal.title,
  worksFor: {
    "@type": "Organization",
    name: "Delta Air Lines",
  },
  url: masterData.siteConfig.canonicalUrl,
  sameAs: [masterData.personal.github, masterData.personal.linkedin],
  knowsAbout: [
    "Test Automation",
    "Playwright",
    "Appium",
    "Python",
    "TypeScript",
    "AI OCR Intelligence",
    "CI/CD DevOps",
    "Salesforce",
    "Angular",
    "Apache JMeter",
  ],
};

export default masterData;
