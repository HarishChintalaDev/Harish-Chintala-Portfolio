"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Mail, Linkedin, Github, Menu, Search, X } from "lucide-react";
import { PERSONAL_INFO, NAV_LINKS } from "@/data";
import { useActiveSection } from "@/hooks";
import SocialIconButton from "@/components/ui/SocialIconButton";
import { lockDocumentScroll } from "@/lib/documentScrollLock";

interface NavbarProps {
  onOpenCommandPalette?: () => void;
}

const SECTION_IDS = NAV_LINKS.map((link) => link.id);

export default function Navbar({
  onOpenCommandPalette,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const activeSection = useActiveSection(SECTION_IDS, "home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const releaseScrollLock = lockDocumentScroll();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileMenuOpen(false);
        requestAnimationFrame(() => mobileMenuButtonRef.current?.focus());
        return;
      }

      if (event.key === "Tab" && mobileMenuRef.current && mobileMenuButtonRef.current) {
        const menuControls = Array.from(
          mobileMenuRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
        ).filter((element) => element.getClientRects().length > 0);
        const focusableElements = [mobileMenuButtonRef.current, ...menuControls];
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement as HTMLElement | null;
        const focusIsOutsideMenu = !activeElement || !focusableElements.includes(activeElement);

        if (event.shiftKey && (activeElement === firstElement || focusIsOutsideMenu)) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && (activeElement === lastElement || focusIsOutsideMenu)) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    desktopQuery.addEventListener("change", handleDesktopChange);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      desktopQuery.removeEventListener("change", handleDesktopChange);
      releaseScrollLock();
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        data-scroll-lock-compensate
        className="fixed left-0 right-0 top-0 z-40 isolate px-4 py-4 transition-all duration-300 sm:px-6 lg:px-8"
      >

      <div
        className={`relative z-20 max-w-7xl mx-auto rounded-2xl transition-all duration-300 px-3 sm:px-5 py-3 flex items-center justify-between gap-2 lg:gap-3 glass-nav shadow-2xl border border-white/15 ${
          scrolled ? "bg-[#050816]/95 border-cyan-400/30 shadow-cyan-500/10" : "bg-[#050816]/85"
        }`}
      >
        {/* Left Side: Brand Name */}
        <a href="#home" suppressHydrationWarning className="flex min-w-0 flex-col text-left group rounded-lg shrink-0">
          <span suppressHydrationWarning className="flex items-center gap-1.5 text-base font-extrabold tracking-tight text-white sm:text-lg">
            <span suppressHydrationWarning>Harish</span>
            <span suppressHydrationWarning className="text-gradient-primary">Chintala</span>
          </span>
        </a>

        {/* Center Navigation Links */}
        <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 2xl:gap-2">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id || (link.name === "Home" && activeSection === "home");

            return (
              <a
                key={link.id}
                href={link.href}
                aria-current={isActive ? "location" : undefined}
                className={`relative px-2 xl:px-3.5 py-1.5 text-[11px] xl:text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                  isActive ? "text-white font-bold" : "text-slate-300 hover:text-white"
                }`}
              >
                <span>{link.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavLine"
                    transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
                    className="absolute bottom-0 left-2 right-2 xl:left-3 xl:right-3 h-[2px] bg-gradient-to-r from-sky-400 to-cyan-300 rounded-full shadow-[0_0_10px_#00E5FF]"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Side: Action Chips, Resume CTA & Theme Switcher */}
        <div className="hidden lg:flex items-center gap-1.5 xl:gap-3">
          {/* Search Button */}
          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="command-palette-trigger ui-pressable ui-glass-surface w-8 h-8 xl:w-9 xl:h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-slate-200 hover:text-cyan-300 hover:border-cyan-400/60 hover:bg-cyan-500/15 transition-all duration-150 ease-out hover:scale-110 hover:-translate-y-0.5 active:scale-95 transform-gpu"
              title="Open command palette"
              aria-label="Open command palette"
            >
              <Search className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
            </button>
          )}
          <SocialIconButton
            href={`mailto:${PERSONAL_INFO.email}`}
            icon={Mail}
            label="Email Harish"
            brand="gmail"
            size="sm"
          />
          <SocialIconButton
            href={PERSONAL_INFO.linkedin}
            icon={Linkedin}
            label="LinkedIn Profile"
            brand="linkedin"
            size="sm"
          />
          <SocialIconButton
            href={PERSONAL_INFO.github}
            icon={Github}
            label="GitHub Profile"
            brand="github"
            size="sm"
          />
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            ref={mobileMenuButtonRef}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-menu"
            title={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="ui-pressable ui-glass-surface w-11 h-11 shrink-0 inline-flex items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white hover:border-cyan-400/60 hover:bg-cyan-500/15 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
            className="fixed inset-0 z-10 overflow-hidden bg-[#050816]/75 backdrop-blur-sm lg:hidden"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setMobileMenuOpen(false);
                requestAnimationFrame(() => mobileMenuButtonRef.current?.focus());
              }
            }}
          >
          <motion.nav
            ref={mobileMenuRef}
            id="mobile-navigation-menu"
            aria-label="Mobile navigation"
            initial={shouldReduceMotion ? false : { opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
            className="scroll-surface dark-overlay-surface absolute left-4 right-4 top-[5.75rem] mx-auto max-h-[calc(100dvh-7.5rem)] max-w-7xl overflow-y-auto overscroll-contain rounded-2xl border border-white/20 p-4 shadow-2xl sm:left-6 sm:right-6 lg:left-8 lg:right-8"
          >
            <div className="flex flex-col gap-2">
              {onOpenCommandPalette && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCommandPalette();
                  }}
                  className="ui-pressable ui-glass-surface ui-button-sheen min-h-11 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 text-slate-200 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <span>Open Command Palette</span>
                </button>
              )}
              {NAV_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  aria-current={activeSection === link.id ? "location" : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`ui-pressable min-h-11 px-4 py-2 rounded-xl text-xs font-semibold flex items-center transition-all ${
                    activeSection === link.id
                      ? "text-cyan-300 bg-cyan-500/10"
                      : "text-slate-200 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.name}
                </a>
              ))}

              <div className="pt-3 border-t border-white/10 flex flex-col min-[360px]:flex-row min-[360px]:items-center justify-between gap-3 px-2">
                <div className="flex items-center justify-center gap-2.5">
                  <a
                    href={`mailto:${PERSONAL_INFO.email}`}
                    aria-label="Email Harish"
                    onClick={() => setMobileMenuOpen(false)}
                    className="ui-pressable ui-glass-surface w-11 h-11 inline-flex items-center justify-center rounded-full bg-white/10 text-rose-400 hover:bg-rose-500/20 transition-all"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                  <a
                    href={PERSONAL_INFO.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open Harish's LinkedIn profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="ui-pressable ui-glass-surface w-11 h-11 inline-flex items-center justify-center rounded-full bg-white/10 text-sky-400 hover:bg-sky-500/20 transition-all"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href={PERSONAL_INFO.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open Harish's GitHub profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="ui-pressable ui-glass-surface w-11 h-11 inline-flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  </>
  );
}
