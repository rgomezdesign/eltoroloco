// Mirrors Figma "Badge" (Kind = Popular / Spicy)
export default function Badge({ kind }: { kind: "Popular" | "Spicy" }) {
  const cls = kind === "Spicy" ? "bg-spicy/15 text-spicy" : "bg-accent/15 text-accent";
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>{kind === "Spicy" ? "Spicy 🌶" : kind}</span>;
}
