import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MenuCard from "@/components/MenuCard";
import MenuRow from "@/components/MenuRow";
import { ButtonLink } from "@/components/Button";
import { FAVORITES, ITEMS, HERO, getItem } from "@/lib/menu";

// Mirrors Figma "Desktop · Home" / "Mobile · Home"
export default function Home() {
  const favs = FAVORITES.map((id) => getItem(id)!);
  const tacos = ITEMS.filter((i) => i.category === "tacos").slice(0, 4);
  return (
    <>
      <Nav overlay />
      <main>
        <section className="relative isolate flex min-h-[640px] items-end overflow-hidden lg:min-h-[720px] lg:items-center">
          <Image src={HERO} alt="Street tacos with lime on a wooden board" priority fill sizes="100vw" className="hero-zoom -z-10 object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-page via-page/70 to-page/10 lg:bg-gradient-to-r lg:from-page/95 lg:via-page/50 lg:to-page/5" />
          <div className="mx-auto w-full max-w-[1440px] px-5 pb-12 lg:px-16 lg:pb-0">
            <p className="rise t-overline text-accent">Tacos · Mariscos · Perris, CA</p>
            <h1 className="rise t-display-xl mt-4" style={{ ["--i" as string]: 1 }}>
              Bold flavor,<br />made fresh daily.
            </h1>
            <p className="rise mt-5 max-w-[520px] text-base leading-relaxed text-fg2 lg:text-lg" style={{ ["--i" as string]: 2 }}>
              Street tacos, loaded plates and fresh mariscos. Order ahead for pickup and skip the wait.
            </p>
            <div className="rise mt-8 flex flex-col gap-3 sm:flex-row" style={{ ["--i" as string]: 3 }}>
              <ButtonLink href="/menu/">Order online</ButtonLink>
              <ButtonLink href="/menu/" variant="secondary">View menu</ButtonLink>
            </div>
          </div>
        </section>

        <section className="bg-surface">
          <div className="mx-auto flex max-w-[1440px] justify-between gap-8 px-5 py-5 sm:justify-start sm:gap-16 lg:px-16 lg:py-7">
            {[["Open today", "8am – 9pm"], ["Pickup", "Ready in about 15 min"], ["Find us", "Perris, California"]].map(([k, v], i) => (
              <div key={k} className={i === 2 ? "hidden sm:block" : ""}>
                <p className="t-overline text-fg3">{k}</p>
                <p className="mt-1 text-sm font-semibold">{v}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-5 pb-16 pt-16 lg:px-16 lg:pb-16 lg:pt-28">
          <div className="flex items-end justify-between gap-6" data-reveal>
            <div>
              <p className="t-overline text-accent">Start here</p>
              <h2 className="t-display-l mt-2">Fan favorites</h2>
            </div>
            <ButtonLink href="/menu/" variant="ghost" className="hidden sm:inline-flex">See full menu →</ButtonLink>
          </div>
          <div className="-mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:mt-10 lg:grid-cols-3">
            {favs.map((it, i) => (
              <div key={it.id} className="w-[78vw] shrink-0 snap-start sm:w-auto">
                <MenuCard item={it} i={i} />
              </div>
            ))}
          </div>
          <ButtonLink href="/menu/" variant="secondary" className="mt-8 w-full sm:hidden">See full menu</ButtonLink>
        </section>

        <section className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 pb-20 pt-8 lg:grid-cols-[560px_1fr] lg:gap-20 lg:px-16 lg:pb-28">
          <div className="relative h-72 overflow-hidden rounded-[20px] lg:h-[480px]" data-reveal>
            <Image src={HERO} alt="" fill sizes="(max-width: 1023px) 100vw, 560px" className="object-cover transition-transform duration-[1.5s] hover:scale-105" />
          </div>
          <div data-reveal style={{ ["--i" as string]: 1 }}>
            <p className="t-overline text-accent">The classics</p>
            <h2 className="t-display-l mt-2">Street tacos</h2>
            <p className="mt-3 text-fg2">Corn tortillas, fresh off the comal. Mix and match.</p>
            <div className="mt-4">
              {tacos.map((t) => <MenuRow key={t.id} item={t} />)}
            </div>
          </div>
        </section>

        <section id="visit" className="scroll-mt-20 bg-surface">
          <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-16 lg:grid-cols-2 lg:gap-20 lg:px-16 lg:py-24">
            <div data-reveal>
              <p className="t-overline text-accent">Come hungry</p>
              <h2 className="t-display-l mt-2">Pickup, dine in,<br />or stay a while.</h2>
              <p className="mt-4 max-w-[460px] text-fg2">Find us in Perris, California. Open every day for breakfast, lunch and dinner.</p>
            </div>
            <dl data-reveal style={{ ["--i" as string]: 1 }}>
              {[["Monday – Thursday", "8am – 9pm"], ["Friday – Saturday", "8am – 10pm"], ["Sunday", "8am – 9pm"]].map(([d, h]) => (
                <div key={d} className="flex justify-between border-b border-line py-4">
                  <dt className="text-fg2">{d}</dt>
                  <dd className="font-semibold">{h}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
