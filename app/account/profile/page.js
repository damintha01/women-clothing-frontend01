"use client";
import { useEffect, useState } from "react";
import { useProfile } from "@/lib/account/use-profile";
import { Reveal } from "@/components/Reveal";

export default function ProfilePage() {
  const { profile, isLoading, updateProfile } = useProfile();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) setName(profile.name);
  }, [profile]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name });
    } finally {
      setSaving(false);
    }
  }

  if (isLoading || !profile) {
    return <p className="eyebrow text-muted-foreground">Loading…</p>;
  }

  return (
    <div className="max-w-md space-y-10">
      <Reveal className="border border-border p-8">
        <p className="eyebrow text-muted-foreground">Member ID</p>
        <p className="mt-2 font-serif text-xl">{profile.id}</p>
        <p className="mt-4 eyebrow text-muted-foreground">Role</p>
        <p className="mt-2 text-sm uppercase tracking-widest">{profile.role}</p>
        {profile.createdAt && (
          <>
            <p className="mt-4 eyebrow text-muted-foreground">Member since</p>
            <p className="mt-2 text-sm">{new Date(profile.createdAt).toLocaleDateString()}</p>
          </>
        )}
      </Reveal>

      <Reveal delay={120}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="eyebrow text-muted-foreground">Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground"
            />
          </div>
          <div>
            <label className="eyebrow text-muted-foreground">Email</label>
            <input
              value={profile.email}
              disabled
              className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-sm text-muted-foreground outline-none"
            />
          </div>
          <button className="btn-lux" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>
      </Reveal>
    </div>
  );
}
