"use client";
import { useState } from "react";
import { useSections } from "@/lib/admin/use-sections";
import { getSectionTypeLabel } from "@/lib/admin/section-types";
import { SectionFormModal } from "@/components/admin/SectionFormModal";

export default function AdminSectionsPage() {
  const { sections, isLoading, mutatingId, createSection, updateSection, removeSection } = useSections();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  async function handleSubmit(values) {
    if (editing) await updateSection(editing.id, values);
    else await createSection(values);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Homepage Sections</h1>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          + New Section
        </button>
      </div>

      {isLoading ? (
        <p className="mt-8 text-muted-foreground">Loading…</p>
      ) : (
        <div className="mt-8 space-y-3">
          {sections.map((s) => (
            <div key={s.id} className="flex items-center justify-between border border-border bg-card p-4">
              <div>
                <p className="font-medium">
                  {s.name} <span className="text-xs text-muted-foreground">· {getSectionTypeLabel(s.type)}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Order {s.order} · {s.isVisible ? "Visible" : "Hidden"}
                  {s.isBuiltIn ? " · Built-in" : ""}
                </p>
              </div>
              <div className="flex gap-4 text-xs">
                <button
                  onClick={() => {
                    setEditing(s);
                    setModalOpen(true);
                  }}
                  className="text-accent"
                >
                  Edit
                </button>
                {!s.isBuiltIn && (
                  <button onClick={() => removeSection(s.id)} disabled={mutatingId === s.id} className="text-destructive">
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
          {sections.length === 0 && <p className="text-muted-foreground">No sections yet.</p>}
        </div>
      )}

      <SectionFormModal open={modalOpen} onClose={() => setModalOpen(false)} initialValue={editing} onSubmit={handleSubmit} />
    </div>
  );
}
