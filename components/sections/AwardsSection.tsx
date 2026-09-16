"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Award as AwardIcon,
  CheckCircle2,
  Eye,
  Sparkles,
  Trophy,
  ZoomIn,
} from "lucide-react";
import { AWARDS } from "@/data";
import SectionHeader from "@/components/ui/SectionHeader";
import SectionDivider from "@/components/ui/SectionDivider";
import AwardModal from "./AwardModal";
import { Award } from "@/types";

export default function AwardsSection() {
  const shouldReduceMotion = useReducedMotion();
  const [selectedAward, setSelectedAward] = useState<Award | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenAward = (award: Award) => {
    setSelectedAward(award);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAward(null);
  };

  const triggerConfetti = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (shouldReduceMotion) return;

    try {
      const confettiModule = await import("canvas-confetti");
      const confetti = confettiModule.default || confettiModule;
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.7 },
        colors: ["#F59E0B", "#FBBF24", "#38BDF8", "#818CF8", "#34D399"],
        disableForReducedMotion: true,
      });
    } catch {
      // Graceful fallback if confetti module is blocked
    }
  };

  return (
    <section
      id="awards"
      className="relative z-10 scroll-mt-24 bg-transparent px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16"
    >
      <SectionDivider variant="amber" />
      <div className="mx-auto mt-8 sm:mt-10 lg:mt-12 w-full max-w-7xl min-w-0 space-y-8 sm:space-y-10">
        <SectionHeader
          badgeIcon={Trophy}
          badgeText="HONORS & RECOGNITION"
          badgeVariant="amber"
          title={
            <span className="inline-flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-3">
              <span>Honors &</span>
              <span className="text-gradient-amber">Key Achievements</span>
            </span>
          }
          subtitle="Engineering excellence awards, performance accolades, and delivery consistency recognitions from Delta Air Lines, Amazon, and INTO Global."
        />

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6.5">
          {AWARDS.map((award) => (
            <article
              key={award.id}
              className="glass-card flex flex-col justify-between p-6 rounded-3xl border border-white/15 space-y-4 group hover:border-amber-400/50 hover:shadow-[0_8px_30px_rgba(245,158,11,0.14)] transition-all duration-300 hover:scale-[1.02] motion-reduce:hover:scale-100 motion-reduce:transition-none shadow-xl"
            >
              <div className="space-y-4">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-300 group-hover:border-amber-400/60 transition-all shadow-inner">
                    <AwardIcon
                      aria-hidden="true"
                      className="w-6 h-6 text-amber-300 group-hover:text-amber-200"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/15 border border-amber-400/40 text-amber-300 shrink-0">
                      {award.year}
                    </span>

                    {!shouldReduceMotion && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.97, y: 0 }}
                        onClick={triggerConfetti}
                        aria-label={`Celebrate ${award.title}`}
                        title={`Celebrate ${award.title}`}
                        className="ui-glass-surface w-9 h-9 shrink-0 inline-flex items-center justify-center rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-300 hover:bg-amber-500/20 hover:border-amber-300/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ml-1"
                      >
                        <Sparkles aria-hidden="true" className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Award Title & Org */}
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white leading-snug">
                    {award.title}
                  </h3>
                  <div className="text-xs text-slate-300 font-semibold">
                    {award.organization}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-200 leading-relaxed font-normal line-clamp-3">
                  {award.description}
                </p>

                {/* Certificate File / Image Preview Container */}
                {award.imageUrl ? (
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`View certificate for ${award.title}`}
                    onClick={() => handleOpenAward(award)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleOpenAward(award);
                      }
                    }}
                    className="group/file relative rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:border-amber-400/60 transition-all cursor-pointer overflow-hidden shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    <div className="relative h-44 sm:h-48 w-full bg-slate-950 flex items-center justify-center overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={award.imageUrl}
                        alt={`Certificate preview for ${award.title}`}
                        className="w-full h-full object-cover object-center group-hover/file:scale-105 transition-transform duration-300"
                      />

                      {/* Subtle hover zoom icon indicator */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover/file:opacity-100 transition-opacity duration-200">
                        <span className="w-8 h-8 rounded-xl bg-slate-950/80 backdrop-blur-md border border-amber-400/40 text-amber-300 flex items-center justify-center shadow-lg">
                          <ZoomIn className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 h-44 sm:h-48 flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center text-amber-300 shadow-inner">
                      <Trophy className="w-6 h-6 text-amber-300" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-200">
                        Engineering Excellence Honor
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {award.organization}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Action Button */}
              <div className="pt-2">
                {award.imageUrl ? (
                  <button
                    type="button"
                    onClick={() => handleOpenAward(award)}
                    className="ui-pressable group/btn w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/30 border border-amber-400/40 hover:border-amber-400/70 text-amber-300 hover:text-white text-xs font-bold transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    <Eye className="w-4 h-4 text-amber-400" />
                    <span>View Certificate</span>
                  </button>
                ) : (
                  <div className="w-full py-2.5 px-4 rounded-2xl bg-white/[0.03] border border-white/5 text-[11px] font-medium text-slate-400 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/80 shrink-0" />
                    <span>Official Internal Recognition</span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Certificate Viewer Modal */}
      <AwardModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        award={selectedAward}
      />
    </section>
  );
}
