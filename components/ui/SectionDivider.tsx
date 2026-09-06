"use client";

import { motion, useReducedMotion } from "framer-motion";

interface SectionDividerProps {
  variant?:
    | "purple"
    | "cyan"
    | "blue"
    | "indigo"
    | "emerald"
    | "amber"
    | "orange"
    | "teal"
    | "aurora"
    | "rose";
  className?: string;
}

export default function SectionDivider({ variant = "purple", className = "" }: SectionDividerProps) {
  const shouldReduceMotion = useReducedMotion();
  const gradientMap = {
    purple: "from-transparent via-purple-400 to-transparent",
    cyan: "from-transparent via-cyan-400 to-transparent",
    blue: "from-transparent via-sky-400 to-transparent",
    indigo: "from-transparent via-indigo-400 to-transparent",
    emerald: "from-transparent via-emerald-400 to-transparent",
    amber: "from-transparent via-amber-400 to-transparent",
    orange: "from-transparent via-orange-400 to-transparent",
    teal: "from-transparent via-teal-400 to-transparent",
    aurora: "from-transparent via-cyan-400/50 via-sky-400 via-purple-400/50 to-transparent",
    rose: "from-transparent via-rose-400 to-transparent",
  };

  const glowMap = {
    purple: "shadow-[0_0_20px_rgba(192,132,252,0.8)]",
    cyan: "shadow-[0_0_20px_rgba(6,182,212,0.8)]",
    blue: "shadow-[0_0_20px_rgba(56,189,248,0.8)]",
    indigo: "shadow-[0_0_20px_rgba(99,102,241,0.8)]",
    emerald: "shadow-[0_0_20px_rgba(16,185,129,0.8)]",
    amber: "shadow-[0_0_20px_rgba(245,158,11,0.8)]",
    orange: "shadow-[0_0_20px_rgba(249,115,22,0.8)]",
    teal: "shadow-[0_0_20px_rgba(20,184,166,0.8)]",
    aurora: "shadow-[0_0_25px_rgba(56,189,248,0.7)]",
    rose: "shadow-[0_0_20px_rgba(244,63,94,0.8)]",
  };

  const centerDotMap = {
    purple: "bg-purple-400 border-purple-200 shadow-[0_0_12px_#C084FC]",
    cyan: "bg-cyan-400 border-cyan-200 shadow-[0_0_12px_#06B6D4]",
    blue: "bg-sky-400 border-sky-200 shadow-[0_0_12px_#38BDF8]",
    indigo: "bg-indigo-400 border-indigo-200 shadow-[0_0_12px_#6366F1]",
    emerald: "bg-emerald-400 border-emerald-200 shadow-[0_0_12px_#10B981]",
    amber: "bg-amber-400 border-amber-200 shadow-[0_0_12px_#F59E0B]",
    orange: "bg-orange-400 border-orange-200 shadow-[0_0_12px_#FB923C]",
    teal: "bg-teal-400 border-teal-200 shadow-[0_0_12px_#14B8A6]",
    aurora: "bg-gradient-to-r from-cyan-400 to-purple-400 border-white/80 shadow-[0_0_14px_#38BDF8]",
    rose: "bg-rose-400 border-rose-200 shadow-[0_0_12px_#F43F5E]",
  };

  return (
    <div aria-hidden="true" className={`relative mx-auto my-0 flex h-px w-full max-w-7xl min-w-0 items-center justify-center ${className}`}>
      {/* Main Glowing Line */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.8, ease: "easeOut" }}
        className={`h-px w-full bg-gradient-to-r opacity-70 ${gradientMap[variant]} ${glowMap[variant]}`}
      />

      {/* Central Glowing Diamond Accent */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5, delay: 0.3 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className={`h-2.5 w-2.5 rotate-45 border ${centerDotMap[variant]}`} />
      </motion.div>
    </div>
  );
}
