"use client";

import { Crown, Mic2, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface Artist {
  id: number;
  name: string;
  voicePart: string | null;
  instrument: string | null;
  isConductor: boolean;
  isCORMember: boolean;
}

const voicePartLabels: Record<string, string> = {
  soprano: "Soprano",
  alto: "Alto",
  tenor: "Tenor",
  bass: "Bass",
  instrumentalist: "Instrumentalist",
};

export default function AdminArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 50;

  const fetchArtists = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
    });
    if (query) params.set("q", query);
    const res = await fetch(`/api/admin/artists?${params}`);
    if (res.ok) {
      setArtists(await res.json());
    }
    setLoading(false);
  }, [query, offset]);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setOffset(0);
    fetchArtists();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Artists</h1>
        <Link
          href="/admin/artists/new"
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary text-obsidian font-semibold rounded text-sm hover:bg-primary-dark transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Artist
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search artists..."
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
                    Name
                  </th>
                  <th className="text-left p-3 font-medium text-text-muted hidden sm:table-cell">
                    Voice Part
                  </th>
                  <th className="text-left p-3 font-medium text-text-muted hidden md:table-cell">
                    Roles
                  </th>
                </tr>
              </thead>
              <tbody>
                {artists.map((artist) => (
                  <tr
                    key={artist.id}
                    className="border-b border-border/50 hover:bg-surface-elevated/50 transition-colors"
                  >
                    <td className="p-3">
                      <Link
                        href={`/admin/artists/${artist.id}`}
                        className="text-text hover:text-primary transition-colors"
                      >
                        {artist.name}
                      </Link>
                    </td>
                    <td className="p-3 text-text-muted hidden sm:table-cell">
                      {artist.voicePart
                        ? (voicePartLabels[artist.voicePart] ??
                          artist.voicePart)
                        : "\u2014"}
                      {artist.instrument && (
                        <span className="text-xs text-text-muted ml-1">
                          ({artist.instrument})
                        </span>
                      )}
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      <div className="flex gap-1">
                        {artist.isCORMember && (
                          <span className="inline-flex items-center gap-0.5 bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded">
                            <Crown className="h-3 w-3" />
                            COR
                          </span>
                        )}
                        {artist.isConductor && (
                          <span className="inline-flex items-center gap-0.5 bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded">
                            <Mic2 className="h-3 w-3" />
                            Conductor
                          </span>
                        )}
                        {!artist.isCORMember && !artist.isConductor && (
                          <span className="text-text-muted">&mdash;</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {artists.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-text-muted">
                      No artists found
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
              Showing {offset + 1}&ndash;{offset + artists.length}
            </span>
            <button
              type="button"
              onClick={() => setOffset(offset + limit)}
              disabled={artists.length < limit}
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
