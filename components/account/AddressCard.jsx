"use client";

export function AddressCard({ address, onEdit, onDelete, onSetDefault, mutating }) {
  return (
    <div className="relative border border-border p-6">
      {address.isDefault && (
        <span className="absolute right-4 top-4 text-[10px] uppercase tracking-widest text-rose">Default</span>
      )}
      {address.label && <p className="eyebrow text-muted-foreground">{address.label}</p>}
      <p className="mt-2 font-serif text-lg leading-tight">
        {address.line1}
        {address.line2 ? `, ${address.line2}` : ""}
      </p>
      <p className="text-sm text-muted-foreground">
        {address.city}, {address.zip}
      </p>
      <p className="text-sm text-muted-foreground">{address.country}</p>

      <div className="mt-4 flex gap-4">
        <button onClick={onEdit} className="eyebrow line-link">
          Edit
        </button>
        <button onClick={onDelete} disabled={mutating} className="eyebrow line-link text-muted-foreground">
          Delete
        </button>
        {!address.isDefault && (
          <button onClick={onSetDefault} disabled={mutating} className="eyebrow line-link text-muted-foreground">
            Set default
          </button>
        )}
      </div>
    </div>
  );
}
