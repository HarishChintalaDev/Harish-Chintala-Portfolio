"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Download, ExternalLink, FileText, Mail, Unlock, X } from "lucide-react";
import { lockDocumentScroll } from "@/lib/documentScrollLock";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  submittedName?: string;
  showEmailFallback?: boolean;
  fallbackEmailHref?: string;
  onDownloadResume?: () => void;
}

export default function ResumeModal({
  isOpen,
  onClose,
  submittedName = "",
  showEmailFallback = false,
  fallbackEmailHref = "",
  onDownloadResume,
}: ResumeModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const releaseScrollLock = lockDocumentScroll();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      releaseScrollLock();
    };
  }, [isOpen, onClose]);

  const handleDownload = () => {
    if (onDownloadResume) {
      onDownloadResume();
      return;
    }
    try {
      const link = document.createElement("a");
      link.href = "/Harish_Chintala_Resume.pdf";
      link.download = "Harish_Chintala_Resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.open("/Harish_Chintala_Resume.pdf", "_blank");
    }

    try {
      import("canvas-confetti").then((module) => {
        const confetti = module.default;
        confetti({
          particleCount: 110,
          spread: 90,
          origin: { y: 0.5 },
        });
      });
    } catch {
      // Ignore confetti fallback
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto overscroll-contain"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="resume-modal-title"
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg max-h-[calc(100dvh-3rem)] overflow-y-auto overscroll-contain scroll-surface rounded-3xl border border-cyan-400/40 bg-[#070B1E]/95 p-6 sm:p-8 shadow-[0_0_80px_rgba(0,229,255,0.25)] focus:outline-none"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 ui-pressable p-2.5 rounded-full text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 border border-transparent hover:border-rose-500/40 hover:shadow-[0_0_15px_rgba(244,63,94,0.35)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
              aria-label="Close resume download modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-6">
              {/* Animated Glow Icon Badge */}
              <div className="relative w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 mx-auto flex items-center justify-center shadow-[0_0_35px_rgba(0,229,255,0.4)]">
                {submittedName ? (
                  <Unlock className="w-8 h-8 text-emerald-300" />
                ) : (
                  <FileText className="w-8 h-8 text-cyan-300" />
                )}
              </div>

              {/* Header Text */}
              <div className="space-y-2">
                <h3 id="resume-modal-title" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {submittedName ? `Thank You, ${submittedName}! 🎉` : "Resume Download & Preview"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  {submittedName
                    ? "Your message was delivered. You can download or view the official PDF resume below."
                    : "Download the complete ATS-friendly PDF or preview it directly in your browser. Available for Senior SDET and Automation Lead roles."}
                </p>
              </div>

              {/* Resume Card Container */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-400/30 space-y-4 shadow-inner">
                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-cyan-300">
                  <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="truncate">Harish Chintala — Senior SDET Resume (PDF)</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="ui-pressable ui-glass-surface flex-1 inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 border border-cyan-300 text-xs sm:text-sm font-bold text-white shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Resume</span>
                  </button>

                  <a
                    href="/Harish_Chintala_Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ui-pressable ui-glass-surface flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-xs sm:text-sm font-semibold text-white hover:bg-white/15 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <span>View Online</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                </div>
              </div>

              {/* Fallback prefilled email draft option */}
              {showEmailFallback && fallbackEmailHref && (
                <a
                  href={fallbackEmailHref}
                  className="ui-pressable inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-sky-500/25 border border-sky-400/50 text-xs sm:text-sm font-semibold text-white hover:bg-sky-500/35 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  <Mail className="w-4 h-4" />
                  <span>Open Prefilled Email Draft</span>
                </a>
              )}

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}