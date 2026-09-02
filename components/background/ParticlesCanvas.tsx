"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
  pulseSpeed: number;
  pulseAngle: number;
}

export default function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number | null = null;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles: Particle[] = [];
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    const themeColors = [
      { color: "rgba(56, 189, 248, 0.35)", glow: "rgba(56, 189, 248, 0.1)" },
      { color: "rgba(0, 229, 255, 0.4)", glow: "rgba(0, 229, 255, 0.12)" },
      { color: "rgba(129, 140, 248, 0.3)", glow: "rgba(129, 140, 248, 0.08)" },
      { color: "rgba(168, 85, 247, 0.28)", glow: "rgba(168, 85, 247, 0.08)" },
    ];

    const resetParticles = () => {
      const particleCount = Math.min(Math.floor(width / 16), 75);
      particles = Array.from({ length: particleCount }, () => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const colorObj = themeColors[Math.floor(Math.random() * themeColors.length)];
        return {
          x,
          y,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: Math.random() * 1.3 + 0.6,
          color: colorObj.color,
          glowColor: colorObj.glow,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulseAngle: Math.random() * Math.PI * 2,
        };
      });
    };

    const clearCanvas = () => {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      resetParticles();
    };

    const render = () => {
      animationFrameId = null;
      ctx.clearRect(0, 0, width, height);

      // Update particle physics and draw a calm ambient network.
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Pulse animation
        p1.pulseAngle += p1.pulseSpeed;
        const currentRadius = p1.radius + Math.sin(p1.pulseAngle) * 0.4;

        // Position update
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Screen boundary rebound
        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Draw node aura
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, currentRadius * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = p1.glowColor;
        ctx.fill();

        // Draw node core
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.fill();

        // Inter-particle neural links
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const linkMaxDist = 135;

          if (dist < linkMaxDist) {
            const alpha = (1 - dist / linkMaxDist) * 0.28;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      }

      animationFrameId = window.requestAnimationFrame(render);
    };

    const stopAnimation = () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const startAnimation = () => {
      if (
        reducedMotionQuery.matches ||
        !finePointerQuery.matches ||
        document.hidden ||
        animationFrameId !== null
      ) {
        return;
      }
      animationFrameId = window.requestAnimationFrame(render);
    };

    const handleMotionPreference = () => {
      if (reducedMotionQuery.matches) {
        stopAnimation();
        clearCanvas();
      } else {
        startAnimation();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };

    const handlePointerCapability = () => {
      if (finePointerQuery.matches) {
        startAnimation();
      } else {
        stopAnimation();
        clearCanvas();
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reducedMotionQuery.addEventListener("change", handleMotionPreference);
    finePointerQuery.addEventListener("change", handlePointerCapability);
    startAnimation();

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotionQuery.removeEventListener("change", handleMotionPreference);
      finePointerQuery.removeEventListener("change", handlePointerCapability);
      stopAnimation();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      suppressHydrationWarning
      className="particles-canvas fixed inset-0 h-full w-full pointer-events-none z-0 opacity-40"
    />
  );
}
