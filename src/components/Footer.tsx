// Mirrors Figma "Footer" (Viewport = Desktop / Mobile), including the concept note
export const REAL_SITE = "https://www.eltorolocogrill.online/";

export default function Footer() {
  return (
    <footer className="bg-surface">
      <div className="mx-auto max-w-[1440px] px-5 pb-8 pt-12 lg:px-16 lg:pt-16">
        <div className="flex flex-col gap-7 lg:flex-row lg:gap-24">
          <div>
            <p className="font-display text-xl font-extrabold">EL TORO LOCO GRILL</p>
            <p className="mt-2 text-sm text-fg3">Tacos, mariscos and more.</p>
          </div>
          <div>
            <p className="t-overline text-fg3">Hours</p>
            <p className="mt-2 text-sm text-fg2">Mon–Thu 8am–9pm</p>
            <p className="text-sm text-fg2">Fri–Sun 8am–10pm</p>
          </div>
          <div>
            <p className="t-overline text-fg3">Visit</p>
            <p className="mt-2 text-sm text-fg2">Perris, California</p>
            <p className="text-sm text-fg2">Pickup and dine-in</p>
          </div>
        </div>
        <div className="mt-10 border-t border-line pt-6 text-xs leading-relaxed text-fg3">
          Concept redesign by{" "}
          <a href="https://rgomezdesign.com" className="underline decoration-line underline-offset-4 hover:text-fg">Roman Gomez</a>. Not affiliated with El Toro Loco Grill. Menu and prices are samples, and ordering is a demo. For real orders, visit{" "}
          <a href={REAL_SITE} className="underline decoration-line underline-offset-4 hover:text-fg" rel="noopener">the restaurant’s site</a>.
        </div>
      </div>
    </footer>
  );
}
