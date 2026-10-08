"use client";

import { money, type Item } from "@/lib/menu";
import { useItemSheet } from "./ItemSheet";
import Badge from "./Badge";

// Mirrors Figma "Menu Row"
export default function MenuRow({ item }: { item: Item }) {
  const { open, quickAdd } = useItemSheet();
  return (
    <div className="group relative flex items-center gap-4 border-b border-line py-4">
      <button type="button" onClick={() => open(item.id)} className="absolute inset-0" aria-label={`View ${item.name}`} />
      <div className="pointer-events-none min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-2 text-sm font-semibold transition-colors group-hover:text-accent">
          {item.name} {item.badge && <Badge kind={item.badge} />}
        </p>
        <p className="mt-1 text-sm text-fg3">{item.description}</p>
      </div>
      <span className="t-price pointer-events-none text-accent">{money(item.price)}</span>
      <button
        type="button"
        onClick={() => quickAdd(item.id)}
        aria-label={`Add ${item.name}`}
        className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-xl font-bold text-on-accent transition-transform duration-300 ease-[var(--ease-spring)] hover:rotate-90 hover:scale-110 active:scale-90"
      >
        +
      </button>
    </div>
  );
}
