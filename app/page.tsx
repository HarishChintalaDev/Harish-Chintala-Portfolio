"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Navbar, Footer } from "@/components/layout";
import { AuroraBackground, MouseSpotlight } from "@/components/background";
import {
  HeroSection,
  ExperienceSection,
  ProjectsSection,
  SkillsSection,
  AwardsSection,
  CertificationsSection,
  EducationSection,
  ContactSection,
} from "@/components/sections";
import { ScrollToTop, SmoothScrollProvider } from "@/components/ui";

const CommandPalette = dynamic(() => import("@/components/layout/CommandPalette"), {
  ssr: false,
});

const ParticlesCanvas = dynamic(() => import("@/components/background/ParticlesCanvas"), {
  ssr: false,
});

export default function Home() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((isOpen) => {
          if (!isOpen && document.querySelector('[role="dialog"][aria-modal="true"]')) {
            return isOpen;
          }
          return !isOpen;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <SmoothScrollProvider>
      <main
        id="main-content"
        tabIndex={-1}
        className="relative min-h-[100dvh] overflow-x-clip bg-[#050816] text-white selection:bg-[#4F8CFF] selection:text-white transition-colors duration-500 outline-none flex flex-col pb-12 sm:pb-16 lg:pb-20"
      >

      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-xl bg-sky-700 px-4 py-3 text-sm font-bold text-white shadow-xl transition-transform focus:translate-y-0"
      >
        Skip to main content
      </a>

      {/* Visual Canvas Backgrounds */}
      <AuroraBackground />
      <ParticlesCanvas />
      <MouseSpotlight />

      {/* Navigation */}
      <Navbar
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Experience Timeline */}
      <ExperienceSection />

      {/* Featured Case Studies */}
      <ProjectsSection />

      {/* Categorized Skills */}
      <SkillsSection />

      {/* Honors & Awards Section */}
      <AwardsSection />

      {/* Certifications Section */}
      <CertificationsSection />

      {/* Education Section */}
      <EducationSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />

      {/* Floating Back to Top Button */}
      <ScrollToTop />

      {/* Command Palette Overlay */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </main>
  </SmoothScrollProvider>
  );
}


