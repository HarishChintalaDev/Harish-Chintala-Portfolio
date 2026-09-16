"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Award as AwardIcon, Download, ExternalLink, Trophy, X, ZoomIn } from "lucide-react";
import { lockDocumentScroll } from "@/lib/documentScrollLock";
import { Award } from "@/types";

interface AwardModalProps {
  isOpen: boolean;
  onClose: () => void;
  award: Award | null;
}

export default function AwardModal({ isOpen, onClose, award }: AwardModalProps) {
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

  if (!mounted || !award) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-hidden"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="award-modal-title"
            data-lenis-prevent
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl max-h-[94vh] flex flex-col rounded-3xl border border-amber-400/30 bg-[#070B1E]/95 shadow-[0_0_80px_rgba(245,158,11,0.25)] overflow-hidden focus:outline-none"
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between gap-4 p-5 sm:p-6 border-b border-white/10 bg-slate-900/60 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                  <Trophy className="w-5 h-5 text-amber-300" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <h3 id="award-modal-title" className="text-lg sm:text-xl font-bold text-white truncate">
                    {award.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                    <span className="font-semibold text-slate-200">{award.organization}</span>
                    <span>•</span>
                    <span className="text-slate-400">{award.year}</span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="ui-pressable p-2 rounded-full text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 border border-transparent hover:border-rose-500/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 shrink-0"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Image Viewer Container */}
            <div className="relative flex-1 min-h-[350px] sm:min-h-[480px] bg-slate-950/80 p-3 sm:p-6 flex items-center justify-center overflow-auto">
              {award.imageUrl ? (
                <div className="relative max-h-full flex items-center justify-center p-1 sm:p-2 w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={award.imageUrl}
                    alt={`Certificate for ${award.title}`}
                    className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-white/15"
                  />
                </div>
              ) : (
                <div className="text-center space-y-4 p-6 max-w-md my-auto">
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mx-auto">
                    <AwardIcon className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-white">{award.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {award.description}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Action Bar */}
            <div className="p-4 sm:p-5 border-t border-white/10 bg-slate-900/80 flex items-center justify-between gap-3 shrink-0">
              <div className="text-xs text-slate-400 hidden sm:block">
                Official Recognition Award • {award.organization}
              </div>

              <div className="flex items-center gap-2 sm:gap-3 ml-auto">
                {award.imageUrl && (
                  <>
                    <a
                      href={award.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ui-pressable inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-semibold text-slate-200 hover:text-white transition-all"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>View Full Image</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                    </a>

                    <a
                      href={award.imageUrl}
                      download
                      className="ui-pressable inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 border border-amber-400 text-xs font-bold text-slate-950 shadow-lg hover:shadow-amber-500/30 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
