declare global {
  interface Window {
    __lenis?: {
      stop: () => void;
      start: () => void;
      scrollTo?: (
        target: HTMLElement | string | number,
        options?: { offset?: number; duration?: number; immediate?: boolean }
      ) => void;
    };
  }
}

type OriginalDocumentStyles = {
  rootOverflow: string;
  bodyOverflow: string;
  bodyPaddingRight: string;
  compensatedElements: Array<{ element: HTMLElement; originalPaddingRight: string }>;
};

let activeLocks = 0;
let originalStyles: OriginalDocumentStyles | null = null;

export function lockDocumentScroll(): () => void {
  if (typeof document === "undefined") return () => undefined;

  if (activeLocks === 0) {
    if (window.__lenis?.stop) {
      window.__lenis.stop();
    }

    const rootElement = document.documentElement;
    const bodyElement = document.body;
    const scrollbarWidth = Math.max(0, window.innerWidth - rootElement.clientWidth);

    rootElement.style.setProperty("--scrollbar-width", `${scrollbarWidth}px`);

    const compensatedElements: Array<{ element: HTMLElement; originalPaddingRight: string }> = [];
    const elementsToCompensate = document.querySelectorAll<HTMLElement>("[data-scroll-lock-compensate]");

    elementsToCompensate.forEach((el) => {
      compensatedElements.push({
        element: el,
        originalPaddingRight: el.style.paddingRight,
      });
      if (scrollbarWidth > 0) {
        const currentPadding = Number.parseFloat(getComputedStyle(el).paddingRight) || 0;
        el.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
      }
    });

    originalStyles = {
      rootOverflow: rootElement.style.overflow,
      bodyOverflow: bodyElement.style.overflow,
      bodyPaddingRight: bodyElement.style.paddingRight,
      compensatedElements,
    };

    rootElement.style.overflow = "hidden";
    bodyElement.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      const currentPadding = Number.parseFloat(getComputedStyle(bodyElement).paddingRight) || 0;
      bodyElement.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }
  }

  activeLocks += 1;
  let released = false;

  return () => {
    if (released) return;
    released = true;
    activeLocks = Math.max(0, activeLocks - 1);

    if (activeLocks !== 0 || !originalStyles) return;

    document.documentElement.style.overflow = originalStyles.rootOverflow;
    document.body.style.overflow = originalStyles.bodyOverflow;
    document.body.style.paddingRight = originalStyles.bodyPaddingRight;
    document.documentElement.style.removeProperty("--scrollbar-width");

    originalStyles.compensatedElements.forEach(({ element, originalPaddingRight }) => {
      element.style.paddingRight = originalPaddingRight;
    });

    originalStyles = null;

    if (window.__lenis?.start) {
      window.__lenis.start();
    }
  };
}


