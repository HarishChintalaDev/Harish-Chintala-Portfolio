"use client";

import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export type BadgeVariant =
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

interface SectionHeaderProps {
  badgeIcon?: LucideIcon;
  badgeText: string;
  badgeVariant?: BadgeVariant;
  title: string | ReactNode;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

const variantStyles: Record<
  BadgeVariant,
  {
    border: string;
    bg: string;
    text: string;
    dotBg: string;
    glow: string;
    ambientGlow: string;
  }
> = {
  purple: {
    border: "border-purple-400/40 group-hover:border-purple-300/70",
    bg: "bg-purple-500/15 hover:bg-purple-500/25",
    text: "text-purple-300",
    dotBg: "bg-purple-400",
    glow: "shadow-[0_0_15px_rgba(168,85,247,0.3)]",
    ambientGlow: "from-purple-600/25 via-fuchsia-600/12 to-transparent",
  },
  cyan: {
    border: "border-cyan-400/40 group-hover:border-cyan-300/70",
    bg: "bg-cyan-500/15 hover:bg-cyan-500/25",
    text: "text-cyan-300",
    dotBg: "bg-cyan-400",
    glow: "shadow-[0_0_15px_rgba(6,182,212,0.35)]",
    ambientGlow: "from-cyan-500/25 via-blue-500/12 to-transparent",
  },
  blue: {
    border: "border-sky-400/40 group-hover:border-sky-300/70",
    bg: "bg-sky-500/15 hover:bg-sky-500/25",
    text: "text-sky-300",
    dotBg: "bg-sky-400",
    glow: "shadow-[0_0_15px_rgba(56,189,248,0.3)]",
    ambientGlow: "from-blue-600/25 via-sky-600/12 to-transparent",
  },
  indigo: {
    border: "border-indigo-400/40 group-hover:border-indigo-300/70",
    bg: "bg-indigo-500/15 hover:bg-indigo-500/25",
    text: "text-indigo-300",
    dotBg: "bg-indigo-400",
    glow: "shadow-[0_0_15px_rgba(99,102,241,0.35)]",
    ambientGlow: "from-indigo-600/25 via-violet-600/12 to-transparent",
  },
  emerald: {
    border: "border-emerald-400/40 group-hover:border-emerald-300/70",
    bg: "bg-emerald-500/15 hover:bg-emerald-500/25",
    text: "text-emerald-300",
    dotBg: "bg-emerald-400",
    glow: "shadow-[0_0_15px_rgba(16,185,129,0.3)]",
    ambientGlow: "from-emerald-500/25 via-teal-500/12 to-transparent",
  },
  amber: {
    border: "border-amber-400/40 group-hover:border-amber-300/70",
    bg: "bg-amber-500/15 hover:bg-amber-500/25",
    text: "text-amber-300",
    dotBg: "bg-amber-400",
    glow: "shadow-[0_0_15px_rgba(245,158,11,0.3)]",
    ambientGlow: "from-amber-500/25 via-orange-500/12 to-transparent",
  },
  orange: {
    border: "border-orange-400/40 group-hover:border-orange-300/70",
    bg: "bg-orange-500/15 hover:bg-orange-500/25",
    text: "text-orange-300",
    dotBg: "bg-orange-400",
    glow: "shadow-[0_0_15px_rgba(249,115,22,0.35)]",
    ambientGlow: "from-orange-500/25 via-amber-500/12 to-transparent",
  },
  teal: {
    border: "border-teal-400/40 group-hover:border-teal-300/70",
    bg: "bg-teal-500/15 hover:bg-teal-500/25",
    text: "text-teal-300",
    dotBg: "bg-teal-400",
    glow: "shadow-[0_0_15px_rgba(20,184,166,0.35)]",
    ambientGlow: "from-teal-500/25 via-emerald-500/12 to-transparent",
  },
  aurora: {
    border: "border-sky-400/40 group-hover:border-purple-400/70",
    bg: "bg-gradient-to-r from-cyan-500/15 via-indigo-500/15 to-purple-500/15 hover:from-cyan-500/25 hover:to-purple-500/25",
    text: "text-sky-200",
    dotBg: "bg-cyan-400",
    glow: "shadow-[0_0_20px_rgba(56,189,248,0.35)]",
    ambientGlow: "from-cyan-500/25 via-indigo-500/15 to-purple-500/15",
  },
  rose: {
    border: "border-rose-400/40 group-hover:border-rose-300/70",
    bg: "bg-rose-500/15 hover:bg-rose-500/25",
    text: "text-rose-300",
    dotBg: "bg-rose-400",
    glow: "shadow-[0_0_15px_rgba(244,63,94,0.35)]",
    ambientGlow: "from-rose-500/25 via-pink-500/12 to-transparent",
  },
};

export default function SectionHeader({
  badgeIcon: Icon,
  badgeText,
  badgeVariant = "purple",
  title,
  subtitle,
  centered = true,
  className = "",
}: SectionHeaderProps) {
  const style = variantStyles[badgeVariant];

  return (
    <div className={`relative min-w-0 space-y-4 ${centered ? "mx-auto max-w-4xl text-center" : "text-left"} ${className}`}>
      {/* Ambient Section Glow (Atmospheric soft halo) */}
      <div
        className={`pointer-events-none absolute -top-14 left-1/2 -translate-x-1/2 w-[340px] h-[180px] sm:w-[540px] sm:h-[220px] rounded-full bg-gradient-to-b ${style.ambientGlow} blur-[100px] sm:blur-[120px] -z-10 opacity-70`}
        aria-hidden="true"
      />

      {/* Badge Pill */}
      <div className="inline-flex max-w-full">
        <div
          className={`relative inline-flex max-w-full min-w-0 items-center justify-center gap-2 rounded-full border px-3 py-2 text-center backdrop-blur-xl sm:px-4 ${style.bg} ${style.border} ${style.glow}`}
        >
          {/* Icon if provided */}
          {Icon && <Icon className={`h-3.5 w-3.5 shrink-0 ${style.text}`} />}

          {/* Badge Label */}
          <span className={`min-w-0 text-[10px] sm:text-xs font-bold leading-relaxed tracking-[0.12em] sm:tracking-widest uppercase break-words ${style.text}`}>
            {badgeText}
          </span>
        </div>
      </div>

      {/* Main Section Title */}
      <h2 className="break-words text-3xl font-extrabold leading-tight tracking-[-0.035em] text-white [overflow-wrap:anywhere] sm:text-4xl lg:text-5xl">
        {title}
      </h2>

      {/* Subtitle / Description */}
      {subtitle && (
        <p className="mx-auto max-w-3xl break-words text-sm font-normal leading-7 text-slate-300 sm:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}
