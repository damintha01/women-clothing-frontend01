"use client";
import { useState } from "react";
import { useAdminCollections } from "@/lib/admin/use-collections";
import { CollectionFormModal } from "@/components/admin/CollectionFormModal";

export default function AdminCollectionsPage() {
  const { collections, isLoading, mutatingId, createCollection, updateCollection, removeCollection } = useAdminCollections();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  async function handleSubmit(values) {
    if (editing) await updateCollection(editing.id, values);
    else await createCollection(values);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Collections</h1>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          + New Collection
        </button>
      </div>

      {isLoading ? (
        <p className="mt-8 text-muted-foreground">Loading…</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <div key={c.id} className="border border-border bg-card p-5">
              <p className="font-medium">{c.label}</p>
              {c.tag && <p className="mt-1 text-xs text-muted-foreground">{c.tag}</p>}
              <div className="mt-4 flex gap-4 text-xs">
                <button
                  onClick={() => {
                    setEditing(c);
                    setModalOpen(true);
                  }}
                  className="text-accent"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeCollection(c.id)}
                  disabled={mutatingId === c.id}
                  className="text-destructive"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {collections.length === 0 && <p className="text-muted-foreground">No collections yet.</p>}
        </div>
      )}

      <CollectionFormModal open={modalOpen} onClose={() => setModalOpen(false)} initialValue={editing} onSubmit={handleSubmit} />
    </div>
  );
}
