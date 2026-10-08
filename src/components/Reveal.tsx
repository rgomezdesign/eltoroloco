"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Reveals [data-reveal] as it scrolls in; content stays visible without JS
export default function Reveal() {
  const path = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const els = [...document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-in])")];
    const fold = window.innerHeight * 0.92;
    for (const el of els) if (el.getBoundingClientRect().top < fold) el.dataset.in = "";
    document.documentElement.classList.add("js-reveal");
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { (e.target as HTMLElement).dataset.in = ""; io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    for (const el of els) if (!("in" in el.dataset)) io.observe(el);
    return () => io.disconnect();
  }, [path]);
  return null;
}
