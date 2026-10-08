"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Totals } from "@/components/CartLines";
import { Button, ButtonLink } from "@/components/Button";
import { useCart } from "@/lib/cart";
import { getItem, money } from "@/lib/menu";

// Mirrors Figma "Mobile · Checkout". Pickup only, three decisions: when, who, how to pay.
// Demo: no payment details are ever collected.
const OPEN = 8;
const CLOSE = 21; // last pickup at 9pm
function slots() {
  const now = new Date();
  const d = new Date(now);
  d.setMinutes(Math.ceil((d.getMinutes() + 30) / 30) * 30, 0, 0);
  const openNow = now.getHours() >= OPEN && now.getHours() < CLOSE;
  const out: { id: string; label: string }[] = openNow ? [{ id: "asap", label: "ASAP · ~15 min" }] : [];
  // Outside hours, offer the first slots of the next opening
  if (!openNow || d.getHours() >= CLOSE) {
    if (now.getHours() >= OPEN) d.setDate(d.getDate() + 1);
    d.setHours(OPEN, 30, 0, 0);
  }
  const prefix = d.getDate() !== now.getDate() ? "Tomorrow " : "";
  for (let i = 0; i < 3 && d.getHours() < CLOSE; i++) {
    out.push({ id: d.toISOString(), label: prefix + d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) });
    d.setMinutes(d.getMinutes() + 30);
  }
  return out;
}

export default function Checkout() {
  const cart = useCart();
  const router = useRouter();
  // Built in the browser so times reflect the visitor’s clock, not the build time
  const [times, setTimes] = useState<{ id: string; label: string }[]>([]);
  const [time, setTime] = useState("");
  useEffect(() => {
    const t = slots();
    setTimes(t);
    setTime(t[0]?.id ?? "");
  }, []);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [tried, setTried] = useState(false);
  const placing = useRef(false);

  useEffect(() => {
    if (cart.ready && cart.count === 0 && !placing.current) router.replace("/menu/");
  }, [cart.ready, cart.count, router]);

  const nameOk = name.trim().length > 1;
  const phoneOk = phone.replace(/\D/g, "").length >= 10;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (!nameOk || !phoneOk) return;
    const pickup = time === "asap" ? "in about 15 minutes" : `${times.find((t) => t.id === time)?.label.startsWith("Tomorrow") ? "" : "around "}${times.find((t) => t.id === time)?.label.replace("Tomorrow", "tomorrow at")}`;
    const order = {
      no: `ETL-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.trim().split(" ")[0],
      pickup,
      lines: cart.lines.map((l) => ({ name: getItem(l.itemId)?.name, qty: l.qty, price: cart.linePrice(l) })),
      total: cart.total,
    };
    try { sessionStorage.setItem("etl-last-order", JSON.stringify(order)); } catch {}
    placing.current = true;
    cart.clear();
    router.push("/confirmation/");
  };

  const field = "mt-2 w-full rounded-xl border bg-surface px-4 py-3.5 text-base text-fg placeholder:text-fg3 focus:border-accent focus:outline-none";
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[640px] px-5 pb-24 pt-28 lg:pt-36">
        <h1 className="t-display-l">Checkout</h1>
        <form onSubmit={submit} noValidate className="mt-8 space-y-8">
          <fieldset>
            <legend className="t-overline text-fg3">Pickup time</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {times.map((t) => (
                <button type="button" key={t.id} role="radio" aria-checked={time === t.id} onClick={() => setTime(t.id)} className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors ${time === t.id ? "border-accent bg-accent/15 text-accent" : "border-line bg-raised text-fg2 hover:border-fg3"}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="t-overline text-fg3">Your details</legend>
            <label className="block pt-3 text-sm text-fg2">
              Name
              <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" className={`${field} ${tried && !nameOk ? "border-spicy" : "border-line"}`} placeholder="Who’s picking up?" aria-invalid={tried && !nameOk} />
              {tried && !nameOk && <span className="mt-1 block text-xs text-spicy">Add a name for the order.</span>}
            </label>
            <label className="block text-sm text-fg2">
              Phone
              <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" inputMode="tel" autoComplete="tel" className={`${field} ${tried && !phoneOk ? "border-spicy" : "border-line"}`} placeholder="For pickup updates" aria-invalid={tried && !phoneOk} />
              {tried && !phoneOk && <span className="mt-1 block text-xs text-spicy">Enter a 10-digit phone number.</span>}
            </label>
          </fieldset>

          <fieldset>
            <legend className="t-overline text-fg3">Payment</legend>
            <div className="mt-3 flex items-center gap-3 rounded-xl border-[1.5px] border-accent bg-accent/10 px-4 py-3.5">
              <span className="h-[18px] w-[18px] rounded-full border-[5px] border-accent" aria-hidden="true" />
              <span>
                <span className="block text-sm font-semibold">Pay at pickup</span>
                <span className="block text-xs text-fg3">Demo: no card details collected</span>
              </span>
            </div>
          </fieldset>

          <div className="rounded-[20px] bg-surface p-5">
            <ul className="mb-4 space-y-1 text-sm text-fg2">
              {cart.lines.map((l) => (
                <li key={l.key} className="flex justify-between"><span>{l.qty}× {getItem(l.itemId)?.name}</span><span className="tabular-nums">{money(cart.linePrice(l))}</span></li>
              ))}
            </ul>
            <Totals big />
          </div>

          <Button type="submit" className="w-full">Place order (demo) · {money(cart.total)}</Button>
          <ButtonLink href="/cart/" variant="ghost" className="w-full">Back to cart</ButtonLink>
        </form>
      </main>
      <Footer />
    </>
  );
}
