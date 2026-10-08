"use client";

import Image from "next/image";
import { useCart } from "@/lib/cart";
import { getItem, money, HERO } from "@/lib/menu";
import Stepper from "./Stepper";

// Mirrors Figma "Cart Line"
export default function CartLines({ compact = false }: { compact?: boolean }) {
  const { lines, setQty, linePrice, lineSummary } = useCart();
  return (
    <ul>
      {lines.map((l) => {
        const item = getItem(l.itemId)!;
        const summary = [lineSummary(l), l.notes ? `“${l.notes}”` : ""].filter(Boolean).join(" · ");
        return (
          <li key={l.key} className="flex items-center gap-4 border-b border-line py-4" style={{ animation: "rise 400ms var(--ease-out) both" }}>
            <div className={`grid shrink-0 place-items-center overflow-hidden rounded-xl bg-raised ${compact ? "h-14 w-14" : "h-16 w-16"}`}>
              <Image src={item.photo ?? HERO} alt="" sizes="64px" className={item.photo && item.photo !== HERO ? "h-[80%] w-auto object-contain" : "h-full w-full object-cover"} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{item.name}</p>
              {summary && <p className="mt-0.5 truncate text-xs text-fg3">{summary}</p>}
              <div className="mt-2"><Stepper value={l.qty} onChange={(n) => setQty(l.key, n)} label={item.name} /></div>
            </div>
            <span className="text-sm font-bold tabular-nums">{money(linePrice(l))}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function Totals({ big = false }: { big?: boolean }) {
  const { subtotal, tax, total } = useCart();
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between text-fg3"><dt>Subtotal</dt><dd className="tabular-nums text-fg2">{money(subtotal)}</dd></div>
      <div className="flex justify-between text-fg3"><dt>Tax</dt><dd className="tabular-nums text-fg2">{money(tax)}</dd></div>
      <div className="flex items-baseline justify-between pt-1 font-semibold"><dt>Total</dt><dd className={`tabular-nums ${big ? "text-2xl" : "text-lg"} font-bold`}>{money(total)}</dd></div>
    </dl>
  );
}
