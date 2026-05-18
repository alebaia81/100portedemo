"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

interface ScrollToTopProps {
  /**
   * Tailwind class for the bottom offset (e.g. 'bottom-6' or 'bottom-24')
   */
  bottomOffset?: string;
}

export default function ScrollToTop({ bottomOffset = "bottom-6" }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Torna in cima"
      className={`fixed right-6 z-50 p-3 rounded-full border border-border bg-surface/80 backdrop-blur-md text-muted-text hover:text-accent hover:border-accent/50 shadow-xl transition-all duration-300 transform ${bottomOffset} ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <ChevronUp size={24} />
    </button>
  );
}
