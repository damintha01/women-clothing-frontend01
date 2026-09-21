"use client";
import { X } from "lucide-react";

export function Modal({ open, onClose, title, children, className = "" }) {
  return (
    <div className={`fixed inset-0 z-[90] flex items-center justify-center p-4 transition-opacity duration-500 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}>
      <div className="absolute inset-0 bg-charcoal/50" onClick={onClose} />
      <div
        className={`relative max-h-[90vh] w-full overflow-y-auto bg-cream p-8 shadow-[var(--shadow-lux)] transition-transform duration-500 ${open ? "translate-y-0" : "translate-y-4"} ${className || "max-w-lg"}`}
      >
        <button aria-label="Close" onClick={onClose} className="absolute right-6 top-6">
          <X className="size-5" strokeWidth={1.2} />
        </button>
        {title && <h2 className="display mb-6 text-3xl">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
