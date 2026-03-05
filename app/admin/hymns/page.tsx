"use client";

import { Heart, Plus, Search, Star } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/admin/toast";

interface Hymn {
  id: number;
  title: string;
  composer: string | null;
  hymnal: string | null;
  tags: { tag: string }[];
}

function hasTag(hymn: Hymn, tag: string): boolean {
  return hymn.tags.some((t) => t.tag === tag);
}

export default function AdminHymnsPage() {
  const { toast } = useToast();
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

  async function toggleFlag(id: number, flag: "favourite" | "wedding") {
    const res = await fetch(`/api/admin/hymns/${id}/${flag}`, {
      method: "PATCH",
    });
    if (res.ok) {
      const data = await res.json();
      const isNowSet = flag === "favourite" ? data.isFavourite : data.isWedding;
      setHymns((prev) =>
        prev.map((h) => {
          if (h.id !== id) return h;
          const filtered = h.tags.filter((t) => t.tag !== flag);
          return {
            ...h,
            tags: isNowSet ? [...filtered, { tag: flag }] : filtered,
          };
        }),
      );
      toast(isNowSet ? `Marked as ${flag}` : `Removed ${flag}`);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setOffset(0);
    fetchHymns();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Hymns</h1>
        <Link
          href="/admin/hymns/new"
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary text-obsidian font-semibold rounded text-sm hover:bg-primary-dark transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Hymn
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hymns..."
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
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton items
              key={i}
              className="h-12 bg-surface border border-border rounded animate-pulse"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-elevated">
                  <th className="text-left p-3 font-medium text-text-muted">
                    Title
                  </th>
                  <th className="text-left p-3 font-medium text-text-muted hidden sm:table-cell">
                    Composer
                  </th>
                  <th className="text-left p-3 font-medium text-text-muted hidden md:table-cell">
                    Tags
                  </th>
                  <th className="text-center p-3 font-medium text-text-muted w-16">
                    Fav
                  </th>
                  <th className="text-center p-3 font-medium text-text-muted w-16">
                    Wed
                  </th>
                </tr>
              </thead>
              <tbody>
                {hymns.map((hymn) => {
                  const displayTags = hymn.tags.filter(
                    (t) => t.tag !== "favourite" && t.tag !== "wedding",
                  );
                  return (
                    <tr
                      key={hymn.id}
                      className="border-b border-border/50 hover:bg-surface-elevated/50 transition-colors"
                    >
                      <td className="p-3">
                        <Link
                          href={`/admin/hymns/${hymn.id}`}
                          className="text-text hover:text-primary transition-colors"
                        >
                          {hymn.title}
                        </Link>
                        {hymn.hymnal && (
                          <span className="text-xs text-text-muted ml-2">
                            ({hymn.hymnal})
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-text-muted hidden sm:table-cell">
                        {hymn.composer || "\u2014"}
                      </td>
                      <td className="p-3 text-text-muted hidden md:table-cell">
                        {displayTags.length > 0
                          ? displayTags.map((t) => (
                              <span
                                key={t.tag}
                                className="inline-block bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded mr-1 mb-0.5"
                              >
                                {t.tag}
                              </span>
                            ))
                          : "\u2014"}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleFlag(hymn.id, "favourite")}
                          className={`p-1 rounded transition-colors ${
                            hasTag(hymn, "favourite")
                              ? "text-primary"
                              : "text-text-muted hover:text-primary"
                          }`}
                          title="Toggle favourite"
                        >
                          <Star
                            className="h-4 w-4"
                            fill={
                              hasTag(hymn, "favourite")
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleFlag(hymn.id, "wedding")}
                          className={`p-1 rounded transition-colors ${
                            hasTag(hymn, "wedding")
                              ? "text-pink-400"
                              : "text-text-muted hover:text-pink-400"
                          }`}
                          title="Toggle wedding"
                        >
                          <Heart
                            className="h-4 w-4"
                            fill={
                              hasTag(hymn, "wedding") ? "currentColor" : "none"
                            }
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {hymns.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-text-muted">
                      No hymns found
                    </td>
                  </tr>
                )}
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
              Showing {offset + 1}&ndash;{offset + hymns.length}
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
