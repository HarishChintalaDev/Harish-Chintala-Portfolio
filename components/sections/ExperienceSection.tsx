"use client";

import { useState, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Calendar,
  MapPin,
  ChevronRight,
  Award,
} from "lucide-react";
import { EXPERIENCES } from "@/data";
import SectionHeader from "@/components/ui/SectionHeader";
import SectionDivider from "@/components/ui/SectionDivider";

export default function ExperienceSection() {
  const [activeExpId, setActiveExpId] = useState<string>(EXPERIENCES[0].id);
  const activeExp =
    EXPERIENCES.find((e) => e.id === activeExpId) || EXPERIENCES[0];

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keyOffsets: Record<string, number> = {
      ArrowRight: 1,
      ArrowDown: 1,
      ArrowLeft: -1,
      ArrowUp: -1,
    };
    let nextIndex = index;

    if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = EXPERIENCES.length - 1;
    else if (event.key in keyOffsets) {
      nextIndex = (index + keyOffsets[event.key] + EXPERIENCES.length) % EXPERIENCES.length;
    } else return;

    event.preventDefault();
    const nextExperience = EXPERIENCES[nextIndex];
    setActiveExpId(nextExperience.id);
    requestAnimationFrame(() => document.getElementById(`experience-tab-${nextExperience.id}`)?.focus());
  };

  return (
    <section
      id="experience"
      className="relative z-10 scroll-mt-24 bg-transparent px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16"
    >
      <SectionDivider variant="purple" />
      <div className="mx-auto mt-8 sm:mt-10 lg:mt-12 w-full max-w-7xl min-w-0 space-y-8 sm:space-y-10">
        <SectionHeader
          badgeIcon={Building2}
          badgeText="CAREER TIMELINE"
          badgeVariant="purple"
          title={
            <span className="inline-flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-3">
              <span>Career</span>
              <span className="text-gradient-purple">Experience</span>
            </span>
          }
          subtitle="5+ years architecting scalable test frameworks, AI OCR intelligence, and high-throughput CI/CD pipelines across Delta Air Lines, INTO Global, and Amazon."
        />

        {/* Main Layout: Stack on mobile, side-by-side on large screens */}
        <div className="flex min-w-0 flex-col items-start gap-6 lg:flex-row">
          {/* ── Left: Company Selector Tabs ── */}
          <div className="grid w-full min-w-0 shrink-0 grid-cols-1 gap-2.5 min-[480px]:grid-cols-2 lg:flex lg:w-72 lg:flex-col xl:w-80" role="tablist" aria-label="Career experience">
            {EXPERIENCES.map((exp, idx) => {
              const isActive = exp.id === activeExpId;
              return (
                <button
                  key={exp.id}
                  onClick={() => setActiveExpId(exp.id)}
                  aria-label={`View experience at ${exp.company}`}
                  aria-selected={isActive}
                  aria-controls={`experience-panel-${exp.id}`}
                  id={`experience-tab-${exp.id}`}
                  role="tab"
                  tabIndex={isActive ? 0 : -1}
                  onKeyDown={(event) => handleTabKeyDown(event, idx)}
                  className={`ui-pressable group min-h-11 w-full overflow-hidden rounded-2xl border text-left transition-all duration-300 ${isActive
                      ? "bg-gradient-to-r from-purple-500/20 via-indigo-500/15 to-sky-500/10 border-purple-400/50 shadow-[0_4px_20px_rgba(168,85,247,0.15)]"
                      : "bg-slate-900/50 border-white/8 hover:border-purple-400/30 hover:bg-slate-800/60"
                    }`}
                >
                  <div className="relative p-3 sm:p-4">
                    {/* Full-width company name: this is intentionally separate
                        from the metadata row so it never needs to be clipped. */}
                    <div className="pr-7 min-w-0">
                      <p
                        title={exp.company}
                        className={`text-[10px] min-[380px]:text-xs font-bold leading-snug transition-colors break-words ${isActive
                            ? "text-white"
                            : "text-slate-300 group-hover:text-white"
                          }`}
                      >
                        {exp.company}
                      </p>
                    </div>

                    {/* Chevron */}
                    <ChevronRight
                      className={`absolute right-3 sm:right-4 top-3.5 sm:top-4 w-3.5 h-3.5 shrink-0 transition-all ${isActive
                          ? "text-purple-400 translate-x-0.5 opacity-100"
                          : "text-slate-600 opacity-0 group-hover:opacity-60"
                        }`}
                    />

                    <div className="flex items-center gap-3 mt-2">
                      {/* Icon */}
                      <div
                        className={`p-2 rounded-xl border shrink-0 transition-all ${isActive
                            ? "bg-purple-500/25 border-purple-400/60 text-purple-300"
                            : "bg-white/5 border-white/10 text-slate-400 group-hover:text-purple-300 group-hover:border-purple-400/30"
                          }`}
                      >
                        <Building2 className="w-4 h-4" />
                      </div>
                      <p className="text-[10.5px] text-slate-400 font-mono">
                        {exp.period}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ── Right: Active Role Detail Panel ── */}
          <div className="min-w-0 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeExp.id}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="glass-card rounded-3xl border border-white/12 bg-[#060a1a]/90 shadow-2xl"
                id={`experience-panel-${activeExp.id}`}
                role="tabpanel"
                aria-labelledby={`experience-tab-${activeExp.id}`}
                tabIndex={0}
              >
                {/* Card Header */}
                <div className="border-b border-white/8 p-5 sm:p-7">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    {/* Left: Title + Company */}
                    <div className="space-y-2.5 flex-1 min-w-0">
                      {/* Role Title */}
                      <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-tight">
                        {activeExp.role}
                      </h3>

                      {/* Company */}
                      <p className="text-sm font-semibold text-cyan-400">
                        {activeExp.company}
                      </p>
                    </div>

                    {/* Right: Period + Location */}
                    <div className="flex flex-wrap flex-row sm:flex-col gap-3 sm:gap-2 text-left sm:text-right shrink-0">
                      <div className="flex items-center sm:justify-end gap-1.5 text-xs text-slate-400 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span className="whitespace-nowrap">{activeExp.period}</span>
                      </div>
                      <div className="flex items-center sm:justify-end gap-1.5 text-xs text-slate-400 font-mono">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{activeExp.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Promotion Badge (if any) */}
                {activeExp.careerProgression && (
                  <div className="mx-5 mt-5 flex min-w-0 items-start gap-2.5 rounded-2xl border border-purple-400/25 bg-purple-500/8 px-4 py-3 font-mono text-xs text-purple-300 sm:mx-7">
                    <Award className="w-3.5 h-3.5 shrink-0" />
                    <span className="min-w-0 break-words">
                      Promotion:{" "}
                      <strong className="text-white">
                        {activeExp.careerProgression}
                      </strong>
                    </span>
                  </div>
                )}

                {/* Achievements */}
                <div className="space-y-3 px-5 py-5 sm:px-7">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
                    Key Deliverables &amp; Engineering ROI
                  </h4>
                  <ul className="space-y-3">
                    {activeExp.achievements.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-xs sm:text-[13px] text-slate-300 leading-relaxed"
                      >
                        <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 shadow-[0_0_6px_rgba(168,85,247,0.7)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack */}
                <div className="space-y-3 border-t border-white/6 px-5 pb-5 pt-4 sm:px-7 sm:pb-7">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
                    Technologies &amp; Tools
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeExp.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="max-w-full break-words rounded-lg border border-slate-700/60 bg-slate-800/80 px-2.5 py-1 font-mono text-[11px] text-slate-300 transition-colors hover:border-purple-400/50 hover:text-purple-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
