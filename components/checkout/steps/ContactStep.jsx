"use client";

export function ContactStep({ value, onChange, errors }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="eyebrow text-muted-foreground">Email</label>
        <input
          type="email"
          required
          value={value.email}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
          className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground"
        />
        {errors?.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
      </div>
      <div>
        <label className="eyebrow text-muted-foreground">Phone</label>
        <input
          type="tel"
          required
          value={value.phone}
          onChange={(e) => onChange({ ...value, phone: e.target.value })}
          className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground"
        />
        {errors?.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
      </div>
    </div>
  );
}
