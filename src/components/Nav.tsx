"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart";

// Mirrors Figma "Nav" (Viewport = Desktop / Mobile)
export default function Nav({ overlay = false }: { overlay?: boolean }) {
  const { count, ready } = useCart();
  const path = usePathname() ?? "/";
  const [scrolled, setScrolled] = useState(false);
  const [bump, setBump] = useState(false);
  const prev = useRef(count);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  // Cart pill pops when something is added
  useEffect(() => {
    if (ready && count > prev.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 450);
      prev.current = count;
      return () => clearTimeout(t);
    }
    prev.current = count;
  }, [count, ready]);

  const solid = !overlay || scrolled;
  const link = (href: string, label: string) => (
    <Link href={href} className={`text-sm font-semibold transition-colors hover:text-accent ${path.startsWith(href) ? "text-fg" : "text-fg2"}`}>
      {label}
    </Link>
  );
  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter,border-color] duration-300 ${solid ? "border-b border-line/60 bg-page/85 backdrop-blur-md" : "border-b border-transparent"}`}>
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 lg:px-16 lg:py-5">
        <Link href="/" className="font-display text-lg font-extrabold tracking-wide lg:text-[22px]">EL TORO LOCO GRILL</Link>
        <nav className="flex items-center gap-4 lg:gap-8" aria-label="Primary">
          <span className="hidden items-center gap-8 lg:flex">
            {link("/menu/", "Menu")}
            <Link href="/#visit" className="text-sm font-semibold text-fg2 transition-colors hover:text-accent">Visit</Link>
          </span>
          <Link
            href="/cart/"
            className={`inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover ${bump ? "pop" : ""}`}
            aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6 5 3H2"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/></svg>
            Cart{ready && count > 0 ? ` · ${count}` : ""}
          </Link>
          <span className="lg:hidden">{link("/menu/", "Menu")}</span>
        </nav>
      </div>
    </header>
  );
}
