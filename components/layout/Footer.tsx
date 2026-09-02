"use client";

import { PERSONAL_INFO } from "@/data/portfolioData";
import SectionDivider from "@/components/ui/SectionDivider";

export default function Footer() {
  return (
    <footer className="relative z-10 bg-transparent py-12 px-6 sm:px-12 text-center">
      <SectionDivider variant="purple" />
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center space-y-4 mt-6">
        {/* Centered Copyright Text */}
        <p className="text-xs font-mono text-slate-400">
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {PERSONAL_INFO.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
