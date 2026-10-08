"use client";

import Image from "next/image";
import { money, HERO, type Item } from "@/lib/menu";
import { useItemSheet } from "./ItemSheet";
import Badge from "./Badge";

// Mirrors Figma "Menu Card"
export default function MenuCard({ item, priority = false, i = 0 }: { item: Item; priority?: boolean; i?: number }) {
  const { open, quickAdd } = useItemSheet();
  const cutout = item.photo && item.photo !== HERO;
  return (
    <article data-reveal style={{ ["--i" as string]: i % 3 }} className="group relative flex flex-col overflow-hidden rounded-[20px] bg-surface transition-[transform,background-color] duration-300 hover:-translate-y-1 hover:bg-raised">
      <button type="button" onClick={() => open(item.id)} className="absolute inset-0 z-0" aria-label={`View ${item.name}`} />
      <div className="pointer-events-none relative grid h-48 place-items-center overflow-hidden">
        {item.photo && (
          <Image
            src={item.photo}
            alt=""
            priority={priority}
            sizes="(max-width: 1023px) 80vw, 420px"
            className={cutout ? "absolute inset-0 m-auto h-[76%] w-[84%] object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-rotate-3 group-hover:scale-[1.06]" : "h-full w-full object-cover"}
          />
        )}
        {item.badge && <span className="absolute left-4 top-4"><Badge kind={item.badge} /></span>}
      </div>
      <div className="pointer-events-none relative flex flex-1 flex-col gap-2 p-5">
        <h3 className="t-heading-s">{item.name}</h3>
        <p className="text-sm leading-relaxed text-fg2">{item.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="t-price text-accent">{money(item.price)}</span>
          <button
            type="button"
            onClick={() => quickAdd(item.id)}
            aria-label={`Add ${item.name}`}
            className="pointer-events-auto relative z-10 grid h-10 w-10 place-items-center rounded-full bg-accent text-xl font-bold text-on-accent transition-transform duration-300 ease-[var(--ease-spring)] hover:rotate-90 hover:scale-110 active:scale-90"
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}
