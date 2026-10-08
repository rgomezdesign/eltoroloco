"use client";

import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CartLines, { Totals } from "@/components/CartLines";
import { ButtonLink } from "@/components/Button";
import { useItemSheet } from "@/components/ItemSheet";
import { useCart } from "@/lib/cart";
import { getItem, money } from "@/lib/menu";

// Mirrors Figma "Mobile · Cart"
export default function CartPage() {
  const cart = useCart();
  const { quickAdd } = useItemSheet();
  const inCart = new Set(cart.lines.map((l) => l.itemId));
  const upsell = ["chips-guac", "loco-fries", "horchata", "ceviche-tostada"].filter((id) => !inCart.has(id)).slice(0, 2).map((id) => getItem(id)!);
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[640px] px-5 pb-24 pt-28 lg:pt-36">
        <h1 className="t-display-l">Your order</h1>
        {!cart.ready ? null : cart.count === 0 ? (
          <div className="mt-10 rounded-[20px] bg-surface p-8 text-center">
            <p className="text-fg2">Your cart is empty.</p>
            <ButtonLink href="/menu/" className="mt-6">Browse the menu</ButtonLink>
          </div>
        ) : (
          <>
            <div className="mt-4"><CartLines /></div>
            {upsell.length > 0 && (
              <div className="mt-8">
                <p className="t-overline text-fg3">Add something?</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {upsell.map((it) => (
                    <button key={it.id} type="button" onClick={() => quickAdd(it.id)} className="flex items-center gap-3 rounded-2xl bg-surface p-3 text-left transition-colors hover:bg-raised">
                      {it.photo && <Image src={it.photo} alt="" sizes="48px" className="h-11 w-11 object-contain" />}
                      <span>
                        <span className="block text-xs font-semibold">{it.name}</span>
                        <span className="text-xs font-semibold text-accent">{money(it.price)}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-8"><Totals big /></div>
            <ButtonLink href="/checkout/" className="mt-8 w-full">Checkout · {money(cart.total)}</ButtonLink>
            <ButtonLink href="/menu/" variant="ghost" className="mt-2 w-full">Keep browsing</ButtonLink>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
