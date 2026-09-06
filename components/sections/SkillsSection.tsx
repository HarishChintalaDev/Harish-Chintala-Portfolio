"use client";

import { Cpu, Layers, Terminal, Server, Code, Monitor, Wrench, Cloud, Bot, Database } from "lucide-react";
import { SKILL_CATEGORIES } from "@/data";
import TiltCard from "@/components/ui/TiltCard";
import SectionHeader from "@/components/ui/SectionHeader";
import SectionDivider from "@/components/ui/SectionDivider";

export default function SkillsSection() {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Automation Testing":
      case "Test Automation":
        return <Terminal className="w-4.5 h-4.5 text-indigo-300 shrink-0" />;
      case "API Testing":
        return <Server className="w-4.5 h-4.5 text-indigo-300 shrink-0" />;
      case "Programming Languages":
        return <Code className="w-4.5 h-4.5 text-indigo-300 shrink-0" />;
      case "AI / ML & OCR Frameworks":
      case "AI / ML Frameworks":
        return <Bot className="w-4.5 h-4.5 text-indigo-300 shrink-0" />;
      case "CI/CD & DevOps":
        return <Wrench className="w-4.5 h-4.5 text-indigo-300 shrink-0" />;
      case "Cloud & Operating Systems":
      case "Cloud Platforms":
        return <Cloud className="w-4.5 h-4.5 text-indigo-300 shrink-0" />;
      case "Operating Systems":
        return <Cpu className="w-4.5 h-4.5 text-indigo-300 shrink-0" />;
      case "Frontend Development & Management":
      case "Frontend Development":
        return <Monitor className="w-4.5 h-4.5 text-indigo-300 shrink-0" />;
      case "Databases":
        return <Database className="w-4.5 h-4.5 text-indigo-300 shrink-0" />;
      default:
        return <Layers className="w-4.5 h-4.5 text-indigo-300 shrink-0" />;
    }
  };

  return (
    <section id="skills" className="relative z-10 scroll-mt-24 bg-transparent px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <SectionDivider variant="indigo" />
      <div className="mx-auto mt-8 sm:mt-10 lg:mt-12 w-full max-w-7xl min-w-0 space-y-8 sm:space-y-10">
      <SectionHeader
        badgeIcon={Cpu}
        badgeText="TECHNICAL PROFICIENCY"
        badgeVariant="indigo"
        title={
          <span className="inline-flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-3">
            <span>Technical</span>
            <span className="text-gradient-indigo">Expertise & Stack</span>
          </span>
        }
        subtitle="Core competencies in Frontend Development, CI/CD DevOps, AI/ML OCR Intelligence, Playwright & Appium Automation, and Cloud Infrastructure."
      />

      {/* Skills Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SKILL_CATEGORIES.map((group) => (
          <article
            key={group.category}
            className="h-full min-w-0"
          >
            <TiltCard className="h-full">
              <div className="glass-card flex h-full min-w-0 flex-col justify-between space-y-5 rounded-3xl border border-white/15 p-5 shadow-xl transition-all duration-300 hover:border-indigo-400/50 hover:shadow-[0_8px_30px_rgba(99,102,241,0.14)] sm:p-6">
                <div className="space-y-4">
                  {/* Category Header */}
                  <div className="flex flex-col items-start justify-between gap-3 border-b border-white/10 pb-3.5 min-[420px]:flex-row">
                    <h3 className="flex min-w-0 items-start gap-2.5 text-sm font-bold leading-snug text-white sm:text-base">
                      {getCategoryIcon(group.category)}
                      <span className="min-w-0 break-words">{group.category}</span>
                    </h3>
                    <span className="text-[11px] font-mono text-indigo-300 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-400/40 font-bold shrink-0 whitespace-nowrap inline-flex items-center justify-center shadow-inner">
                      {group.skills.length} Tools
                    </span>
                  </div>

                  {/* Tech Chips */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {group.skills.map((skill, sIdx) => (
                      <div
                        key={sIdx}
                        className="max-w-full break-words rounded-xl border border-slate-700/90 bg-slate-900/90 px-3.5 py-1.5 font-mono text-xs font-medium text-slate-100 shadow-inner transition-all hover:border-indigo-400/50 hover:bg-slate-800 hover:text-indigo-300 motion-safe:hover:scale-105"
                      >
                        {skill.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TiltCard>
          </article>
        ))}
      </div>
    </div>
  </section>
);
}
