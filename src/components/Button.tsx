import Link from "next/link";

// Mirrors Figma "Button" (Variant = Primary / Secondary / Ghost)
type Variant = "primary" | "secondary" | "ghost";
const styles: Record<Variant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent-hover active:scale-[0.97]",
  secondary: "border-[1.5px] border-fg text-fg hover:bg-fg hover:text-page active:scale-[0.97]",
  ghost: "text-fg hover:text-accent",
};
const base = "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-[background-color,color,transform] duration-200 disabled:pointer-events-none disabled:opacity-40";

export function Button({ variant = "primary", className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />;
}

export function ButtonLink({ href, variant = "primary", className = "", children }: { href: string; variant?: Variant; className?: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </Link>
  );
}
