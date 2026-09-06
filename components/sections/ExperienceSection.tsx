"use client";

import { useState, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Calendar,
  MapPin,
  ChevronRight,
  ChevronDown,
  Award,
  Sparkles,
} from "lucide-react";
import { EXPERIENCES } from "@/data";
import SectionHeader from "@/components/ui/SectionHeader";
import SectionDivider from "@/components/ui/SectionDivider";

export default function ExperienceSection() {
  const [activeExpId, setActiveExpId] = useState<string>(EXPERIENCES[0].id);
  const [mobileExpandedId, setMobileExpandedId] = useState<string | null>(
    EXPERIENCES[0].id
  );

  const activeExp =
    EXPERIENCES.find((e) => e.id === activeExpId) || EXPERIENCES[0];

  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
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
      nextIndex =
        (index + keyOffsets[event.key] + EXPERIENCES.length) %
        EXPERIENCES.length;
    } else return;

    event.preventDefault();
    const nextExperience = EXPERIENCES[nextIndex];
    setActiveExpId(nextExperience.id);
    setMobileExpandedId(nextExperience.id);
    requestAnimationFrame(() =>
      document.getElementById(`experience-tab-${nextExperience.id}`)?.focus()
    );
  };

  const handleMobileToggle = (id: string) => {
    setMobileExpandedId((prev) => (prev === id ? null : id));
    setActiveExpId(id);
  };

  return (
    <section
      id="experience"
      className="relative z-10 scroll-mt-24 bg-transparent px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16"
    >
      <SectionDivider variant="purple" />
      <div className="mx-auto mt-8 w-full max-w-7xl min-w-0 space-y-8 sm:mt-10 sm:space-y-10 lg:mt-12">
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

        {/* ══════════════════════════════════════════════════════════════════
            MOBILE VIEW (< lg): Interactive Inline Accordion
            - Zero pogo-sticking: taps expand directly in place
            - Latest role (Delta) open by default for immediate ROI
            - Immediate feedback without scrolling down
        ══════════════════════════════════════════════════════════════════ */}
        <div className="flex w-full min-w-0 flex-col gap-3.5 lg:hidden">
          {/* Mobile UX hint */}
          <div className="flex items-center justify-between px-1 text-[11px] font-mono text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-purple-400" />
              Tap any role to view deliverables &amp; tech stack
            </span>
            <span className="text-slate-500">
              {EXPERIENCES.length} Roles
            </span>
          </div>

          {EXPERIENCES.map((exp) => {
            const isExpanded = mobileExpandedId === exp.id;

            return (
              <div
                key={`mobile-${exp.id}`}
                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isExpanded
                    ? "border-purple-400/50 bg-[#060a1a]/95 shadow-[0_4px_25px_rgba(168,85,247,0.15)] ring-1 ring-purple-400/30"
                    : "border-white/10 bg-slate-900/60 hover:border-purple-400/30 hover:bg-slate-800/60"
                }`}
              >
                {/* Accordion Trigger Header */}
                <button
                  type="button"
                  onClick={() => handleMobileToggle(exp.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`mobile-panel-${exp.id}`}
                  id={`mobile-trigger-${exp.id}`}
                  className="group flex w-full items-start justify-between gap-3 p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    {/* Company Icon */}
                    <div
                      className={`mt-0.5 shrink-0 rounded-xl border p-2 transition-colors ${
                        isExpanded
                          ? "border-purple-400/60 bg-purple-500/25 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                          : "border-white/10 bg-white/5 text-slate-400 group-hover:border-purple-400/30 group-hover:text-purple-300"
                      }`}
                    >
                      <Building2 className="h-4 w-4" />
                    </div>

                    {/* Header Info */}
                    <div className="min-w-0 flex-1 space-y-1">
                      {/* Top row: Company name */}
                      <p
                        className={`text-xs font-bold leading-tight transition-colors ${
                          isExpanded ? "text-white" : "text-slate-200 group-hover:text-white"
                        }`}
                      >
                        {exp.company}
                      </p>

                      {/* Role Title */}
                      <p className="text-xs font-semibold text-cyan-400 leading-snug">
                        {exp.role}
                      </p>

                      {/* Period & Location Metadata */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5 font-mono text-[10.5px] text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-purple-400 shrink-0" />
                          {exp.period}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-amber-400 shrink-0" />
                          {exp.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expand / Collapse Chevron */}
                  <div
                    className={`mt-1 shrink-0 rounded-lg p-1 transition-transform duration-300 ${
                      isExpanded
                        ? "rotate-180 text-purple-400"
                        : "text-slate-500 group-hover:text-slate-300"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {/* Accordion Expandable Content */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      id={`mobile-panel-${exp.id}`}
                      role="region"
                      aria-labelledby={`mobile-trigger-${exp.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden border-t border-white/8 bg-[#040714]/60"
                    >

                      {/* Promotion Badge (if present) */}
                      {exp.careerProgression && (
                        <div className="mx-4 mt-3.5 flex items-start gap-2 rounded-xl border border-purple-400/25 bg-purple-500/10 p-2.5 font-mono text-xs text-purple-300">
                          <Award className="mt-0.5 h-3.5 w-3.5 shrink-0 text-purple-400" />
                          <span className="break-words">
                            Promotion:{" "}
                            <strong className="text-white">
                              {exp.careerProgression}
                            </strong>
                          </span>
                        </div>
                      )}

                      {/* Key Deliverables */}
                      <div className="space-y-2.5 px-4 py-3.5">
                        <h4 className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                          Key Deliverables &amp; Engineering ROI
                        </h4>
                        <ul className="space-y-2.5">
                          {exp.achievements.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-300"
                            >
                              <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.7)]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Technologies & Tools */}
                      <div className="border-t border-white/6 px-4 py-3">
                        <h4 className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                          Technologies &amp; Tools
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {exp.techStack.map((tech, i) => (
                            <span
                              key={i}
                              className="rounded-md border border-slate-700/60 bg-slate-800/80 px-2 py-0.5 font-mono text-[10.5px] text-slate-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            DESKTOP VIEW (lg+): World-Class Master-Detail View
            - Left: Company Selector Tabs with role subtitles & luminous indicator
            - Right: Active Role Detail Panel with executive summary & rich ROI
        ══════════════════════════════════════════════════════════════════ */}
        <div className="hidden min-w-0 items-start gap-7 lg:flex lg:flex-row">
          {/* ── Left: Company Selector Tabs ── */}
          <div
            className="flex w-80 shrink-0 flex-col gap-3 xl:w-88"
            role="tablist"
            aria-label="Career experience"
          >
            {EXPERIENCES.map((exp, idx) => {
              const isActive = exp.id === activeExpId;

              return (
                <button
                  key={exp.id}
                  onClick={() => {
                    setActiveExpId(exp.id);
                    setMobileExpandedId(exp.id);
                  }}
                  aria-label={`View experience at ${exp.company}`}
                  aria-selected={isActive}
                  aria-controls={`experience-panel-${exp.id}`}
                  id={`experience-tab-${exp.id}`}
                  role="tab"
                  tabIndex={isActive ? 0 : -1}
                  onKeyDown={(event) => handleTabKeyDown(event, idx)}
                  className={`ui-pressable group relative min-h-11 w-full overflow-hidden rounded-2xl border text-left transition-all duration-300 ${
                    isActive
                      ? "border-purple-400/60 bg-gradient-to-r from-purple-500/20 via-indigo-500/15 to-sky-500/10 shadow-[0_4px_24px_rgba(168,85,247,0.18)] ring-1 ring-purple-400/40"
                      : "border-white/8 bg-slate-900/50 hover:border-purple-400/30 hover:bg-slate-800/60"
                  }`}
                >
                  {/* Luminous Active Accent Bar */}
                  {isActive && (
                    <div className="absolute bottom-2.5 left-0 top-2.5 w-1 rounded-r-full bg-gradient-to-b from-purple-400 via-indigo-400 to-cyan-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                  )}

                  <div className="relative p-4 sm:p-4.5">
                    {/* Top Row: Company Name */}
                    <div className="pr-5">
                      <p
                        title={exp.company}
                        className={`break-words text-xs font-bold leading-snug transition-colors ${
                          isActive
                            ? "text-white"
                            : "text-slate-300 group-hover:text-white"
                        }`}
                      >
                        {exp.company}
                      </p>
                    </div>

                    {/* Role Title Subtitle */}
                    <p className="mt-1 text-[11px] font-semibold text-cyan-400/90 leading-tight">
                      {exp.role}
                    </p>

                    {/* Chevron */}
                    <ChevronRight
                      className={`absolute right-3.5 top-4.5 h-4 w-4 shrink-0 transition-all ${
                        isActive
                          ? "translate-x-0.5 text-purple-400 opacity-100"
                          : "text-slate-600 opacity-0 group-hover:opacity-60"
                      }`}
                    />

                    {/* Bottom Metadata Row: Period */}
                    <div className="mt-2.5 flex items-center gap-1.5 font-mono text-[10.5px] text-slate-400">
                      <Calendar className="h-3 w-3 text-purple-400 shrink-0" />
                      <span>{exp.period}</span>
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="glass-card rounded-3xl border border-white/12 bg-[#060a1a]/95 shadow-2xl shadow-purple-500/[0.04] transition-all duration-300 hover:border-purple-500/30 hover:shadow-[0_8px_30px_rgba(192,132,252,0.12)]"
                id={`experience-panel-${activeExp.id}`}
                role="tabpanel"
                aria-labelledby={`experience-tab-${activeExp.id}`}
                tabIndex={0}
              >
                {/* Card Header */}
                <div className="border-b border-white/8 p-5 sm:p-7">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    {/* Left: Role Title + Company */}
                    <div className="min-w-0 flex-1 space-y-2">
                      <h3 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl leading-tight">
                        {activeExp.role}
                      </h3>

                      {/* Company Name */}
                      <p className="text-sm font-semibold text-cyan-400">
                        {activeExp.company}
                      </p>
                    </div>

                    {/* Right: Period + Location */}
                    <div className="flex shrink-0 flex-row flex-wrap gap-3 text-left sm:flex-col sm:gap-2 sm:text-right">
                      <div className="flex items-center gap-1.5 font-mono text-xs text-slate-300 sm:justify-end">
                        <Calendar className="h-3.5 w-3.5 shrink-0 text-purple-400" />
                        <span className="whitespace-nowrap">{activeExp.period}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-xs text-slate-400 sm:justify-end">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                        <span>{activeExp.location}</span>
                      </div>
                    </div>
                  </div>
                </div>


                {/* Promotion Badge (if any) */}
                {activeExp.careerProgression && (
                  <div className="mx-5 mt-5 flex min-w-0 items-start gap-2.5 rounded-2xl border border-purple-400/25 bg-purple-500/10 px-4 py-3 font-mono text-xs text-purple-300 sm:mx-7">
                    <Award className="h-4 w-4 shrink-0 text-purple-400" />
                    <span className="min-w-0 break-words">
                      Promotion:{" "}
                      <strong className="text-white">
                        {activeExp.careerProgression}
                      </strong>
                    </span>
                  </div>
                )}

                {/* Deliverables */}
                <div className="space-y-3 px-5 py-5 sm:px-7">
                  <h4 className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Key Deliverables &amp; Engineering ROI
                  </h4>
                  <ul className="space-y-3">
                    {activeExp.achievements.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-xs leading-relaxed text-slate-300 sm:text-[13px]"
                      >
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.7)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack */}
                <div className="space-y-3 border-t border-white/6 px-5 pb-5 pt-4 sm:px-7 sm:pb-7">
                  <h4 className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-400">
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


