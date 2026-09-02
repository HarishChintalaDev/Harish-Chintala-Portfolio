"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, FileText, Mail, Phone, ExternalLink, Code, Trophy, Briefcase, User, X } from "lucide-react";
import { COMMAND_ACTIONS } from "@/data";
import { CommandAction } from "@/types";
import { lockDocumentScroll } from "@/lib/documentScrollLock";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeResultIndex, setActiveResultIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const resultRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const closedWithEscapeRef = useRef(false);

  const filteredActions = COMMAND_ACTIONS.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  const focusResult = useCallback(
    (index: number) => {
      if (filteredActions.length === 0) return;
      const normalizedIndex = (index + filteredActions.length) % filteredActions.length;
      setActiveResultIndex(normalizedIndex);
      requestAnimationFrame(() => resultRefs.current[normalizedIndex]?.focus());
    },
    [filteredActions.length]
  );

  useEffect(() => {
    if (!isOpen) return;

    closedWithEscapeRef.current = false;
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    const releaseScrollLock = lockDocumentScroll();
    requestAnimationFrame(() => inputRef.current?.focus());

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closedWithEscapeRef.current = true;
        onClose();
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusableElements = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((element) => element.getClientRects().length > 0);

        if (focusableElements.length === 0) {
          e.preventDefault();
          dialogRef.current.focus();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement as HTMLElement | null;
        const focusIsOutsideDialog = !activeElement || !dialogRef.current.contains(activeElement);

        if (
          e.shiftKey &&
          (activeElement === firstElement || activeElement === dialogRef.current || focusIsOutsideDialog)
        ) {
          e.preventDefault();
          lastElement.focus();
        } else if (
          !e.shiftKey &&
          (activeElement === lastElement || activeElement === dialogRef.current || focusIsOutsideDialog)
        ) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      releaseScrollLock();
      const previouslyFocused = previouslyFocusedRef.current;
      if (previouslyFocused?.isConnected) {
        const closedWithEscape = closedWithEscapeRef.current;
        requestAnimationFrame(() => {
          if (closedWithEscape) {
            previouslyFocused.dataset.dialogFocusRestored = "true";

            const clearRestoredState = () => {
              delete previouslyFocused.dataset.dialogFocusRestored;
              previouslyFocused.removeEventListener("blur", clearRestoredState);
              previouslyFocused.removeEventListener("pointerleave", clearRestoredState);
              window.removeEventListener("pointermove", clearRestoredState, true);
            };

            previouslyFocused.addEventListener("blur", clearRestoredState);
            previouslyFocused.addEventListener("pointerleave", clearRestoredState);
            window.addEventListener("pointermove", clearRestoredState, {
              capture: true,
              once: true,
            });
          }

          previouslyFocused.focus({ preventScroll: true });
        });
      }
      closedWithEscapeRef.current = false;
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setActiveResultIndex(0);
      resultRefs.current = [];
    }
  }, [isOpen]);

  const renderIcon = (iconName: CommandAction["iconName"]) => {
    switch (iconName) {
      case "User":
        return <User className="w-4 h-4 text-cyan-300" />;
      case "Briefcase":
        return <Briefcase className="w-4 h-4 text-sky-400" />;
      case "Code":
        return <Code className="w-4 h-4 text-purple-400" />;
      case "Trophy":
        return <Trophy className="w-4 h-4 text-amber-400" />;
      case "FileText":
        return <FileText className="w-4 h-4 text-emerald-400" />;
      case "Mail":
        return <Mail className="w-4 h-4 text-sky-400" />;
      case "Phone":
        return <Phone className="w-4 h-4 text-cyan-300" />;
      default:
        return <Code className="w-4 h-4 text-cyan-300" />;
    }
  };

  const handleAction = (item: CommandAction) => {
    onClose();
    if (item.actionType === "scroll" && item.target) {
      const targetId = item.target.replace(/^#/, "");
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          if (window.__lenis?.scrollTo) {
            window.__lenis.scrollTo(element, { offset: -90, duration: 1.2 });
          } else {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
        try {
          window.history.pushState(null, "", `#${targetId}`);
        } catch {
          // Ignore history state fallback
        }

        if (targetId === "send-message" || targetId === "contact") {
          setTimeout(() => {
            document.getElementById("contact-name")?.focus();
          }, 300);
        }
      }, 100);
    } else if (item.actionType === "download") {
      try {
        const link = document.createElement("a");
        link.href = item.target || "/Harish_Chintala_Resume.pdf";
        link.download = "Harish_Chintala_Resume.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch {
        window.open(item.target || "/Harish_Chintala_Resume.pdf", "_blank");
      }
    } else if (item.actionType === "modal") {
      setTimeout(() => {
        const element = document.getElementById("send-message");
        if (element) {
          if (window.__lenis?.scrollTo) {
            window.__lenis.scrollTo(element, { offset: -90, duration: 1.2 });
          } else {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
        setTimeout(() => {
          document.getElementById("contact-name")?.focus();
        }, 300);
      }, 100);
    } else if (item.actionType === "email" && item.target) {
      window.location.href = `mailto:${item.target}`;
    } else if (item.actionType === "phone" && item.target) {
      window.location.href = `tel:${item.target}`;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-hidden overscroll-contain p-4 sm:pt-20 bg-black/75 backdrop-blur-sm will-change-opacity"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closedWithEscapeRef.current = false;
              onClose();
            }
          }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="command-palette-title"
            aria-describedby="command-palette-description"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.97, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -6 }}
            transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="dark-overlay-surface w-full max-w-xl max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-6rem)] rounded-2xl border border-white/20 overflow-hidden shadow-2xl focus:outline-none flex flex-col will-change-transform transform-gpu"
          >
            <h2 id="command-palette-title" className="sr-only">Command palette</h2>
            <p id="command-palette-description" className="sr-only">
              Search and run portfolio navigation and contact actions.
            </p>

            {/* Search Header Input */}
            <div className="shrink-0 flex items-center px-4 border-b border-white/10 py-3.5 gap-3">
              <Search aria-hidden="true" className="w-5 h-5 text-cyan-300 shrink-0" />
              <label htmlFor="command-palette-search" className="sr-only">Search commands</label>
              <input
                ref={inputRef}
                id="command-palette-search"
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveResultIndex(0);
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    focusResult(activeResultIndex);
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    focusResult(filteredActions.length - 1);
                  } else if (event.key === "Enter" && filteredActions.length > 0) {
                    event.preventDefault();
                    handleAction(filteredActions[Math.min(activeResultIndex, filteredActions.length - 1)]);
                  }
                }}
                placeholder="Search sections, case studies, resume, actions..."
                aria-label="Search commands"
                aria-controls="command-palette-results"
                autoComplete="off"
                spellCheck={false}
                className="w-full min-w-0 min-h-11 bg-transparent text-sm text-white placeholder-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md font-medium"
              />
              <button
                type="button"
                onClick={() => {
                  closedWithEscapeRef.current = false;
                  onClose();
                }}
                aria-label="Close command palette"
                className="ui-pressable ui-glass-surface w-11 h-11 shrink-0 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <X aria-hidden="true" className="w-4 h-4" />
              </button>
            </div>

            {/* Results List */}
            <div
              id="command-palette-results"
              role="group"
              aria-label="Command results"
              data-lenis-prevent
              data-lenis-prevent-wheel
              data-lenis-prevent-touch
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              className="scroll-surface min-h-0 flex-1 max-h-80 overflow-y-auto overscroll-contain p-2 space-y-1"
            >
              <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                {filteredActions.length} {filteredActions.length === 1 ? "command" : "commands"} found.
              </div>
              {filteredActions.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-300 font-medium">No actions found for &quot;{query}&quot;</div>
              ) : (
                filteredActions.map((item, index) => (
                  <button
                    key={item.id}
                    ref={(element) => {
                      resultRefs.current[index] = element;
                    }}
                    type="button"
                    onClick={() => handleAction(item)}
                    onFocus={() => setActiveResultIndex(index)}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowDown") {
                        event.preventDefault();
                        focusResult(index + 1);
                      } else if (event.key === "ArrowUp") {
                        event.preventDefault();
                        focusResult(index - 1);
                      } else if (event.key === "Home") {
                        event.preventDefault();
                        focusResult(0);
                      } else if (event.key === "End") {
                        event.preventDefault();
                        focusResult(filteredActions.length - 1);
                      }
                    }}
                    className="ui-pressable w-full min-h-11 flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-white/10 transition-all text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div aria-hidden="true" className="p-2 rounded-lg bg-slate-900 border border-slate-800">{renderIcon(item.iconName)}</div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-300 font-medium break-words">{item.subtitle}</div>
                      </div>
                    </div>
                    <ExternalLink aria-hidden="true" className="w-3.5 h-3.5 shrink-0 text-slate-300 group-hover:text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity" />
                  </button>
                ))
              )}
            </div>

            {/* Footer Shortcuts hint */}
            <div className="shrink-0 px-4 py-2.5 bg-white/[0.02] border-t border-white/10 flex flex-col min-[420px]:flex-row min-[420px]:items-center justify-between gap-1 text-[11px] text-slate-300 font-medium">
              <span className="flex items-center gap-1">
                <Command aria-hidden="true" className="w-3 h-3 text-cyan-300" /> Use arrow keys to navigate
              </span>
              <span>Press Esc to close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
