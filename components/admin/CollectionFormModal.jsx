"use client";
import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";

const EMPTY = { name: "", description: "", imageUrl: "", tag: "", isVisible: true };

export function CollectionFormModal({ open, onClose, initialValue, onSubmit }) {
  const [values, setValues] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setValues(
        initialValue
          ? {
              name: initialValue.label ?? "",
              description: initialValue.description ?? "",
              imageUrl: initialValue.imageUrl ?? "",
              tag: initialValue.tag ?? "",
              isVisible: true,
            }
          : EMPTY,
      );
    }
  }, [open, initialValue]);

  async function handleSubmit(e) {
    e.preventDefault();
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
    <Modal open={open} onClose={onClose} title={initialValue ? "Edit collection" : "New collection"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Name</label>
          <input
            required
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            className="mt-2 w-full border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Description</label>
          <textarea
            rows={3}
            value={values.description}
            onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
            className="mt-2 w-full border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Image URL</label>
          <input
            value={values.imageUrl}
            onChange={(e) => setValues((v) => ({ ...v, imageUrl: e.target.value }))}
            className="mt-2 w-full border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Tag (e.g. New, Limited)</label>
          <input
            value={values.tag}
            onChange={(e) => setValues((v) => ({ ...v, tag: e.target.value }))}
            className="mt-2 w-full border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground"
          />
        </div>
        <button className="rounded bg-primary px-6 py-3 text-sm text-primary-foreground disabled:opacity-50" disabled={submitting}>
          {submitting ? "Saving…" : "Save collection"}
        </button>
      </form>
    </Modal>
  );
}
