"use client";

import { GraduationCap, CheckCircle } from "lucide-react";
import { EDUCATION } from "@/data";
import SectionHeader from "@/components/ui/SectionHeader";
import SectionDivider from "@/components/ui/SectionDivider";

export default function EducationSection() {
  return (
    <section id="education" className="relative z-10 scroll-mt-24 bg-transparent px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <SectionDivider variant="blue" />
      <div className="mx-auto mt-8 sm:mt-10 lg:mt-12 w-full max-w-7xl min-w-0 space-y-8 sm:space-y-10">
      <SectionHeader
        badgeIcon={GraduationCap}
        badgeText="ACADEMIC FOUNDATION"
        badgeVariant="blue"
        title={
          <span className="inline-flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-3">
            <span>Education &</span>
            <span className="text-gradient-blue">Engineering Foundation</span>
          </span>
        }
        subtitle="Bachelor of Technology in Mechanical Engineering with a strong foundation in quality inspection and system analysis."
      />

      {/* Main Content Card */}
      <div className="glass-card min-w-0 space-y-6 rounded-3xl border border-white/15 p-5 shadow-2xl transition-all duration-300 hover:border-sky-400/50 hover:shadow-[0_8px_30px_rgba(59,130,246,0.14)] sm:p-8">
        <div className="flex flex-col items-start gap-4 min-[480px]:flex-row min-[480px]:items-center">
          <div className="shrink-0 rounded-2xl bg-gradient-to-br from-sky-700 via-indigo-700 to-purple-700 p-3.5 text-white shadow-lg shadow-sky-500/20">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div className="min-w-0">
            <h3 className="break-words text-xl font-bold text-white">{EDUCATION.degree}</h3>
            <div className="text-sm text-cyan-300 font-semibold mt-0.5">
              {EDUCATION.institution} • {EDUCATION.location}
            </div>
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-200 shadow-inner sm:p-5 sm:text-sm">
          <div className="font-bold text-white">Research & Capstone Project:</div>
          <p className="leading-relaxed font-normal">{EDUCATION.project}</p>
          <div className="flex items-start gap-2 pt-2 text-xs font-bold text-emerald-400 sm:text-sm">
            <CheckCircle className="w-4.5 h-4.5 shrink-0 text-emerald-400" />
            <span>{EDUCATION.achievement}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);
}
