"use client";
import { useEffect, useState } from "react";
import { useSettings } from "@/lib/admin/use-settings";
import { toast } from "@/lib/toast";

export default function AdminSettingsPage() {
  const { settings, isLoading, saving, save } = useSettings();
  const [draft, setDraft] = useState("{}");

  useEffect(() => {
    if (settings) setDraft(JSON.stringify(settings.config ?? {}, null, 2));
  }, [settings]);

  async function handleSave() {
    let config;
    try {
      config = JSON.parse(draft);
    } catch {
      toast.error("Config must be valid JSON.");
      return;
    }
    await save(config);
  }

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Freeform site configuration, stored as-is by the backend. Edit with care.
      </p>
      <textarea
        rows={20}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        className="mt-6 w-full max-w-2xl border border-border bg-transparent p-4 font-mono text-xs outline-none focus:border-foreground"
      />
      <button onClick={handleSave} disabled={saving} className="mt-4 rounded bg-primary px-6 py-3 text-sm text-primary-foreground disabled:opacity-50">
        {saving ? "Saving…" : "Save settings"}
      </button>
    </div>
  );
}
