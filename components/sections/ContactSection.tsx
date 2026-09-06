"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Copy,
  RefreshCw,
  User,
  Building,
  MessageSquare,
  Sparkles,
  Linkedin,
  Github,
  ArrowUpRight,
  Check,
} from "lucide-react";
import { PERSONAL_INFO } from "@/data";
import SectionHeader from "@/components/ui/SectionHeader";
import SectionDivider from "@/components/ui/SectionDivider";

const ResumeModal = dynamic(() => import("./ResumeModal"), {
  ssr: false,
});

type SubmissionStatus = "idle" | "submitting" | "success" | "error" | "fallback";
type DeliveryMode = "server" | "direct" | "email";

interface ContactSectionProps {
  isResumeModalOpen?: boolean;
  onOpenResumeModal?: () => void;
  onCloseResumeModal?: () => void;
}

export default function ContactSection({
  isResumeModalOpen: externalIsOpen,
  onOpenResumeModal,
  onCloseResumeModal,
}: ContactSectionProps = {}) {
  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" });
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>("idle");
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("direct");
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isResumeModalOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsResumeModalOpen = (open: boolean) => {
    if (open) {
      if (onOpenResumeModal) onOpenResumeModal();
      else setInternalIsOpen(true);
    } else {
      if (onCloseResumeModal) onCloseResumeModal();
      else setInternalIsOpen(false);
    }
  };

  const copyResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusRef = useRef<HTMLDivElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const fallbackEmailSubject = formData.company.trim()
    ? `Portfolio opportunity from ${formData.name.trim()} at ${formData.company.trim()}`
    : `Portfolio opportunity from ${formData.name.trim() || "a portfolio visitor"}`;
  const fallbackEmailBody = `Hi Harish,\n\n${formData.message.trim()}\n\nName: ${formData.name.trim()}\nEmail: ${formData.email.trim()}${
    formData.company.trim() ? `\nCompany: ${formData.company.trim()}` : ""
  }`;
  const fallbackEmailHref = `mailto:${PERSONAL_INFO.email}?subject=${encodeURIComponent(
    fallbackEmailSubject
  )}&body=${encodeURIComponent(fallbackEmailBody)}`;

  useEffect(() => {
    return () => {
      if (copyResetTimerRef.current) clearTimeout(copyResetTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const checkDeliveryMode = async () => {
      try {
        const response = await fetch("/api/contact", {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
          signal: controller.signal,
        });
        const payload = (await response.json()) as {
          secureDeliveryAvailable?: boolean;
          serverDeliveryAvailable?: boolean;
        };
        if (!controller.signal.aborted) {
          if (response.ok && payload.serverDeliveryAvailable) {
            setDeliveryMode("server");
          } else {
            setDeliveryMode("direct");
          }
        }
      } catch {
        if (!controller.signal.aborted) setDeliveryMode("direct");
      }
    };

    void checkDeliveryMode();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (
      submissionStatus === "success" ||
      submissionStatus === "error" ||
      submissionStatus === "fallback"
    ) {
      requestAnimationFrame(() => statusRef.current?.focus());
    }
  }, [submissionStatus]);

  const handleCopyText = async (text: string, fieldKey: string) => {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldKey);
    } catch {
      setCopiedField(`error-${fieldKey}`);
    }

    if (copyResetTimerRef.current) clearTimeout(copyResetTimerRef.current);
    copyResetTimerRef.current = setTimeout(() => setCopiedField(null), 2500);
  };

  const handleDownloadResume = () => {
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

    setIsResumeModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submissionStatus === "submitting") return;

    if (deliveryMode === "email") {
      setSubmissionStatus("fallback");
      setSubmissionMessage("");
      window.location.href = fallbackEmailHref;
      return;
    }

    setSubmissionStatus("submitting");
    setSubmissionMessage("");

    const formattedName = formData.name.trim().replace(/\b\w/g, (c) => c.toUpperCase());
    const formattedCompany = formData.company.trim();

    try {
      if (deliveryMode === "server") {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const payload = (await response.json().catch(() => ({}))) as {
          error?: string;
          message?: string;
        };

        if (response.ok) {
          const name = formData.name.trim();
          setSubmittedName(name);
          setSubmissionMessage(payload.message || `Thank you, ${name}! Your message was delivered successfully.`);
          setSubmissionStatus("success");
          setFormData({ name: "", email: "", company: "", message: "" });
          setTouchedEmail(false);
          return;
        }

        // If server delivery returned an error, fall through to direct browser submission
      }

      // Direct client-side delivery via FormSubmit AJAX (clean, zero 503 errors, never blocked by cloud WAF)
      const directRes = await fetch(`https://formsubmit.co/ajax/${PERSONAL_INFO.email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          "Visitor Name": formData.name,
          "Email Address": formData.email,
          "Company / Organization": formData.company || "N/A",
          "Message": formData.message,
          _subject: `📩 New Portfolio Inquiry from ${formattedName}${formattedCompany ? ` (${formattedCompany})` : ""}`,
          _replyto: formData.email,
          _template: "table",
          _captcha: "false",
        }),
      });

      const directData = (await directRes.json().catch(() => ({}))) as {
        success?: boolean | string;
        message?: string;
      };

      if (
        directRes.ok &&
        directData &&
        directData.success !== false &&
        directData.success !== "false"
      ) {
        const name = formData.name.trim();
        setSubmittedName(name);
        setSubmissionMessage(`Thank you, ${name}! Your message was delivered successfully.`);
        setSubmissionStatus("success");
        setFormData({ name: "", email: "", company: "", message: "" });
        setTouchedEmail(false);
        return;
      }

      throw new Error(directData.message || "Direct form submission could not be completed.");
    } catch (error) {
      setDeliveryMode("email");
      setSubmissionMessage(
        error instanceof Error
          ? error.message
          : "The contact service is temporarily busy. Please use direct email to complete."
      );
      setSubmissionStatus("error");
    }
  };

  const showEmailFallback = submissionStatus === "error" || submissionStatus === "fallback";

  return (
    <section id="contact" suppressHydrationWarning className="relative z-10 scroll-mt-24 bg-transparent px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <SectionDivider variant="aurora" />
      <div className="mx-auto mt-8 sm:mt-10 lg:mt-12 w-full max-w-7xl min-w-0 space-y-8 sm:space-y-10">
        <SectionHeader
          badgeIcon={Mail}
          badgeText="DIRECT CONTACT & INQUIRIES"
          badgeVariant="aurora"
          title={
            <span className="inline-flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-3">
              <span>Get in</span>
              <span className="text-gradient-aurora">Touch</span>
            </span>
          }
          subtitle="Available for Senior SDET, Lead Automation Architect, and AI Engineering roles. Send a message below to connect directly."
        />

        {/* Form and Info Grid */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          
          {/* Left Column: Direct Communication Channels & Availability Card */}
          <div className="flex flex-col lg:col-span-5 lg:h-full">
            <div suppressHydrationWarning className="contact-details-card glass-card flex h-full flex-col gap-6 rounded-3xl border border-white/15 bg-[#050816]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              
              {/* Header */}
              <div className="flex flex-col gap-2 min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    <span>Contact Details</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Connect directly through any of the channels below.
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500/15 via-indigo-500/15 to-purple-500/15 border border-sky-400/40 text-sky-200 self-start min-[480px]:self-auto shrink-0 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Direct Contact</span>
                </span>
              </div>

              {/* Contact Cards List */}
              <div className="flex flex-col gap-3 lg:flex-1 lg:justify-between">
                {/* Email Card */}
                <div className="group p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-[#EA4335]/60 hover:bg-[#EA4335]/10 flex items-center justify-between gap-3 transition-all duration-300 shadow-inner">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="p-2.5 rounded-xl bg-[#EA4335]/15 border border-[#EA4335]/40 text-[#EA4335] group-hover:scale-105 transition-transform shrink-0 shadow-[0_0_15px_rgba(234,67,53,0.2)]">
                      <Mail aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10.5px] font-mono text-slate-400 font-semibold uppercase tracking-wider">Email Address</div>
                      <a
                        href={`mailto:${PERSONAL_INFO.email}`}
                        className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#EA4335] transition-colors break-words [overflow-wrap:anywhere] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA4335] rounded-sm"
                      >
                        {PERSONAL_INFO.email}
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText(PERSONAL_INFO.email, "email")}
                    className="ui-pressable ui-glass-surface w-9 h-9 sm:w-10 sm:h-10 shrink-0 inline-flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA4335]"
                    title={copiedField === "email" ? "Email copied!" : "Copy email address"}
                    aria-label={copiedField === "email" ? "Email address copied" : "Copy email address"}
                  >
                    {copiedField === "email" ? (
                      <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy aria-hidden="true" className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Phone & WhatsApp Card */}
                <div className="group p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/10 flex items-center justify-between gap-3 transition-all duration-300 shadow-inner">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 group-hover:scale-105 transition-transform shrink-0">
                      <Phone aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10.5px] font-mono text-slate-400 font-semibold uppercase tracking-wider">Phone & WhatsApp</div>
                      <a
                        href={`tel:${PERSONAL_INFO.phone}`}
                        className="text-xs sm:text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-sm"
                      >
                        {PERSONAL_INFO.phone}
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText(PERSONAL_INFO.phone, "phone")}
                    className="ui-pressable ui-glass-surface w-9 h-9 sm:w-10 sm:h-10 shrink-0 inline-flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                    title={copiedField === "phone" ? "Phone number copied!" : "Copy phone number"}
                    aria-label={copiedField === "phone" ? "Phone number copied" : "Copy phone number"}
                  >
                    {copiedField === "phone" ? (
                      <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy aria-hidden="true" className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* LinkedIn Card */}
                <div className="group p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-sky-400/50 hover:bg-sky-400/10 flex items-center justify-between gap-3 transition-all duration-300 shadow-inner">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="p-2.5 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-300 group-hover:scale-105 transition-transform shrink-0">
                      <Linkedin aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10.5px] font-mono text-slate-400 font-semibold uppercase tracking-wider">LinkedIn Profile</div>
                      <a
                        href={PERSONAL_INFO.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm font-semibold text-white group-hover:text-sky-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-sm flex items-center gap-1.5"
                      >
                        <span>{PERSONAL_INFO.linkedin.replace(/\/$/, "").split("/").pop()}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-300 transition-colors" />
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText(PERSONAL_INFO.linkedin, "linkedin")}
                    className="ui-pressable ui-glass-surface w-9 h-9 sm:w-10 sm:h-10 shrink-0 inline-flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                    title={copiedField === "linkedin" ? "LinkedIn link copied!" : "Copy LinkedIn URL"}
                    aria-label={copiedField === "linkedin" ? "LinkedIn URL copied" : "Copy LinkedIn URL"}
                  >
                    {copiedField === "linkedin" ? (
                      <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy aria-hidden="true" className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* GitHub Card */}
                <div className="group p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-white/40 hover:bg-white/10 flex items-center justify-between gap-3 transition-all duration-300 shadow-inner">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white group-hover:scale-105 transition-all shrink-0">
                      <Github aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10.5px] font-mono text-slate-400 font-semibold uppercase tracking-wider">GitHub Profile</div>
                      <a
                        href={PERSONAL_INFO.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm font-semibold text-white group-hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm flex items-center gap-1.5"
                      >
                        <span>{PERSONAL_INFO.github.replace(/\/$/, "").split("/").pop()}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText(PERSONAL_INFO.github, "github")}
                    className="ui-pressable ui-glass-surface w-9 h-9 sm:w-10 sm:h-10 shrink-0 inline-flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                    title={copiedField === "github" ? "GitHub link copied!" : "Copy GitHub URL"}
                    aria-label={copiedField === "github" ? "GitHub URL copied" : "Copy GitHub URL"}
                  >
                    {copiedField === "github" ? (
                      <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy aria-hidden="true" className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Location Card */}
                <div className="group p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 hover:bg-amber-500/10 flex items-center gap-3.5 transition-all duration-300 shadow-inner">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 group-hover:scale-105 transition-transform shrink-0">
                    <MapPin aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10.5px] font-mono text-slate-400 font-semibold uppercase tracking-wider">Location</div>
                    <div className="text-xs sm:text-sm font-semibold text-white">{PERSONAL_INFO.location}</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: "Share Your Details" Form with Embedded Gated Resume Download */}
          <div
            id="send-message"
            tabIndex={-1}
            role="region"
            aria-label="Share your details form"
            suppressHydrationWarning
            className="contact-form-card glass-card flex h-full scroll-mt-28 flex-col space-y-6 rounded-3xl border border-white/15 bg-[#050816]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:col-span-7"
          >
            {submissionStatus === "success" ? (
              <div
                ref={statusRef}
                tabIndex={-1}
                className="p-6 sm:p-8 text-center space-y-6 my-auto focus:outline-none"
              >
                <div role="status" aria-live="polite" aria-atomic="true" className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                    <CheckCircle2 aria-hidden="true" className="w-9 h-9 text-emerald-300" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white">
                    Thank You{submittedName ? `, ${submittedName}` : ""}! 🎉
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed font-normal">
                    {submissionMessage}
                  </p>
                </div>

                <div className="flex items-center justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmissionStatus("idle");
                      setSubmissionMessage("");
                      setSubmittedName("");
                      requestAnimationFrame(() => nameInputRef.current?.focus());
                    }}
                    className="ui-pressable inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs font-bold text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Send Another Message</span>
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                aria-busy={submissionStatus === "submitting"}
                suppressHydrationWarning
                className="flex flex-col space-y-5"
              >
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    <span>Share Your Details</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Have a role or opportunity? Send your message below.
                  </p>
                </div>

                {/* Form Input Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-name" className="text-xs font-mono text-slate-300 font-semibold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <User aria-hidden="true" className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Your Name</span>
                        <span className="text-cyan-400" aria-hidden="true">*</span>
                      </span>
                    </label>
                    <input
                      ref={nameInputRef}
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      maxLength={100}
                      autoComplete="name"
                      disabled={submissionStatus === "submitting"}
                      value={formData.name}
                      onChange={(e) => setFormData((curr) => ({ ...curr, name: e.target.value }))}
                      placeholder="e.g. Alex Morgan"
                      suppressHydrationWarning
                      className="w-full min-h-11 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all disabled:opacity-60 shadow-inner"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-email" className="text-xs font-mono text-slate-300 font-semibold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Mail aria-hidden="true" className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Your Email</span>
                        <span className="text-cyan-400" aria-hidden="true">*</span>
                      </span>
                      {touchedEmail && formData.email && (
                        <span className={`text-[10.5px] font-sans flex items-center gap-1 ${isValidEmail(formData.email) ? "text-emerald-400" : "text-amber-400"}`}>
                          {isValidEmail(formData.email) ? (
                            <>
                              <Check className="w-3 h-3" /> Valid email
                            </>
                          ) : (
                            "Check format"
                          )}
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        maxLength={254}
                        autoComplete="email"
                        inputMode="email"
                        disabled={submissionStatus === "submitting"}
                        value={formData.email}
                        onBlur={() => setTouchedEmail(true)}
                        onChange={(e) => {
                          setFormData((curr) => ({ ...curr, email: e.target.value }));
                          if (!touchedEmail) setTouchedEmail(true);
                        }}
                        placeholder="e.g. alex@company.com"
                        suppressHydrationWarning
                        className={`w-full min-h-11 px-4 py-2.5 rounded-xl bg-slate-900/90 border text-sm text-white placeholder-slate-500 transition-all disabled:opacity-60 shadow-inner ${
                          touchedEmail && formData.email && !isValidEmail(formData.email)
                            ? "border-amber-500/60 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
                            : "border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Company Input (Optional) */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-company" className="flex items-center justify-between text-xs font-mono text-slate-300 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Building aria-hidden="true" className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Company / Organization</span>
                    </span>
                    <span className="font-sans text-[10px] text-slate-400 font-normal uppercase tracking-wider">Optional</span>
                  </label>
                  <input
                    id="contact-company"
                    name="company"
                    type="text"
                    maxLength={150}
                    autoComplete="organization"
                    disabled={submissionStatus === "submitting"}
                    value={formData.company}
                    onChange={(e) => setFormData((curr) => ({ ...curr, company: e.target.value }))}
                    placeholder="e.g. Delta Air Lines, Amazon, or INTO Global"
                    suppressHydrationWarning
                    className="w-full min-h-11 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all disabled:opacity-60 shadow-inner"
                  />
                </div>

                {/* Quick Message Chips */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="contact-message" className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                      <MessageSquare aria-hidden="true" className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Your Message</span>
                      <span className="text-cyan-400" aria-hidden="true">*</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-400">
                      {formData.message.length}/5000
                    </span>
                  </div>

                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    maxLength={5000}
                    rows={4}
                    disabled={submissionStatus === "submitting"}
                    value={formData.message}
                    onChange={(e) => setFormData((curr) => ({ ...curr, message: e.target.value }))}
                    placeholder="Briefly describe your team's role requirements, automation needs, or project opportunities..."
                    suppressHydrationWarning
                    className="w-full min-h-28 px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all disabled:opacity-60 shadow-inner"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submissionStatus === "submitting"}
                  suppressHydrationWarning
                  className="hero-cta hero-cta-primary group w-full text-sm font-bold disabled:cursor-wait disabled:opacity-60"
                >
                  <span aria-hidden="true" className="hero-cta-sheen" />
                  {submissionStatus === "submitting" ? (
                    <>
                      <span aria-hidden="true" className="hero-cta-icon">
                        <RefreshCw className="h-4 w-4 animate-spin text-cyan-200" />
                      </span>
                      <span className="hero-cta-label">Sending Email...</span>
                    </>
                  ) : (
                    <>
                      <span aria-hidden="true" className="hero-cta-icon">
                        <Send className="h-4 w-4" />
                      </span>
                      <span className="hero-cta-label">Send Email</span>
                      <span aria-hidden="true" className="hero-cta-arrow">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Resume Download Popup Modal */}
      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        submittedName={submittedName}
        showEmailFallback={showEmailFallback}
        fallbackEmailHref={fallbackEmailHref}
        onDownloadResume={handleDownloadResume}
      />
    </section>
  );
}
