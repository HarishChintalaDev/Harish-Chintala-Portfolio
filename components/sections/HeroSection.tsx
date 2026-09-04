"use client";

import Image from "next/image";
import {
  ArrowRight,
  FileText,
  FolderOpen,
  MessageSquare,
} from "lucide-react";
import { PERSONAL_INFO } from "@/data";
import { useTypewriter } from "@/hooks";
interface HeroSectionProps {
  onOpenResume?: () => void;
}

export default function HeroSection({ onOpenResume }: HeroSectionProps = {}) {
  const animatedRole = useTypewriter(PERSONAL_INFO.heroRoles, 70, 35, 2000);

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative z-10 flex items-center px-4 pb-6 pt-24 sm:px-6 sm:pb-8 sm:pt-28 lg:px-8 xl:min-h-[680px] xl:pb-10 xl:pt-28"
    >
      <div className="mx-auto grid w-full max-w-7xl min-w-0 grid-cols-1 items-center gap-12 xl:grid-cols-12 xl:gap-16">
        <div className="min-w-0 space-y-6 text-left sm:space-y-7 xl:col-span-7">
          <div className="min-w-0 space-y-4">
            <h1
              id="hero-title"
              className="break-words text-4xl font-bold leading-[1.08] tracking-[-0.03em] bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent min-[420px]:text-5xl sm:text-6xl lg:text-[3.75rem]"
            >
              {PERSONAL_INFO.name}
            </h1>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300 sm:text-sm min-h-[28px] flex items-center gap-1.5">
              <span>{animatedRole}</span>
              <span aria-hidden="true" className="inline-block w-2 h-4 bg-cyan-400 animate-pulse rounded-xs shadow-[0_0_8px_#00E5FF]" />
            </p>
          </div>

          <p className="max-w-2xl text-sm font-normal leading-7 text-slate-300 sm:text-base">
            {PERSONAL_INFO.summary}
          </p>

          <div className="flex w-full flex-col gap-2.5 sm:gap-3 pt-2 sm:flex-row sm:items-center sm:flex-nowrap">
            <a
              href="#contact"
              aria-label="Go to the contact form"
              className="hero-cta hero-cta-primary group w-full sm:w-auto shrink-0"
            >
              <span aria-hidden="true" className="hero-cta-sheen" />
              <span aria-hidden="true" className="hero-cta-icon">
                <MessageSquare className="h-4 w-4" />
              </span>
              <span className="hero-cta-label">Get in touch</span>
              <span aria-hidden="true" className="hero-cta-arrow">
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>

            <a
              href="#projects"
              aria-label="View project case studies"
              className="hero-cta hero-cta-secondary group w-full sm:w-auto shrink-0"
            >
              <span aria-hidden="true" className="hero-cta-sheen" />
              <span aria-hidden="true" className="hero-cta-icon">
                <FolderOpen className="h-4 w-4" />
              </span>
              <span className="hero-cta-label">View case studies</span>
              <span aria-hidden="true" className="hero-cta-arrow">
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>

            <a
              href="/Harish_Chintala_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Resume"
              onClick={(e) => {
                if (onOpenResume) {
                  e.preventDefault();
                  onOpenResume();
                }
              }}
              className="hero-cta hero-cta-resume group w-full sm:w-auto shrink-0 cursor-pointer"
            >
              <span aria-hidden="true" className="hero-cta-sheen" />
              <span aria-hidden="true" className="hero-cta-icon">
                <FileText className="h-4 w-4" />
              </span>
              <span className="hero-cta-label">View Resume</span>
              <span aria-hidden="true" className="hero-cta-arrow">
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>
          </div>
        </div>

        <aside className="mx-auto w-full max-w-md min-w-0 xl:col-span-5 xl:max-w-none" aria-label="Professional profile summary">
          <div className="glass-card relative overflow-hidden rounded-[2.25rem] border border-white/15 p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] bg-[#070B1E]/95 group transition-all duration-500 hover:border-cyan-400/50">
            <div aria-hidden="true" className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Profile Card Header */}
            <div className="text-xs font-mono font-bold uppercase tracking-[0.24em] text-slate-400 mb-6">
              PROFILE
            </div>

            {/* Centered Profile Picture */}
            <div className="flex flex-col items-center justify-center mb-7">
              <div className="relative h-44 w-44 sm:h-48 sm:w-48 shrink-0 overflow-hidden rounded-[2rem] border border-cyan-400/35 bg-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group">
                <Image
                  src="/profile.webp"
                  alt={`${PERSONAL_INFO.name}, Senior SDET and Automation Architect`}
                  fill
                  priority
                  sizes="(max-width: 639px) 176px, 192px"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Cards for Core Focus & Availability matching design image */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/12 bg-[#0C122C]/90 p-4.5 sm:p-5 shadow-lg space-y-1.5 transition-all hover:border-cyan-400/40">
                <div className="font-mono text-[10.5px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  CORE FOCUS
                </div>
                <div className="text-sm font-bold leading-snug text-white tracking-tight">
                  {PERSONAL_INFO.coreFocus}
                </div>
              </div>

              <div className="rounded-2xl border border-white/12 bg-[#0C122C]/90 p-4.5 sm:p-5 shadow-lg space-y-1.5 transition-all hover:border-cyan-400/40">
                <div className="font-mono text-[10.5px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  OPEN TO
                </div>
                <div className="text-sm font-bold leading-snug text-white tracking-tight">
                  {PERSONAL_INFO.availability}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
