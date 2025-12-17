import { useEffect } from "react";

export function useAnimateOnScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.classList.add("animate-in");
            el.classList.remove("animate-out");
          } else {
            // optional: remove to re-trigger when scrolled back
            el.classList.remove("animate-in");
            el.classList.add("animate-out");
          }
        });
      },
      { threshold: 0.12 },
    );

    const els = Array.from(document.querySelectorAll(".animate-on-scroll"));
    els.forEach((el) => {
      // initial state classes
      el.classList.add("opacity-0", "translate-y-6");
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
}
