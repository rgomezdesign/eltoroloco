"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getItem, TAX_RATE } from "./menu";

export type CartLine = {
  key: string; // item id + options, so the same taco with different options is its own line
  itemId: string;
  qty: number;
  options: Record<string, string[]>; // group id -> choice ids
  notes?: string;
};

type Cart = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  tax: number;
  total: number;
  add: (line: Omit<CartLine, "key">) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  linePrice: (line: CartLine) => number;
  lineSummary: (line: CartLine) => string;
  ready: boolean;
};

const CartContext = createContext<Cart | null>(null);
const STORAGE = "etl-cart-v1";

export function unitPrice(itemId: string, options: Record<string, string[]>) {
  const item = getItem(itemId);
  if (!item) return 0;
  let p = item.price;
  for (const g of item.options ?? []) for (const c of g.choices) if (options[g.id]?.includes(c.id)) p += c.price ?? 0;
  return p;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE, JSON.stringify(lines));
    } catch {}
  }, [lines, ready]);

  const value = useMemo<Cart>(() => {
    const linePrice = (l: CartLine) => unitPrice(l.itemId, l.options) * l.qty;
    const subtotal = lines.reduce((s, l) => s + linePrice(l), 0);
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    return {
      lines,
      ready,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal,
      tax,
      total: subtotal + tax,
      linePrice,
      lineSummary: (l) => {
        const item = getItem(l.itemId);
        const parts: string[] = [];
        for (const g of item?.options ?? []) for (const c of g.choices) if (l.options[g.id]?.includes(c.id)) parts.push(c.label);
        return parts.join(" · ");
      },
      add: (line) => {
        const key = `${line.itemId}|${JSON.stringify(line.options)}|${line.notes ?? ""}`;
        setLines((ls) => {
          const hit = ls.find((l) => l.key === key);
          return hit ? ls.map((l) => (l.key === key ? { ...l, qty: l.qty + line.qty } : l)) : [...ls, { ...line, key }];
        });
      },
      setQty: (key, qty) => setLines((ls) => (qty <= 0 ? ls.filter((l) => l.key !== key) : ls.map((l) => (l.key === key ? { ...l, qty } : l)))),
      clear: () => setLines([]),
    };
  }, [lines, ready]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
