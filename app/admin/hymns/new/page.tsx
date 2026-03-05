"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/admin/toast";

export default function NewHymnPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const form = new FormData(e.currentTarget);
    const body = {
      title: form.get("title"),
      composer: form.get("composer") || null,
      tradition: form.get("tradition") || null,
      language: form.get("language") || null,
      hymnal: form.get("hymnal") || null,
      link: form.get("link") || null,
      scoreUrl: form.get("scoreUrl") || null,
    };

    const res = await fetch("/api/admin/hymns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const { id } = await res.json();
      toast("Hymn created");
      router.push(`/admin/hymns/${id}`);
    } else {
      toast("Failed to create hymn", "error");
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/hymns"
        className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Hymns
      </Link>

      <h1 className="text-2xl font-bold text-text mb-6">New Hymn</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Title" name="title" required />
        <FormField label="Composer" name="composer" />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="tradition"
              className="block text-xs text-text-muted mb-1"
            >
              Tradition
            </label>
            <select
              id="tradition"
              name="tradition"
              className="w-full px-3 py-2 bg-background border border-border rounded text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">None</option>
              <option value="gregorian">Gregorian</option>
              <option value="classical">Classical</option>
              <option value="african">African</option>
              <option value="contemporary">Contemporary</option>
            </select>
          </div>
          <FormField
            label="Language"
            name="language"
            placeholder="e.g. en, la, sw"
          />
        </div>
        <FormField label="Hymnal" name="hymnal" placeholder="e.g. CDH" />
        <FormField label="Link (YouTube etc.)" name="link" type="url" />
        <FormField label="Score URL" name="scoreUrl" type="url" />

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-primary text-obsidian font-semibold rounded text-sm hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Hymn"}
          </button>
          <Link
            href="/admin/hymns"
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
