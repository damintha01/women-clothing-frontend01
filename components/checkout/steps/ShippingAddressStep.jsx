"use client";

const COUNTRIES = [
  "Sri Lanka",
  "India",
  "United States",
  "United Kingdom",
  "Australia",
  "Canada",
  "Singapore",
  "United Arab Emirates",
  "Germany",
  "France",
  "Maldives",
  "New Zealand",
  "Japan",
  "Qatar",
  "Other",
];

function Field({ label, value, onChange, error, required = true, className = "" }) {
  return (
    <div className={className}>
      <label className="eyebrow text-muted-foreground">{label}</label>
      <input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function ShippingAddressStep({ value, onChange, errors }) {
  function set(field, val) {
    onChange({ ...value, [field]: val });
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field label="Full name" value={value.fullName} onChange={(v) => set("fullName", v)} error={errors?.fullName} className="sm:col-span-2" />
      <Field label="Address line 1" value={value.line1} onChange={(v) => set("line1", v)} error={errors?.line1} className="sm:col-span-2" />
      <Field label="Address line 2 (optional)" value={value.line2} onChange={(v) => set("line2", v)} required={false} className="sm:col-span-2" />
      <Field label="City" value={value.city} onChange={(v) => set("city", v)} error={errors?.city} />
      <Field label="State / Province" value={value.state} onChange={(v) => set("state", v)} required={false} />
      <Field label="ZIP / Postal code" value={value.zip} onChange={(v) => set("zip", v)} error={errors?.zip} />
      <div>
        <label className="eyebrow text-muted-foreground">Country</label>
        <select
          value={value.country}
          onChange={(e) => set("country", e.target.value)}
          className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground"
        >
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
