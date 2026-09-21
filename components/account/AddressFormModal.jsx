"use client";
import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { validateAddressInput } from "@/lib/validation";

const EMPTY = { label: "", line1: "", line2: "", city: "", state: "", zip: "", country: "Sri Lanka" };

export function AddressFormModal({ open, onClose, initialValue, onSubmit }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) setValues(initialValue ?? EMPTY);
    setErrors({});
  }, [open, initialValue]);

  async function handleSubmit(e) {
    e.preventDefault();
    const fieldErrors = validateAddressInput(values);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit(values);
      onClose();
    } catch {
      // toast already shown by the hook
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={initialValue ? "Edit address" : "Add address"}>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          ["label", "Label (e.g. Home)", false],
          ["line1", "Address line 1", true],
          ["line2", "Address line 2", false],
          ["city", "City", true],
          ["state", "State / Province", false],
          ["zip", "ZIP / Postal code", true],
          ["country", "Country", true],
        ].map(([key, label, required]) => (
          <div key={key} className={key === "line1" || key === "line2" ? "sm:col-span-2" : ""}>
            <label className="eyebrow text-muted-foreground">{label}</label>
            <input
              value={values[key] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
              className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground"
            />
            {errors[key] && <p className="mt-1 text-xs text-destructive">{errors[key]}</p>}
          </div>
        ))}
        <button className="btn-lux sm:col-span-2" disabled={submitting}>
          {submitting ? "Saving…" : "Save address"}
        </button>
      </form>
    </Modal>
  );
}
