"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Award as AwardIcon, Sparkles, Trophy } from "lucide-react";
import { AWARDS } from "@/data";
import SectionHeader from "@/components/ui/SectionHeader";
import SectionDivider from "@/components/ui/SectionDivider";

export default function AwardsSection() {
  const shouldReduceMotion = useReducedMotion();

  const triggerConfetti = async () => {
    if (shouldReduceMotion) return;

    try {
      const confettiModule = await import("canvas-confetti");
      const confetti = confettiModule.default || confettiModule;
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#F59E0B", "#FBBF24", "#38BDF8", "#818CF8"],
        disableForReducedMotion: true,
      });
    } catch {
      // Graceful fallback if confetti module is blocked
    }
  };

  return (
    <section id="awards" className="relative z-10 scroll-mt-24 bg-transparent px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
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
        subtitle="Engineering excellence awards, performance accolades, and delivery consistency recognitions."
      />

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6.5">
        {AWARDS.map((award) => (
          <article
            key={award.id}
            className="glass-card p-6.5 rounded-3xl border border-white/15 space-y-4 group hover:border-amber-400/50 transition-all hover:scale-[1.02] motion-reduce:hover:scale-100 motion-reduce:transition-none shadow-xl"
          >
            <div className="flex items-start justify-between gap-3">
              {/* Top Left Ribbon Icon Badge */}
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-300 group-hover:border-amber-400/60 group-hover:text-amber-300 transition-all shadow-inner">
                <AwardIcon aria-hidden="true" className="w-6 h-6 text-amber-300 group-hover:text-amber-200" />
              </div>

              {!shouldReduceMotion && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.97, y: 0 }}
                  onClick={triggerConfetti}
                  aria-label={`Celebrate ${award.title}`}
                  title={`Celebrate ${award.title}`}
                  className="ui-glass-surface w-11 h-11 shrink-0 inline-flex items-center justify-center rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-300 hover:bg-amber-500/20 hover:border-amber-300/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <Sparkles aria-hidden="true" className="w-4.5 h-4.5" />
                </motion.button>
              )}
            </div>

            <div className="text-xs font-mono text-amber-300 font-bold tracking-widest">{award.year}</div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                {award.title}
              </h3>
              <div className="text-xs font-semibold text-sky-400">{award.organization}</div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed pt-1 font-normal">{award.description}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);
}
