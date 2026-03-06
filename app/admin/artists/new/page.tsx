"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/admin/toast";

export default function NewArtistPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("name"),
      voicePart: form.get("voicePart") || null,
      instrument: form.get("instrument") || null,
      isConductor: form.get("isConductor") === "on",
      isCORMember: form.get("isCORMember") === "on",
      bio: form.get("bio") || null,
      website: form.get("website") || null,
    };

    const res = await fetch("/api/admin/artists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const { id } = await res.json();
      toast("Artist created");
      router.push(`/admin/artists/${id}`);
    } else {
      toast("Failed to create artist", "error");
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/artists"
        className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Artists
      </Link>

      <h1 className="text-2xl font-bold text-text mb-6">New Artist</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Name" name="name" required />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="voicePart"
              className="block text-xs text-text-muted mb-1"
            >
              Voice Part
            </label>
            <select
              id="voicePart"
              name="voicePart"
              className="w-full px-3 py-2 bg-background border border-border rounded text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">None</option>
              <option value="soprano">Soprano</option>
              <option value="alto">Alto</option>
              <option value="tenor">Tenor</option>
              <option value="bass">Bass</option>
              <option value="instrumentalist">Instrumentalist</option>
            </select>
          </div>
          <FormField
            label="Instrument"
            name="instrument"
            placeholder="e.g. Piano, Percussion"
          />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-text-muted">
            <input type="checkbox" name="isConductor" className="rounded" />
            Conductor
          </label>
          <label className="flex items-center gap-2 text-sm text-text-muted">
            <input type="checkbox" name="isCORMember" className="rounded" />
            COR Member
          </label>
        </div>
        <div>
          <label htmlFor="bio" className="block text-xs text-text-muted mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            placeholder="Brief biography..."
            className="w-full px-3 py-2 bg-background border border-border rounded text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <FormField
          label="Website"
          name="website"
          type="url"
          placeholder="https://..."
        />

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-primary text-obsidian font-semibold rounded text-sm hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Artist"}
          </button>
          <Link
            href="/admin/artists"
            className="px-4 py-2 border border-border text-text-muted rounded text-sm hover:text-text transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

function FormField({
  label,
  name,
  required,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs text-text-muted mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-background border border-border rounded text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
    </div>
  );
}
