"use client";

import { Heart, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface Hymn {
  id: number;
  title: string;
  composer: string | null;
  tags: { tag: string }[];
}

function hasTag(hymn: Hymn, tag: string): boolean {
  return hymn.tags.some((t) => t.tag === tag);
}

export default function AdminWeddingPage() {
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchHymns = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "200" });
    if (query) params.set("q", query);
    const res = await fetch(`/api/admin/hymns?${params}`);
    if (res.ok) {
      const all: Hymn[] = await res.json();
      all.sort((a, b) => {
        const aWedding = hasTag(a, "wedding");
        const bWedding = hasTag(b, "wedding");
        if (aWedding && !bWedding) return -1;
        if (!aWedding && bWedding) return 1;
        return a.title.localeCompare(b.title);
      });
      setHymns(all);
    }
    setLoading(false);
  }, [query]);

  useEffect(() => {
    fetchHymns();
  }, [fetchHymns]);

  async function toggleWedding(id: number) {
    const res = await fetch(`/api/admin/hymns/${id}/wedding`, {
      method: "PATCH",
    });
    if (res.ok) {
      const data = await res.json();
      setHymns((prev) =>
        prev.map((h) => {
          if (h.id !== id) return h;
          const filtered = h.tags.filter((t) => t.tag !== "wedding");
          return {
            ...h,
            tags: data.isWedding ? [...filtered, { tag: "wedding" }] : filtered,
          };
        }),
      );
    }
  }

  const weddingCount = hymns.filter((h) => hasTag(h, "wedding")).length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-text mb-1">Wedding Repertoire</h1>
      <p className="text-sm text-text-muted mb-6">
        {weddingCount} hymns marked for weddings
      </p>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search hymns…"
          className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {loading ? (
        <p className="text-text-muted">Loading…</p>
      ) : (
        <div className="space-y-1">
          {hymns.map((hymn) => {
            const isWedding = hasTag(hymn, "wedding");
            return (
              <div
                key={hymn.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  isWedding
                    ? "bg-pink-950/20 border-pink-500/30"
                    : "bg-surface border-border"
                }`}
              >
                <div>
                  <span className="text-sm text-text">{hymn.title}</span>
                  {hymn.composer && (
                    <span className="text-xs text-text-muted ml-2">
                      {hymn.composer}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => toggleWedding(hymn.id)}
                  className={`p-1 rounded transition-colors ${
                    isWedding
                      ? "text-pink-400"
                      : "text-text-muted hover:text-pink-400"
                  }`}
                  title={isWedding ? "Remove from wedding" : "Add to wedding"}
                >
                  <Heart
                    className="h-4 w-4"
                    fill={isWedding ? "currentColor" : "none"}
                  />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
