"use client";

import Image from "next/image";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { getItem, money, HERO, type Item } from "@/lib/menu";
import { useCart, unitPrice } from "@/lib/cart";
import Stepper from "./Stepper";
import Badge from "./Badge";

// Item options as a bottom sheet (mobile) / dialog (desktop), so people never lose their place on the menu.
type Ctx = { open: (id: string) => void; quickAdd: (id: string) => void };
const SheetCtx = createContext<Ctx | null>(null);
export const useItemSheet = () => useContext(SheetCtx)!;

export function ItemSheetProvider({ children }: { children: React.ReactNode }) {
  const cart = useCart();
  const [item, setItem] = useState<Item | null>(null);
  const [toast, setToast] = useState<{ text: string; n: number } | null>(null);

  const showToast = (text: string) => setToast({ text, n: Date.now() });
  const quickAdd = useCallback(
    (id: string) => {
      const it = getItem(id);
      if (!it) return;
      if (it.options?.length) return setItem(it);
      cart.add({ itemId: id, qty: 1, options: {} });
      showToast(`${it.name} added`);
    },
    [cart],
  );

  return (
    <SheetCtx.Provider value={{ open: (id) => setItem(getItem(id) ?? null), quickAdd }}>
      {children}
      {item && (
        <Sheet
          key={item.id}
          item={item}
          onClose={() => setItem(null)}
          onAdd={(line) => {
            cart.add(line);
            setItem(null);
            showToast(`${line.qty}× ${item.name} added`);
          }}
        />
      )}
      {toast && (
        <div key={toast.n} role="status" className="pointer-events-none fixed bottom-[92px] left-1/2 z-[60] whitespace-nowrap rounded-full bg-fg px-5 py-3 text-sm font-semibold text-page shadow-2xl lg:bottom-10" style={{ animation: "toast 2.2s var(--ease-out) both" }} onAnimationEnd={() => setToast(null)}>
          ✓ {toast.text}
        </div>
      )}
    </SheetCtx.Provider>
  );
}

function Sheet({ item, onClose, onAdd }: { item: Item; onClose: () => void; onAdd: (l: { itemId: string; qty: number; options: Record<string, string[]>; notes?: string }) => void }) {
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");
  const [sel, setSel] = useState<Record<string, string[]>>(() => Object.fromEntries((item.options ?? []).filter((g) => g.required && g.kind === "single").map((g) => [g.id, [g.choices[0].id]])));
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prevFocus?.focus();
    };
  }, [onClose]);

  const toggle = (gid: string, cid: string, kind: "single" | "multi") =>
    setSel((s) => {
      const cur = s[gid] ?? [];
      if (kind === "single") return { ...s, [gid]: [cid] };
      return { ...s, [gid]: cur.includes(cid) ? cur.filter((x) => x !== cid) : [...cur, cid] };
    });
  const missing = (item.options ?? []).some((g) => g.required && !(sel[g.id]?.length));
  const total = unitPrice(item.id, sel) * qty;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center lg:items-center" role="presentation">
      <button aria-label="Close" className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" style={{ animation: "fade-in 250ms both" }} onClick={onClose} />
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        className="relative flex max-h-[92dvh] w-full max-w-[560px] flex-col overflow-hidden rounded-t-3xl bg-surface outline-none lg:rounded-3xl"
        style={{ animation: "sheet-up 420ms var(--ease-out) both" }}
      >
        <div className="overflow-y-auto px-5 pb-4 pt-3 lg:px-7 lg:pt-7">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line lg:hidden" />
          <div className="relative grid h-44 place-items-center overflow-hidden rounded-2xl bg-raised lg:h-56">
            {item.photo ? (
              <Image src={item.photo} alt="" className={item.photo === HERO ? "h-full w-full object-cover" : "h-[80%] w-[84%] object-contain drop-shadow-2xl"} sizes="560px" />
            ) : (
              <Image src={HERO} alt="" className="h-full w-full object-cover" sizes="560px" />
            )}
          </div>
          <div className="mt-5 flex items-start justify-between gap-4">
            <div>
              <h2 id="sheet-title" className="t-heading-m">{item.name}</h2>
              {item.badge && <div className="mt-2"><Badge kind={item.badge} /></div>}
            </div>
            <p className="t-price pt-1 text-accent">{money(item.price)}</p>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-fg2">{item.description}</p>

          {(item.options ?? []).map((g) => (
            <fieldset key={g.id} className="mt-6">
              <legend className="t-overline text-fg3">
                {g.label} · {g.required ? "Required" : "Optional"}
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {g.choices.map((c) => {
                  const on = sel[g.id]?.includes(c.id) ?? false;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      role={g.kind === "single" ? "radio" : "checkbox"}
                      aria-checked={on}
                      onClick={() => toggle(g.id, c.id, g.kind)}
                      className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-200 active:scale-95 ${on ? "border-accent bg-accent/15 text-accent" : "border-line bg-raised text-fg2 hover:border-fg3"}`}
                    >
                      {c.label}
                      {c.price ? <span className="text-xs font-medium text-fg3">+{money(c.price)}</span> : null}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}

          <label className="mt-6 block">
            <span className="t-overline text-fg3">Notes</span>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="No onions, extra salsa…" className="mt-3 w-full resize-none rounded-xl border border-line bg-raised px-4 py-3 text-sm text-fg placeholder:text-fg3 focus:border-accent focus:outline-none" />
          </label>
        </div>
        <div className="flex items-center gap-3 border-t border-line bg-surface px-5 py-4 lg:px-7">
          <Stepper value={qty} onChange={setQty} min={1} label="quantity" />
          <button
            type="button"
            disabled={missing}
            onClick={() => onAdd({ itemId: item.id, qty, options: sel, notes: notes.trim() || undefined })}
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-on-accent transition-[background-color,transform] hover:bg-accent-hover active:scale-[0.98] disabled:opacity-40"
          >
            Add to cart · {money(total)}
          </button>
        </div>
      </div>
    </div>
  );
}
