"use client";

import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export type BadgeVariant = "purple" | "cyan" | "blue" | "emerald" | "amber";

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
  }
> = {
  purple: {
    border: "border-purple-400/40 group-hover:border-purple-300/70",
    bg: "bg-purple-500/15 hover:bg-purple-500/25",
    text: "text-purple-300",
    dotBg: "bg-purple-400",
    glow: "shadow-[0_0_15px_rgba(168,85,247,0.3)]",
  },
  cyan: {
    border: "border-cyan-400/40 group-hover:border-cyan-300/70",
    bg: "bg-cyan-500/15 hover:bg-cyan-500/25",
    text: "text-cyan-300",
    dotBg: "bg-cyan-400",
    glow: "shadow-[0_0_15px_rgba(56,189,248,0.3)]",
  },
  blue: {
    border: "border-sky-400/40 group-hover:border-sky-300/70",
    bg: "bg-sky-500/15 hover:bg-sky-500/25",
    text: "text-sky-300",
    dotBg: "bg-sky-400",
    glow: "shadow-[0_0_15px_rgba(56,189,248,0.3)]",
  },
  emerald: {
    border: "border-emerald-400/40 group-hover:border-emerald-300/70",
    bg: "bg-emerald-500/15 hover:bg-emerald-500/25",
    text: "text-emerald-300",
    dotBg: "bg-emerald-400",
    glow: "shadow-[0_0_15px_rgba(16,185,129,0.3)]",
  },
  amber: {
    border: "border-amber-400/40 group-hover:border-amber-300/70",
    bg: "bg-amber-500/15 hover:bg-amber-500/25",
    text: "text-amber-300",
    dotBg: "bg-amber-400",
    glow: "shadow-[0_0_15px_rgba(245,158,11,0.3)]",
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
    <div className={`min-w-0 space-y-4 ${centered ? "mx-auto max-w-4xl text-center" : "text-left"} ${className}`}>
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
