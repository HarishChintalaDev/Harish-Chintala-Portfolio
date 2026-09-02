"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useReducedMotion } from "framer-motion";

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    const lenis = new Lenis({
      duration: 0.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.15,
      touchMultiplier: 1.5,
      infinite: false,
    });

    window.__lenis = lenis;

    let frameId: number;

    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }

    frameId = requestAnimationFrame(raf);

    // Smooth scroll handling for anchor links (e.g. href="#experience", href="#projects")
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>("a[href^='#']");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const element = document.querySelector(href);
      if (element) {
        e.preventDefault();
        lenis.scrollTo(element as HTMLElement, {
          offset: -85, // Header height offset
          duration: 0.8,
        });
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, [shouldReduceMotion]);

  return <>{children}</>;
}
