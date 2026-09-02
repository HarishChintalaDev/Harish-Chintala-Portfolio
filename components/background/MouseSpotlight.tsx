"use client";

import { useEffect, useRef } from "react";

export default function MouseSpotlight() {
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    let animationFrameId: number | null = null;
    let pointerX = -1000;
    let pointerY = -1000;

    const paintSpotlight = () => {
      animationFrameId = null;
      if (!pointerQuery.matches || !spotlightRef.current) return;
      spotlightRef.current.style.background = `radial-gradient(600px circle at ${pointerX}px ${pointerY}px, rgba(0, 229, 255, 0.08), rgba(56, 189, 248, 0.04) 40%, transparent 80%)`;
    };

    const handleMouseMove = (e: MouseEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      if (animationFrameId === null) {
        animationFrameId = window.requestAnimationFrame(paintSpotlight);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div
      ref={spotlightRef}
      aria-hidden="true"
      suppressHydrationWarning
      className="mouse-spotlight fixed inset-0 pointer-events-none z-10 transition-opacity duration-300"
      style={{
        background: "radial-gradient(650px circle at -1000px -1000px, rgba(79, 140, 255, 0.07), transparent 80%)",
      }}
    />
  );
}
