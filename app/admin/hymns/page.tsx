"use client";

import { Heart, Search, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface Hymn {
  id: string;
  title: string;
  composer: string | null;
  tradition: string | null;
  hymnal: string | null;
  isFavourite: boolean;
  isWedding: boolean;
}

export default function AdminHymnsPage() {
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 50;

  const fetchHymns = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
    });
    if (query) params.set("q", query);
    const res = await fetch(`/api/admin/hymns?${params}`);
    if (res.ok) {
      setHymns(await res.json());
    }
    setLoading(false);
  }, [query, offset]);

  useEffect(() => {
    fetchHymns();
  }, [fetchHymns]);

  async function toggleFlag(id: string, flag: "favourite" | "wedding") {
    const res = await fetch(`/api/admin/hymns/${id}/${flag}`, {
      method: "PATCH",
    });
    if (res.ok) {
      const data = await res.json();
      setHymns((prev) =>
        prev.map((h) =>
          h.id === id
            ? {
                ...h,
                ...(flag === "favourite"
                  ? { isFavourite: data.isFavourite }
                  : { isWedding: data.isWedding }),
              }
            : h,
        ),
      );
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setOffset(0);
    fetchHymns();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text mb-6">Hymns</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hymns…"
            className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-obsidian font-semibold rounded text-sm hover:bg-primary-dark transition-colors"
        >
          Search
        </button>
      </form>

      {loading ? (
        <p className="text-text-muted">Loading…</p>
      ) : (
        <>
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-elevated">
                  <th className="text-left p-3 font-medium text-text-muted">
                    Title
                  </th>
                  <th className="text-left p-3 font-medium text-text-muted">
                    Composer
                  </th>
                  <th className="text-left p-3 font-medium text-text-muted">
                    Hymnal
                  </th>
                  <th className="text-center p-3 font-medium text-text-muted w-20">
                    Fav
                  </th>
                  <th className="text-center p-3 font-medium text-text-muted w-20">
                    Wedding
                  </th>
                </tr>
              </thead>
              <tbody>
                {hymns.map((hymn) => (
                  <tr
                    key={hymn.id}
                    className="border-b border-border/50 hover:bg-surface-elevated/50"
                  >
                    <td className="p-3 text-text">
                      <a
                        href={`/admin/hymns/${hymn.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {hymn.title}
                      </a>
                    </td>
                    <td className="p-3 text-text-muted">
                      {hymn.composer || "—"}
                    </td>
                    <td className="p-3 text-text-muted">
                      {hymn.hymnal || "—"}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => toggleFlag(hymn.id, "favourite")}
                        className={`p-1 rounded transition-colors ${
                          hymn.isFavourite
                            ? "text-primary"
                            : "text-text-muted hover:text-primary"
                        }`}
                        title="Toggle favourite"
                      >
                        <Star
                          className="h-4 w-4"
                          fill={hymn.isFavourite ? "currentColor" : "none"}
                        />
                      </button>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => toggleFlag(hymn.id, "wedding")}
                        className={`p-1 rounded transition-colors ${
                          hymn.isWedding
                            ? "text-pink-400"
                            : "text-text-muted hover:text-pink-400"
                        }`}
                        title="Toggle wedding"
                      >
                        <Heart
                          className="h-4 w-4"
                          fill={hymn.isWedding ? "currentColor" : "none"}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              onClick={() => setOffset(Math.max(0, offset - limit))}
              disabled={offset === 0}
              className="px-3 py-1 text-sm border border-border rounded text-text-muted hover:text-text disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-text-muted">
              Showing {offset + 1}–{offset + hymns.length}
            </span>
            <button
              type="button"
              onClick={() => setOffset(offset + limit)}
              disabled={hymns.length < limit}
              className="px-3 py-1 text-sm border border-border rounded text-text-muted hover:text-text disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
