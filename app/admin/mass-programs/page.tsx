"use client";

import { Calendar, Plus } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface MassProgram {
  id: string;
  date: string;
  title: string | null;
}

export default function AdminMassProgramsPage() {
  const [programs, setPrograms] = useState<MassProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchPrograms = useCallback(async () => {
    const res = await fetch("/api/admin/mass-programs");
    if (res.ok) setPrograms(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/mass-programs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: form.get("date"),
        title: form.get("title") || undefined,
      }),
    });
    if (res.ok) {
      setShowForm(false);
      fetchPrograms();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this mass program?")) return;
    const res = await fetch(`/api/admin/mass-programs/${id}`, {
      method: "DELETE",
    });
    if (res.ok) fetchPrograms();
  }

  if (loading) return <p className="text-text-muted">Loading…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Mass Programs</h1>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1 px-3 py-2 bg-primary text-obsidian font-semibold rounded text-sm hover:bg-primary-dark transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Program
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-surface border border-border rounded-lg p-4 mb-6 flex flex-wrap gap-3 items-end"
        >
          <div>
            <label
              htmlFor="date"
              className="block text-xs text-text-muted mb-1"
            >
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              required
              className="px-3 py-2 bg-background border border-border rounded text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label
              htmlFor="title"
              className="block text-xs text-text-muted mb-1"
            >
              Title (optional)
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. 3rd Sunday Ordinary Time"
              className="px-3 py-2 bg-background border border-border rounded text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-obsidian font-semibold rounded text-sm hover:bg-primary-dark transition-colors"
          >
            Create
          </button>
        </form>
      )}

      <div className="space-y-2">
        {programs.map((prog) => (
          <div
            key={prog.id}
            className="flex items-center justify-between bg-surface border border-border rounded-lg p-4"
          >
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <Link
                  href={`/admin/mass-programs/${prog.id}`}
                  className="font-medium text-text hover:text-primary transition-colors"
                >
                  {prog.date}
                </Link>
                {prog.title && (
                  <p className="text-sm text-text-muted">{prog.title}</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(prog.id)}
              className="text-xs text-text-muted hover:text-red-400 transition-colors"
            >
              Delete
            </button>
          </div>
        ))}
        {programs.length === 0 && (
          <p className="text-text-muted text-sm">No mass programs yet</p>
        )}
      </div>
    </div>
  );
}
