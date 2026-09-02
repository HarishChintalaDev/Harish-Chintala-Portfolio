"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function AuroraBackground() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Background Mesh Gradients */}
      <motion.div
        animate={shouldReduceMotion ? undefined : {
          scale: [1, 1.15, 1],
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={shouldReduceMotion ? undefined : {
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="glow-blob glow-blob-blue w-[120vw] min-w-[320px] max-w-[600px] aspect-square -top-40 -left-40"
      />

      <motion.div
        animate={shouldReduceMotion ? undefined : {
          scale: [1, 1.2, 1],
          x: [0, -50, 0],
          y: [0, 40, 0],
        }}
        transition={shouldReduceMotion ? undefined : {
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="glow-blob glow-blob-purple w-[135vw] min-w-[360px] max-w-[700px] aspect-square top-[30%] -right-40"
      />

      <motion.div
        animate={shouldReduceMotion ? undefined : {
          scale: [1, 1.1, 1],
          x: [0, 30, 0],
          y: [0, 50, 0],
        }}
        transition={shouldReduceMotion ? undefined : {
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="glow-blob glow-blob-cyan w-[110vw] min-w-[300px] max-w-[550px] aspect-square bottom-10 left-[20%]"
      />
    </div>
  );
}
