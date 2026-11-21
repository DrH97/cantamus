"use client";

import {
  ArrowDown,
  ArrowUp,
  Check,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/admin/toast";

interface MassSection {
  id: number;
  slug: string;
  label: string;
  sortOrder: number;
  songCount: number;
}

export default function AdminMassSectionsPage() {
  const { toast } = useToast();
  const [sections, setSections] = useState<MassSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLabel, setNewLabel] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState("");

  const fetchSections = useCallback(async () => {
    const res = await fetch("/api/admin/mass-sections");
    if (res.ok) setSections(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  async function errorMessage(res: Response, fallback: string) {
    try {
      const body = await res.json();
      return body.error ?? fallback;
    } catch {
      return fallback;
    }
  }

  async function addSection(e: React.FormEvent) {
    e.preventDefault();
    if (!newLabel.trim()) return;
    const res = await fetch("/api/admin/mass-sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: newLabel }),
    });
    if (res.ok) {
      setNewLabel("");
      fetchSections();
      toast("Section added");
    } else {
      toast(await errorMessage(res, "Failed to add section"), "error");
    }
  }

  async function updateSection(id: number, body: object, success?: string) {
    const res = await fetch(`/api/admin/mass-sections/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      fetchSections();
      if (success) toast(success);
      return true;
    }
    toast(await errorMessage(res, "Failed to save"), "error");
    return false;
  }

  async function saveLabel(id: number) {
    if (await updateSection(id, { label: editLabel }, "Section renamed")) {
      setEditingId(null);
    }
  }

  async function removeSection(section: MassSection) {
    if (!confirm(`Delete ${section.label}?`)) return;
    const res = await fetch(`/api/admin/mass-sections/${section.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      fetchSections();
      toast("Section deleted");
    } else {
      toast(await errorMessage(res, "Failed to delete"), "error");
    }
  }

  if (loading) return <p className="text-text-muted">Loading...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-text mb-1">Mass Sections</h1>
      <p className="text-sm text-text-muted mb-6">
        The parts of the Mass that program songs are filed under, in the order
        they appear on a program.
      </p>

      <form onSubmit={addSection} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="New section, e.g. Pater Noster"
          className="flex-1 px-3 py-2 bg-background border border-border rounded text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <button
          type="submit"
          disabled={!newLabel.trim()}
          className="inline-flex items-center gap-1 px-3 py-2 bg-primary text-obsidian font-semibold rounded text-sm hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </form>

      <p className="text-xs text-text-muted mb-2">
        New sections go to the end. Use the arrows to move them into place.
      </p>

      <ol className="bg-surface border border-border rounded-lg divide-y divide-border/50">
        {sections.map((section, index) => (
          <li key={section.id} className="flex items-center gap-2 px-4 py-2">
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => updateSection(section.id, { move: "up" })}
                disabled={index === 0}
                className="text-text-muted hover:text-primary disabled:opacity-20 transition-colors"
                title="Move up"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => updateSection(section.id, { move: "down" })}
                disabled={index === sections.length - 1}
                className="text-text-muted hover:text-primary disabled:opacity-20 transition-colors"
                title="Move down"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
            </div>

            {editingId === section.id ? (
              <>
                <input
                  type="text"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveLabel(section.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  className="flex-1 px-2 py-1 bg-background border border-border rounded text-text text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
                <button
                  type="button"
                  onClick={() => saveLabel(section.id)}
                  className="p-1 text-primary"
                  title="Save"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="p-1 text-text-muted hover:text-text"
                  title="Cancel"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm text-text">
                  {section.label}
                </span>
                <span className="text-xs text-text-muted">
                  {section.songCount} song{section.songCount === 1 ? "" : "s"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(section.id);
                    setEditLabel(section.label);
                  }}
                  className="p-1 text-text-muted hover:text-primary transition-colors"
                  title="Rename"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeSection(section)}
                  disabled={section.songCount > 0}
                  className="p-1 text-text-muted hover:text-red-400 disabled:opacity-20 disabled:hover:text-text-muted transition-colors"
                  title={
                    section.songCount > 0
                      ? "Move its songs to another section before deleting"
                      : "Delete"
                  }
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
