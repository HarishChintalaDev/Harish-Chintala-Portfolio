"use client";

import { useState, useEffect } from "react";

export function useTypewriter(words: string[], typeSpeed = 80, deleteSpeed = 40, delay = 2000, enabled = true) {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!enabled || !words || words.length === 0) return;

    const currentWord = words[wordIndex];
    const speed = isDeleting ? deleteSpeed : typeSpeed;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentWord.substring(0, displayText.length + 1));
        if (displayText === currentWord) {
          setTimeout(() => setIsDeleting(true), delay);
        }
      } else {
        setDisplayText(currentWord.substring(0, displayText.length - 1));
        if (displayText === "") {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [words, wordIndex, displayText, isDeleting, typeSpeed, deleteSpeed, delay, enabled]);

  return enabled ? displayText : words[0] || "";
}
