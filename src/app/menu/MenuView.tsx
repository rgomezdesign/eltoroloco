"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import MenuCard from "@/components/MenuCard";
import MenuRow from "@/components/MenuRow";
import CartLines, { Totals } from "@/components/CartLines";
import { ButtonLink } from "@/components/Button";
import { CATEGORIES, ITEMS, money, type CategoryId } from "@/lib/menu";
import { useCart } from "@/lib/cart";

// Mirrors Figma "Desktop · Menu" / "Mobile · Menu": sticky category tabs that follow the scroll,
// a live cart on desktop and a sticky cart bar on mobile.
export default function MenuView() {
  const [active, setActive] = useState<CategoryId>(CATEGORIES[0].id);
  const lock = useRef(0);
  const tabsRef = useRef<HTMLDivElement>(null);
  const cart = useCart();

  useEffect(() => {
    const onScroll = () => {
      if (performance.now() < lock.current) return;
      const line = 180;
      let cur: CategoryId = CATEGORIES[0].id;
      for (const c of CATEGORIES) {
        const el = document.getElementById(c.id);
        if (el && el.getBoundingClientRect().top <= line) cur = c.id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  // Keep the active tab visible in the scrolling tab bar (mobile)
  useEffect(() => {
    tabsRef.current?.querySelector<HTMLElement>(`[data-tab="${active}"]`)?.scrollIntoView({ inline: "nearest", block: "nearest" });
  }, [active]);

  const go = (id: CategoryId) => {
    setActive(id);
    lock.current = performance.now() + 900;
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 150, behavior: "smooth" });
  };

  return (
    <>
      <div className="mx-auto max-w-[1440px] px-5 pt-28 lg:px-16 lg:pt-36">
        <p className="rise t-overline text-accent">Order for pickup</p>
        <h1 className="rise t-display-xl mt-3" style={{ ["--i" as string]: 1 }}>Menu</h1>
      </div>

      <div className="sticky top-[60px] z-30 mt-6 border-b border-line bg-page/90 backdrop-blur-md lg:top-[72px]">
        <div ref={tabsRef} className="mx-auto flex max-w-[1440px] gap-7 overflow-x-auto px-5 [scrollbar-width:none] lg:gap-8 lg:px-16" role="tablist" aria-label="Menu categories">
          {CATEGORIES.map((c) => {
            const on = c.id === active;
            return (
              <button key={c.id} data-tab={c.id} role="tab" aria-selected={on} onClick={() => go(c.id)} className={`relative shrink-0 py-4 text-sm font-semibold transition-colors ${on ? "text-fg" : "text-fg3 hover:text-fg2"}`}>
                {c.label}
                <span className={`absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-accent transition-transform duration-300 ${on ? "scale-x-100" : "scale-x-0"}`} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 pb-32 pt-10 lg:grid-cols-[1fr_360px] lg:px-16 lg:pb-28">
        <div className="space-y-16">
          {CATEGORIES.map((c) => {
            const items = ITEMS.filter((i) => i.category === c.id);
            const withPhotos = items.filter((i) => i.photo);
            const rows = items.filter((i) => !i.photo);
            return (
              <section key={c.id} id={c.id} aria-labelledby={`${c.id}-h`} className="scroll-mt-40">
                <h2 id={`${c.id}-h`} className="t-heading-m">{c.label}</h2>
                {c.blurb && <p className="mt-1 text-sm text-fg3">{c.blurb}</p>}
                {withPhotos.length > 0 && (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
                    {withPhotos.map((it, i) => <MenuCard key={it.id} item={it} i={i} priority={c.id === "appetizers" && i < 3} />)}
                  </div>
                )}
                {rows.length > 0 && <div className="mt-2">{rows.map((it) => <MenuRow key={it.id} item={it} />)}</div>}
              </section>
            );
          })}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-40 rounded-[20px] bg-surface p-6">
            <h2 className="t-heading-m">Your order</h2>
            {cart.ready && cart.count > 0 ? (
              <>
                <div className="mt-2"><CartLines compact /></div>
                <div className="mt-4"><Totals /></div>
                <ButtonLink href="/checkout/" className="mt-5 w-full">Checkout · {money(cart.total)}</ButtonLink>
              </>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-fg3">Your cart is empty. Tap <span className="font-bold text-accent">+</span> on anything that looks good.</p>
            )}
          </div>
        </aside>
      </div>

      {cart.ready && cart.count > 0 && (
        <Link href="/cart/" className="fixed inset-x-5 bottom-5 z-30 flex min-h-14 items-center justify-between rounded-full bg-accent px-6 font-semibold text-on-accent shadow-[0_16px_40px_-8px_rgba(0,0,0,0.7)] lg:hidden" style={{ animation: "sheet-up 450ms var(--ease-spring) both" }}>
          <span className="text-sm">View cart · {cart.count} item{cart.count === 1 ? "" : "s"}</span>
          <span className="t-price">{money(cart.total)}</span>
        </Link>
      )}
    </>
  );
}
