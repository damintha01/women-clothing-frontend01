"use client";

export function VariantSelector({ product, size, color, onSizeChange, onColorChange }) {
  function colorAvailable(colorName) {
    return product.variants.some((v) => v.color === colorName && (!size || v.size === size) && v.inStock);
  }
  function sizeAvailable(sizeValue) {
    return product.variants.some((v) => v.size === sizeValue && (!color || v.color === color) && v.inStock);
  }

  return (
    <>
      {product.colors.length > 0 && (
        <div className="mt-8">
          <p className="eyebrow text-muted-foreground">Colour{color ? ` — ${color}` : ""}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {product.colors.map((c) => (
              <button
                key={c.name}
                aria-label={c.name}
                disabled={!colorAvailable(c.name)}
                onClick={() => onColorChange(c.name)}
                className={`size-8 rounded-full border transition-transform duration-500 disabled:cursor-not-allowed disabled:opacity-30 ${
                  color === c.name ? "scale-110 border-foreground" : "border-border"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      )}

      {product.sizes.length > 0 && (
        <div className="mt-8">
          <p className="eyebrow text-muted-foreground">Size</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                disabled={!sizeAvailable(s)}
                onClick={() => onSizeChange(s)}
                className={`size-11 border text-xs tracking-widest transition-colors duration-500 disabled:cursor-not-allowed disabled:opacity-30 ${
                  size === s ? "border-foreground bg-foreground text-cream" : "border-border hover:border-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
