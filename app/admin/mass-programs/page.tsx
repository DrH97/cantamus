"use client";

import { Calendar, ExternalLink, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/admin/toast";

interface MassProgram {
  id: number;
  date: string;
  title: string | null;
}

function formatDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminMassProgramsPage() {
  const { toast } = useToast();
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
      toast("Program created");
    } else {
      toast("Failed to create program", "error");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this mass program?")) return;
    const res = await fetch(`/api/admin/mass-programs/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      fetchPrograms();
      toast("Program deleted");
    }
  }

  const today = new Date().toISOString().split("T")[0];
  const upcoming = programs.filter((p) => p.date >= today);
  const past = programs.filter((p) => p.date < today);

  if (loading) return <p className="text-text-muted">Loading...</p>;

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

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
            Upcoming ({upcoming.length})
          </h2>
          <div className="space-y-2">
            {upcoming.map((prog) => (
              <ProgramRow
                key={prog.id}
                prog={prog}
                onDelete={handleDelete}
                isUpcoming
              />
            ))}
          </div>
        </div>
      )}

      {/* Past */}
      {past.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
            Past ({past.length})
          </h2>
          <div className="space-y-2">
            {past.map((prog) => (
              <ProgramRow
                key={prog.id}
                prog={prog}
                onDelete={handleDelete}
                isUpcoming={false}
              />
            ))}
          </div>
        </div>
      )}

      {programs.length === 0 && (
        <p className="text-text-muted text-sm">No mass programs yet</p>
      )}
    </div>
  );
}

function ProgramRow({
  prog,
  onDelete,
  isUpcoming,
}: {
  prog: MassProgram;
  onDelete: (id: number) => void;
  isUpcoming: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between bg-surface border rounded-lg p-4 ${
        isUpcoming ? "border-primary/20" : "border-border"
      }`}
    >
      <div className="flex items-center gap-3">
        <Calendar
          className={`h-5 w-5 ${
            isUpcoming ? "text-primary" : "text-text-muted"
          }`}
        />
        <div>
          <Link
            href={`/admin/mass-programs/${prog.id}`}
            className="font-medium text-text hover:text-primary transition-colors"
          >
            {formatDate(prog.date)}
          </Link>
          {prog.title && (
            <p className="text-sm text-text-muted">{prog.title}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={`/events/${prog.date}`}
          className="p-1 text-text-muted hover:text-primary transition-colors"
          title="View public page"
        >
          <ExternalLink className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={() => onDelete(prog.id)}
          className="p-1 text-text-muted hover:text-red-400 transition-colors"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
