"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Code,
  ArrowUpRight,
  Github,
  Building2,
  CalendarDays,
  LayoutGrid,
  Workflow,
  BrainCircuit,
  Gauge,
  GitBranch,
  Layers,
} from "lucide-react";
import { PROJECTS, PROJECT_CATEGORIES } from "@/data";
import { Project } from "@/types";
import SectionHeader from "@/components/ui/SectionHeader";
import SectionDivider from "@/components/ui/SectionDivider";

const ProjectDetailsModal = dynamic(() => import("./ProjectDetailsModal"), {
  ssr: false,
});

const PROJECT_FILTER_META = {
  All: { icon: LayoutGrid, accent: "border-cyan-400/20 bg-cyan-500/10 text-cyan-300" },
  Automation: { icon: Workflow, accent: "border-sky-400/20 bg-sky-500/10 text-sky-300" },
  "AI & ML": { icon: BrainCircuit, accent: "border-purple-400/20 bg-purple-500/10 text-purple-300" },
  Performance: { icon: Gauge, accent: "border-amber-400/20 bg-amber-500/10 text-amber-300" },
  DevOps: { icon: GitBranch, accent: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300" },
  Others: { icon: Layers, accent: "border-rose-400/20 bg-rose-500/10 text-rose-300" },
} as const;

function ProjectMetricValue({
  value,
  displayValue,
  size = "card",
}: {
  value: string;
  displayValue?: string;
  size?: "card" | "modal";
}) {
  const visibleValue = displayValue ?? value;
  const [primaryValue, detailValue] = visibleValue.split(/\s*·\s*/, 2);

  return (
    <div
      className={`inline-flex max-w-full items-baseline justify-center gap-1 font-mono font-black leading-none tracking-tight overflow-hidden ${
        size === "modal" ? "text-xl sm:text-2xl" : "text-xs sm:text-sm lg:text-base"
      }`}
    >
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="truncate">{primaryValue}</span>
      {detailValue && (
        <span
          aria-hidden="true"
          className={`inline-flex items-baseline gap-0.5 font-extrabold opacity-90 truncate ${
            size === "modal" ? "text-xs sm:text-[13px]" : "text-[9px] sm:text-[10px]"
          }`}
        >
          <span className="opacity-60">·</span>
          {detailValue}
        </span>
      )}
    </div>
  );
}

export default function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const filteredProjects =
    selectedCategory === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === selectedCategory);

  const getCategoryBadgeClass = (category: Project["category"]) => {
    switch (category) {
      case "Automation":
        return "badge-automation";
      case "AI & ML":
        return "badge-ai";
      case "Performance":
        return "badge-performance";
      case "DevOps":
        return "badge-devops";
      case "Others":
        return "badge-others";
      default:
        return "badge-automation";
    }
  };

  return (
    <section id="projects" className="relative z-10 scroll-mt-24 bg-transparent px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <SectionDivider variant="blue" />
      <div className="mx-auto mt-8 sm:mt-10 lg:mt-12 w-full max-w-7xl min-w-0 space-y-8 sm:space-y-10">
        <SectionHeader
          badgeIcon={Code}
          badgeText="ENGINEERING CASE STUDIES"
          badgeVariant="blue"
          title={
            <span className="inline-flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-3">
              <span>Featured</span>
              <span className="text-gradient-primary">Case Studies</span>
            </span>
          }
          subtitle="Production-grade automation solutions, AI/ML testing engines, and high-performance frameworks built for enterprise scale."
        />

        {/* Responsive segmented filter */}
        <div
          role="group"
          aria-label="Filter case studies by category"
          className="project-filter-strip mx-auto flex w-full max-w-full items-center gap-1.5 overflow-x-auto rounded-2xl border p-1.5 sm:w-fit sm:justify-center"
        >
          {PROJECT_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const projectCount = cat === "All" ? PROJECTS.length : PROJECTS.filter((project) => project.category === cat).length;
            const { icon: FilterIcon, accent: filterAccent } = PROJECT_FILTER_META[cat];

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={isSelected}
                aria-controls="projects-grid"
                className={`project-filter-button ui-pressable group/filter relative isolate flex min-h-11 shrink-0 snap-center items-center justify-center gap-2 overflow-hidden rounded-xl px-3.5 py-2.5 font-mono text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:px-4 ${
                  isSelected
                    ? "text-white"
                    : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {isSelected && (
                  <motion.span
                    aria-hidden="true"
                    layoutId="active-project-filter"
                    className="project-filter-active-indicator absolute inset-0 -z-10 rounded-xl border border-cyan-300/55 bg-gradient-to-r from-sky-600 via-indigo-600 to-cyan-600 shadow-[0_8px_24px_rgba(14,165,233,0.28),inset_0_1px_0_rgba(255,255,255,0.22)]"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 420, damping: 34, mass: 0.7 }
                    }
                  />
                )}
                <span
                  aria-hidden="true"
                  className={`project-filter-icon relative z-10 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${
                    isSelected
                      ? "border-white/20 bg-white/15 text-white shadow-[0_0_14px_rgba(103,232,249,0.22)]"
                      : filterAccent
                  }`}
                >
                  <FilterIcon className="h-3.5 w-3.5" />
                </span>
                <span className="relative z-10 whitespace-nowrap">{cat}</span>
                <span
                  aria-label={`${projectCount} ${projectCount === 1 ? "case study" : "case studies"}`}
                  className={`project-filter-count relative z-10 inline-flex h-5 min-w-5 items-center justify-center rounded-md border px-1.5 text-[9px] font-bold leading-none transition-colors ${
                    isSelected
                      ? "border-white/20 bg-white/15 text-white"
                      : "border-white/10 bg-black/15 text-slate-400 group-hover/filter:border-cyan-300/20 group-hover/filter:text-cyan-300"
                  }`}
                >
                  {projectCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Projects Cards Grid with 3D Tilt Physics */}
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          Showing {filteredProjects.length} {filteredProjects.length === 1 ? "case study" : "case studies"}.
        </p>
        <div id="projects-grid" className="grid grid-cols-1 gap-6.5 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.article
                key={project.id}
                layout
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -10 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 350, damping: 28, mass: 0.8 }
                }
                className="h-full transform-gpu"
              >
                <div className="glass-card p-6 rounded-3xl border border-white/15 space-y-5 flex flex-col justify-between group hover:border-cyan-400/50 transition-colors duration-300 h-full shadow-xl">
                  <div className="space-y-4">
                    {/* Consistent metadata: category/date first, company below. */}
                    <div className="space-y-2.5">
                      <div className="flex w-full flex-nowrap items-center justify-between gap-2">
                        <span className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[10px] font-bold tracking-wide sm:text-[11px] ${getCategoryBadgeClass(project.category)}`}>
                          {project.category}
                        </span>
                        <span className="project-period-badge inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-white/10 px-2.5 py-1 font-mono text-[10px] font-semibold text-slate-200">
                          <CalendarDays aria-hidden="true" className="h-3 w-3" />
                          {project.period}
                        </span>
                      </div>
                      <div className="project-company-line flex min-w-0 items-start gap-2 font-mono text-[11px] font-semibold leading-relaxed text-slate-300">
                        <Building2 aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-300" />
                        <span className="min-w-0 break-words">{project.company}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug tracking-tight">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 font-medium leading-relaxed">{project.subtitle}</p>
                    </div>

                    {/* Unified impact dashboard */}
                    <dl className="project-metrics-panel">
                      {project.metrics.map((m, mIdx) => (
                        <div key={mIdx} className="project-metric-cell">
                          <dt className="order-2 mt-1.5 font-mono text-[10.5px] font-semibold leading-snug text-slate-300">
                            {m.label}
                          </dt>
                          <dd className="order-1 min-w-0 text-emerald-400 tabular-nums">
                            <ProjectMetricValue value={m.value} displayValue={m.displayValue} />
                          </dd>
                        </div>
                      ))}
                    </dl>

                    {/* Problem & Solution Preview */}
                    <p className="text-xs text-slate-200 line-clamp-3 leading-relaxed">
                      {project.solution}
                    </p>
                  </div>

                  {/* Card Footer Tech Stack & CTA */}
                  <div className="pt-3 space-y-3.5 border-t border-white/10">
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.slice(0, 4).map((tech, tIdx) => (
                        <span key={tIdx} className="max-w-full px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-[10.5px] font-mono text-slate-200 hover:text-cyan-300 hover:border-cyan-400/40 transition-colors break-words">
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 4 && (
                        <button
                          type="button"
                          onClick={() => setActiveProject(project)}
                          title={`View all ${project.techStack.length} technologies for ${project.title}`}
                          className="ui-pressable px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-cyan-400/50 text-[10.5px] font-mono text-slate-300 hover:text-cyan-300 transition-all cursor-pointer active:scale-[0.98]"
                        >
                          +{project.techStack.length - 4} more
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveProject(project)}
                        aria-haspopup="dialog"
                        className="ui-pressable ui-glass-surface ui-button-sheen group/action min-h-11 flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500/20 via-indigo-500/25 to-cyan-400/20 hover:from-sky-500/40 hover:to-cyan-400/40 border border-cyan-400/40 hover:border-cyan-300 text-xs font-semibold text-cyan-300 hover:text-white transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(56,189,248,0.35)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      >
                        <span>Architecture & Details</span>
                        <ArrowUpRight aria-hidden="true" className="w-3.5 h-3.5 text-cyan-300 group-hover/action:translate-x-0.5 group-hover/action:-translate-y-0.5 transition-transform motion-reduce:transform-none" />
                      </button>

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View ${project.title} GitHub repository (opens in a new tab)`}
                          className="ui-pressable ui-glass-surface w-11 h-11 shrink-0 inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-slate-200 hover:text-white hover:border-white/70 hover:shadow-[0_0_20px_rgba(255,255,255,0.35)] active:scale-[0.96] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                          title="View GitHub Repository"
                        >
                          <Github aria-hidden="true" className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Project Details Modal */}
      <ProjectDetailsModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
        getCategoryBadgeClass={getCategoryBadgeClass}
        renderMetricValue={(val, dispVal, sz) => (
          <ProjectMetricValue value={val} displayValue={dispVal} size={sz} />
        )}
      />
    </section>
  );
}
