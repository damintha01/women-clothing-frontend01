"use client";
import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { subscribeToasts } from "@/lib/toast";

const DURATION = 3200;

export function ToastHost() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    return subscribeToasts((item) => {
      setItems((prev) => [...prev, item]);
      setTimeout(() => {
        setItems((prev) => prev.filter((i) => i.id !== item.id));
      }, DURATION);
    });
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex flex-col items-center gap-2 px-4">
      {items.map((item) => (
        <div
          key={item.id}
          className={`pointer-events-auto flex max-w-md items-center gap-3 border px-5 py-3 shadow-[var(--shadow-lux)] transition-all duration-500 ${
            item.variant === "error"
              ? "border-destructive/40 bg-charcoal text-destructive-foreground"
              : "border-border bg-charcoal text-cream"
          }`}
        >
          <span
            className={`grid size-5 shrink-0 place-items-center rounded-full ${
              item.variant === "error" ? "bg-destructive/80" : "bg-rose"
            }`}
          >
            {item.variant === "error" ? (
              <X className="size-3" strokeWidth={2} />
            ) : (
              <Check className="size-3" strokeWidth={2} />
            )}
          </span>
          <p className="text-sm">{item.message}</p>
        </div>
      ))}
    </div>
  );
}
