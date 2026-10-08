"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Footer, { REAL_SITE } from "@/components/Footer";
import { ButtonLink } from "@/components/Button";
import { money } from "@/lib/menu";

type Order = { no: string; name: string; pickup: string; lines: { name: string; qty: number; price: number }[]; total: number };

// Mirrors Figma "Mobile · Confirmation"
export default function Confirmation() {
  const [order, setOrder] = useState<Order | null>(null);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("etl-last-order");
      if (raw) setOrder(JSON.parse(raw));
    } catch {}
  }, []);
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[560px] px-5 pb-24 pt-32 text-center lg:pt-40">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-success/15" style={{ animation: "rise 600ms var(--ease-spring) both" }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--color-status-success)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" strokeDasharray="60" style={{ animation: "draw 700ms 250ms var(--ease-out) both" }} />
          </svg>
        </div>
        <h1 className="t-display-l rise mt-6" style={{ ["--i" as string]: 2 }}>Order received</h1>
        <p className="rise mt-3 text-fg2" style={{ ["--i" as string]: 3 }}>
          {order ? <>Ready for pickup {order.pickup}. We’ll text {order.name} when it’s on the counter.</> : <>Your order is in.</>}
        </p>
        {order && (
          <div className="rise mt-8 rounded-[20px] bg-surface p-5 text-left" style={{ ["--i" as string]: 4 }}>
            <p className="t-overline text-fg3">Order #{order.no}</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {order.lines.map((l, i) => (
                <li key={i} className="flex justify-between text-fg2"><span>{l.qty}× {l.name}</span><span className="tabular-nums text-fg">{money(l.price)}</span></li>
              ))}
            </ul>
            <p className="mt-3 flex justify-between border-t border-line pt-3 font-semibold"><span>Total</span><span className="tabular-nums">{money(order.total)}</span></p>
          </div>
        )}
        <div className="rise mt-4 rounded-xl bg-accent/10 p-4 text-left" style={{ ["--i" as string]: 5 }}>
          <p className="text-sm font-semibold text-accent">This is a demo. No order was placed.</p>
          <p className="mt-1 text-xs text-fg2">
            This concept isn’t connected to the restaurant. To order for real, visit <a href={REAL_SITE} className="underline underline-offset-4">their site</a>.
          </p>
        </div>
        <ButtonLink href="/menu/" variant="secondary" className="mt-8 w-full">Back to menu</ButtonLink>
      </main>
      <Footer />
    </>
  );
}
