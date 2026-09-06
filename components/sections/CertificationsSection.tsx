"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { CheckCircle2, Eye, FileText, Image as ImageIcon, ShieldCheck } from "lucide-react";
import { CERTIFICATIONS } from "@/data";
import SectionHeader from "@/components/ui/SectionHeader";
import SectionDivider from "@/components/ui/SectionDivider";
import { Certification } from "@/types";

const CertificateModal = dynamic(() => import("@/components/sections/CertificateModal"), {
  ssr: false,
});

export default function CertificationsSection() {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (cert: Certification) => {
    setSelectedCert(cert);
    setIsModalOpen(true);
  };

  return (
    <section id="certifications" className="relative z-10 scroll-mt-24 bg-transparent px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <SectionDivider variant="emerald" />
      <div className="mx-auto mt-8 sm:mt-10 lg:mt-12 w-full max-w-7xl min-w-0 space-y-8 sm:space-y-10">
      <SectionHeader
        badgeIcon={ShieldCheck}
        badgeText="VERIFIED CREDENTIALS"
        badgeVariant="emerald"
        title={
          <span className="inline-flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-3">
            <span>Certifications &</span>
            <span className="text-gradient-emerald">Credentials</span>
          </span>
        }
        subtitle="Industry-recognized certifications in software testing architecture, cloud platforms, and modern quality practices."
      />

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {CERTIFICATIONS.map((cert) => {
          const fileUrl = cert.fileUrl || cert.credentialUrl || "";
          const isPdf =
            cert.fileType === "pdf" ||
            fileUrl.toLowerCase().endsWith(".pdf") ||
            (!fileUrl.match(/\.(png|jpg|jpeg|webp|gif|svg)$/i) && fileUrl.includes("/certifications/"));
          const fileName = fileUrl ? fileUrl.split("/").pop() : "document.pdf";

          return (
            <article
              key={cert.id}
              className="glass-card flex flex-col justify-between h-full min-w-0 space-y-5 rounded-3xl border border-white/15 p-5 shadow-xl transition-all duration-300 hover:border-emerald-400/50 hover:shadow-[0_8px_30px_rgba(16,185,129,0.14)] sm:p-6"
            >
              <div className="space-y-5">
                {/* Top Left Check Icon Badge & Issue Date */}
                <div className="flex items-center justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <CheckCircle2 className="w-6 h-6 text-emerald-300" />
                  </div>
                  {cert.issueDate && (
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 shrink-0">
                      Issued {cert.issueDate}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">{cert.title}</h3>
                  <div className="text-xs text-slate-300 font-semibold">{cert.issuer}</div>
                </div>

                {/* Certificate File / Image Preview Container */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`View certificate preview for ${cert.title}`}
                  onClick={() => handleOpenModal(cert)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleOpenModal(cert);
                    }
                  }}
                  className="group/file relative rounded-2xl bg-slate-900/90 border border-slate-700/90 hover:border-emerald-400/60 transition-all cursor-pointer overflow-hidden shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  {!isPdf && cert.fileUrl ? (
                    <div className="relative h-44 sm:h-48 w-full bg-slate-950/80 flex items-center justify-center overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cert.fileUrl}
                        alt={`Thumbnail preview for ${cert.title}`}
                        className="w-full h-full object-cover object-center group-hover/file:scale-105 transition-transform duration-300 opacity-90 group-hover/file:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                        <span className="font-mono text-[11px] font-bold text-emerald-300 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-400/30 flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Image Certificate</span>
                        </span>

                        <span className="font-mono text-[11px] font-bold bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 text-slate-200 group-hover/file:text-emerald-300 transition-colors flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-emerald-400" /> Click to Expand
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          {isPdf ? <FileText className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
                          <span>{isPdf ? "PDF Document File" : "Image File"}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 group-hover/file:text-emerald-300 transition-colors flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Click to view
                        </span>
                      </div>

                      <div className="break-all font-mono text-xs font-bold text-slate-200 group-hover/file:text-emerald-300 transition-colors truncate">
                        {fileName}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {cert.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="max-w-full break-words rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-1 font-mono text-xs font-medium text-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* View Certificate Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenModal(cert)}
                  className="ui-pressable group/btn w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-400/40 hover:border-emerald-400/70 text-emerald-300 hover:text-white text-xs font-bold transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span>{isPdf ? "View Certificate PDF" : "View Full Certificate"}</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <CertificateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        certification={selectedCert}
      />
    </div>
  </section>
  );
}
