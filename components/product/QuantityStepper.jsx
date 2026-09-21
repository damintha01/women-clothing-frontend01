"use client";

export function QuantityStepper({ value, onChange, max = 99 }) {
  return (
    <div className="flex items-center border border-border">
      <button className="px-4 py-3" onClick={() => onChange(Math.max(1, value - 1))} aria-label="Decrease quantity">
        −
      </button>
      <span className="w-8 text-center text-sm">{value}</span>
      <button className="px-4 py-3" onClick={() => onChange(Math.min(max, value + 1))} aria-label="Increase quantity">
        +
      </button>
    </div>
  );
}
