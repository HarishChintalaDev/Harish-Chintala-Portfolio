"use client";

import { useState, useEffect } from "react";

export function useActiveSection(sectionIds: string[], defaultSection: string = "home") {
  const [activeSection, setActiveSection] = useState<string>(defaultSection);

  useEffect(() => {
    const handleScroll = () => {
      const viewportPoint = window.innerHeight * 0.35;

      for (const sectionId of sectionIds) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportPoint && rect.bottom >= 100) {
            setActiveSection(sectionId);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds]);

  return activeSection;
}
