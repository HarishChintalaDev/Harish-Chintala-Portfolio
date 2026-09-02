"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

export default function TiltCard({ children, className = "" }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const [canTilt, setCanTilt] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  useEffect(() => {
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateTiltCapability = () => {
      const enabled = hoverQuery.matches && !shouldReduceMotion;
      setCanTilt(enabled);
      if (!enabled) {
        x.set(0);
        y.set(0);
      }
    };

    updateTiltCapability();
    hoverQuery.addEventListener("change", updateTiltCapability);
    return () => hoverQuery.removeEventListener("change", updateTiltCapability);
  }, [shouldReduceMotion, x, y]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={canTilt ? handleMouseMove : undefined}
      onMouseLeave={handleMouseLeave}
      style={canTilt ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
      className={`relative transition-all duration-200 ease-out ${className}`}
    >
      <div style={canTilt ? { transform: "translateZ(20px)" } : undefined} className="h-full">
        {children}
      </div>
    </motion.div>
  );
}
