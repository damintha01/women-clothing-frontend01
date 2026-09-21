"use client";
import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { SECTION_TYPES, getSectionTypeLabel } from "@/lib/admin/section-types";

function toConfigDraft(section) {
  if (!section) return "{}";
  const { id, type, name, order, isVisible, isBuiltIn, ...config } = section;
  return JSON.stringify(config, null, 2);
}

export function SectionFormModal({ open, onClose, initialValue, onSubmit }) {
  const [name, setName] = useState("");
  const [type, setType] = useState(SECTION_TYPES[0]);
  const [order, setOrder] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [configDraft, setConfigDraft] = useState("{}");
  const [configError, setConfigError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(initialValue?.name ?? "");
    setType(initialValue?.type ?? SECTION_TYPES[0]);
    setOrder(initialValue?.order ?? 0);
    setIsVisible(initialValue?.isVisible ?? true);
    setConfigDraft(toConfigDraft(initialValue));
    setConfigError(null);
  }, [open, initialValue]);

  async function handleSubmit(e) {
    e.preventDefault();
    let config;
    try {
      config = JSON.parse(configDraft);
    } catch {
      setConfigError("Config must be valid JSON.");
      return;
    }
    setConfigError(null);
    setSubmitting(true);
    try {
      await onSubmit({ name, type, order: Number(order), isVisible, config });
      onClose();
    } catch {
      // toast already shown by the hook
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={initialValue ? "Edit section" : "New section"} className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Type</label>
            <select
              value={type}
              disabled={Boolean(initialValue)}
              onChange={(e) => setType(e.target.value)}
              className="mt-2 w-full border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground disabled:opacity-60"
            >
              {SECTION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {getSectionTypeLabel(t)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Order</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="mt-2 w-full border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground"
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isVisible} onChange={(e) => setIsVisible(e.target.checked)} />
          Visible on homepage
        </label>
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground">
            Config (JSON — fields depend on section type)
          </label>
          <textarea
            rows={10}
            value={configDraft}
            onChange={(e) => setConfigDraft(e.target.value)}
            className="mt-2 w-full border border-border bg-transparent p-3 font-mono text-xs outline-none focus:border-foreground"
          />
          {configError && <p className="mt-1 text-xs text-destructive">{configError}</p>}
        </div>
        <button className="rounded bg-primary px-6 py-3 text-sm text-primary-foreground disabled:opacity-50" disabled={submitting}>
          {submitting ? "Saving…" : "Save section"}
        </button>
      </form>
    </Modal>
  );
}
