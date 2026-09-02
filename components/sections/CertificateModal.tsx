"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Download, ExternalLink, FileText, ShieldCheck, X, ZoomIn } from "lucide-react";
import { lockDocumentScroll } from "@/lib/documentScrollLock";
import { Certification } from "@/types";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certification: Certification | null;
}

export default function CertificateModal({
  isOpen,
  onClose,
  certification,
}: CertificateModalProps) {
  const [mounted, setMounted] = useState(false);
  const [fileError, setFileError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setFileError(false);
  }, [certification]);

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

  if (!mounted || !certification) return null;

  const fileUrl = certification.fileUrl || certification.credentialUrl || "";
  const isPdf =
    certification.fileType === "pdf" ||
    fileUrl.toLowerCase().endsWith(".pdf") ||
    (!fileUrl.match(/\.(png|jpg|jpeg|webp|gif|svg)$/i) && fileUrl.includes("/certifications/"));

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
            aria-labelledby="cert-modal-title"
            data-lenis-prevent
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border border-emerald-400/30 bg-[#070B1E]/95 shadow-[0_0_80px_rgba(16,185,129,0.25)] overflow-hidden focus:outline-none"
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between gap-4 p-5 sm:p-6 border-b border-white/10 bg-slate-900/60 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-300" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <h3 id="cert-modal-title" className="text-lg sm:text-xl font-bold text-white truncate">
                    {certification.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                    <span className="text-emerald-400">{certification.issuer}</span>
                    {certification.issueDate && (
                      <>
                        <span>•</span>
                        <span>Issued {certification.issueDate}</span>
                      </>
                    )}
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

            {/* Document / Image Viewer Content Container */}
            <div className="relative flex-1 min-h-[350px] sm:min-h-[480px] bg-slate-950/80 p-2 sm:p-4 flex items-center justify-center overflow-auto">
              {fileError ? (
                <div className="text-center space-y-4 p-6 max-w-md">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mx-auto">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-white">Certificate Document File</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Place your PDF or Image file at <code className="text-emerald-400 font-mono">{fileUrl}</code> inside the <code className="text-emerald-400 font-mono">/public</code> folder to preview it directly here.
                    </p>
                  </div>
                  {certification.credentialUrl && (
                    <a
                      href={certification.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-xs font-bold transition-all"
                    >
                      <span>Open External Credential Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ) : isPdf ? (
                <object
                  data={fileUrl}
                  type="application/pdf"
                  className="w-full h-full min-h-[420px] rounded-xl border border-white/10 shadow-2xl"
                  onError={() => setFileError(true)}
                >
                  <iframe
                    src={fileUrl}
                    className="w-full h-full min-h-[420px] rounded-xl border border-white/10"
                    title={`PDF Certificate for ${certification.title}`}
                    onError={() => setFileError(true)}
                  >
                    <div className="p-6 text-center text-slate-300">
                      <p>Unable to embed PDF preview directly.</p>
                      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline mt-2 inline-block">
                        Download or View PDF File directly
                      </a>
                    </div>
                  </iframe>
                </object>
              ) : (
                /* Image File View */
                <div className="relative max-h-full flex items-center justify-center p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fileUrl}
                    alt={`Certificate for ${certification.title}`}
                    className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-white/15"
                    onError={() => setFileError(true)}
                  />
                </div>
              )}
            </div>

            {/* Footer Action Bar */}
            <div className="p-4 sm:p-5 border-t border-white/10 bg-slate-900/80 flex items-center justify-end gap-3 shrink-0">
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ui-pressable inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-semibold text-slate-200 hover:text-white transition-all"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Open Full Document</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>

              <a
                href={fileUrl}
                download
                className="ui-pressable inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 border border-emerald-400 text-xs font-bold text-white shadow-lg hover:shadow-emerald-500/30 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
