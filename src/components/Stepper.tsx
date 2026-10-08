"use client";
// Mirrors Figma "Quantity Stepper"
export default function Stepper({ value, onChange, min = 0, label }: { value: number; onChange: (n: number) => void; min?: number; label: string }) {
  const b = "grid h-9 w-9 place-items-center rounded-full bg-raised text-fg transition-colors hover:bg-hover disabled:opacity-40";
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-line p-1" role="group" aria-label={label}>
      <button type="button" className={b} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={`Decrease ${label}`}>−</button>
      <span className="w-7 text-center text-sm font-semibold tabular-nums" aria-live="polite">{value}</span>
      <button type="button" className={b} onClick={() => onChange(value + 1)} aria-label={`Increase ${label}`}>+</button>
    </div>
  );
}
