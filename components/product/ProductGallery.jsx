"use client";
import { useState } from "react";

export function ProductGallery({ images, name }) {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : [{ id: "placeholder", url: null, alt: name }];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-[80px_1fr]">
      <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:flex-col sm:overflow-visible">
        {list.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setActive(i)}
            className={`aspect-[3/4] w-16 shrink-0 overflow-hidden border transition-colors duration-500 sm:w-full ${
              active === i ? "border-foreground" : "border-transparent"
            }`}
          >
            {img.url && (
              <img src={img.url} alt={img.alt ?? name} loading="lazy" className="h-full w-full object-cover" />
            )}
          </button>
        ))}
      </div>
      <div className="order-1 aspect-[3/4] overflow-hidden bg-secondary sm:order-2">
        {list[active]?.url && (
          <img src={list[active].url} alt={list[active].alt ?? name} className="h-full w-full object-cover" />
        )}
      </div>
    </div>
  );
}
