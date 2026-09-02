"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  CalendarDays,
  HelpCircle,
  Lightbulb,
  Server,
  X,
} from "lucide-react";
import { Project } from "@/types";
import { lockDocumentScroll } from "@/lib/documentScrollLock";

interface ProjectDetailsModalProps {
  project: Project | null;
  onClose: () => void;
  getCategoryBadgeClass: (category: Project["category"]) => string;
  renderMetricValue: (value: string, displayValue?: string, size?: "card" | "modal") => React.ReactNode;
}

export default function ProjectDetailsModal({
  project,
  onClose,
  getCategoryBadgeClass,
  renderMetricValue,
}: ProjectDetailsModalProps) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!project) return;
    const releaseScrollLock = lockDocumentScroll();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      releaseScrollLock();
    };
  }, [project, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto overscroll-contain p-4 sm:p-6 bg-slate-950/75 backdrop-blur-xl modal-backdrop transform-gpu"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`project-dialog-title-${project.id}`}
            aria-describedby={`project-dialog-description-${project.id}`}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative my-auto flex max-h-[calc(100dvh-3rem)] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-cyan-500/30 bg-[#070b1e]/95 text-white shadow-[0_30px_90px_rgba(0,0,0,0.9),0_0_60px_rgba(14,165,233,0.22)] modal-dialog transform-gpu focus:outline-none"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label={`Close details for ${project.title}`}
              className="ui-pressable ui-glass-surface absolute top-4 right-4 sm:top-6 sm:right-6 z-30 w-10 h-10 shrink-0 inline-flex items-center justify-center rounded-full bg-slate-800/90 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700/80 hover:border-red-400/60 shadow-lg transition-all active:scale-[0.96] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <X aria-hidden="true" className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="shrink-0 border-b border-cyan-500/20 bg-gradient-to-r from-slate-900/80 via-[#0b132b]/85 to-slate-900/80 pb-5 pl-6 pr-16 pt-6 sm:pb-6 sm:pl-8 sm:pr-20 sm:pt-8 backdrop-blur-md">
              <div className="min-w-0">
                <div className="flex w-full flex-nowrap items-center justify-between gap-2">
                  <span className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1 font-mono text-[11px] font-bold tracking-wide sm:text-xs shadow-sm ${getCategoryBadgeClass(project.category)}`}>
                    {project.category}
                  </span>
                  <span className="project-period-badge inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 font-mono text-[11px] font-semibold text-cyan-300">
                    <CalendarDays aria-hidden="true" className="h-3.5 w-3.5 text-cyan-300" />
                    {project.period}
                  </span>
                </div>
                <div className="project-company-line mt-3 flex min-w-0 items-center gap-2 font-mono text-xs font-semibold text-slate-300">
                  <Building2 aria-hidden="true" className="h-4 w-4 shrink-0 text-cyan-400" />
                  <span className="min-w-0 break-words text-cyan-200/90">{project.company}</span>
                </div>
                <h3 id={`project-dialog-title-${project.id}`} className="text-xl sm:text-2xl font-black text-white mt-2.5 leading-snug tracking-tight break-words">
                  {project.title}
                </h3>
                <p id={`project-dialog-description-${project.id}`} className="text-xs sm:text-sm text-slate-300 font-medium break-words mt-1 leading-relaxed">
                  {project.subtitle}
                </p>
              </div>
            </div>

            {/* Modal Content Scroll Area */}
            <div
              data-project-modal-scroll
              data-lenis-prevent
              onWheel={(e) => e.stopPropagation()}
              className="scroll-surface min-h-0 flex-1 overflow-y-auto overscroll-contain bg-transparent px-6 py-6 sm:px-8 sm:py-8"
            >
              <div className="space-y-6">
                {/* Metrics Panel */}
                <dl className="project-metrics-panel project-metrics-panel-modal">
                  {project.metrics.map((m, idx) => (
                    <div key={idx} className="project-metric-cell">
                      <dt className="order-2 mt-2 font-mono text-xs font-semibold leading-snug text-slate-300">
                        {m.label}
                      </dt>
                      <dd className="order-1 min-w-0 text-cyan-300 tabular-nums">
                        {renderMetricValue(m.value, m.displayValue, "modal")}
                      </dd>
                    </div>
                  ))}
                </dl>

                {/* Problem vs Solution Callouts */}
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 shadow-sm">
                    <h4 className="font-bold text-amber-300 flex items-center gap-2 text-sm sm:text-base">
                      <HelpCircle aria-hidden="true" className="w-4.5 h-4.5 text-amber-400 shrink-0" /> Challenge & Problem Statement
                    </h4>
                    <p className="text-slate-200 leading-relaxed font-normal">{project.problem}</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 shadow-sm">
                    <h4 className="font-bold text-emerald-300 flex items-center gap-2 text-sm sm:text-base">
                      <Lightbulb aria-hidden="true" className="w-4.5 h-4.5 text-emerald-400 shrink-0" /> Engineering Solution & Architecture
                    </h4>
                    <p className="text-slate-200 leading-relaxed font-normal">{project.solution}</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-3 shadow-md">
                    <h4 className="font-bold text-white flex items-center gap-2 text-sm sm:text-base">
                      <Server aria-hidden="true" className="w-4.5 h-4.5 text-indigo-400 shrink-0" /> System Architecture Flow
                    </h4>
                    {project.architecture.includes("->") ? (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {project.architecture.split(/\s*->\s*/).map((step, sIdx, arr) => (
                          <div key={sIdx} className="flex items-center gap-2">
                            <span className="px-3 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-400/40 text-cyan-300 font-mono text-xs font-semibold shadow-sm">
                              {step}
                            </span>
                            {sIdx < arr.length - 1 && (
                              <span className="text-indigo-400 font-mono font-bold text-xs">→</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="font-mono text-xs text-cyan-300 leading-relaxed bg-[#050816] p-3.5 rounded-xl border border-slate-800 break-words [overflow-wrap:anywhere]">
                        {project.architecture}
                      </p>
                    )}
                  </div>
                </div>

                {/* Tech Stack Badges */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2 min-w-0">
                  {project.techStack.map((tech, idx) => (
                    <span key={idx} className="max-w-full px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/90 text-xs font-mono text-slate-200 hover:text-cyan-300 hover:border-cyan-400/50 transition-colors break-words">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
