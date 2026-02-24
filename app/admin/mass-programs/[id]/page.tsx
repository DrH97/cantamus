"use client";

import { ArrowLeft, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";

interface ProgramSong {
  id: string;
  massSection: string;
  sortOrder: number;
  lyricsOverride: string | null;
  hymnId: string;
  hymnTitle: string;
  hymnComposer: string | null;
  hymnTradition: string | null;
}

interface MassProgram {
  id: string;
  date: string;
  title: string | null;
  songs: ProgramSong[];
}

interface SearchHymn {
  id: string;
  title: string;
  composer: string | null;
}

const MASS_SECTIONS = [
  "prelude",
  "introit",
  "kyrie",
  "gloria",
  "responsorial",
  "alleluia",
  "offertory",
  "sanctus",
  "mysterium-fidei",
  "amen",
  "agnus-dei",
  "communion",
  "recessional",
  "reprise",
];

export default function AdminMassProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [program, setProgram] = useState<MassProgram | null>(null);
  const [loading, setLoading] = useState(true);

  // Add song form state
  const [addingSection, setAddingSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchHymn[]>([]);

  const fetchProgram = useCallback(async () => {
    const res = await fetch(`/api/admin/mass-programs/${id}`);
    if (res.ok) setProgram(await res.json());
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchProgram();
  }, [fetchProgram]);

  async function searchHymns(q: string) {
    if (!q) {
      setSearchResults([]);
      return;
    }
    const res = await fetch(
      `/api/admin/hymns?q=${encodeURIComponent(q)}&limit=10`,
    );
    if (res.ok) setSearchResults(await res.json());
  }

  async function addSong(hymnId: string, section: string) {
    const currentSongs = program?.songs.filter(
      (s) => s.massSection === section,
    );
    const sortOrder = currentSongs?.length ?? 0;

    const res = await fetch(`/api/admin/mass-programs/${id}/songs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hymnId, massSection: section, sortOrder }),
    });
    if (res.ok) {
      setAddingSection(null);
      setSearchQuery("");
      setSearchResults([]);
      fetchProgram();
    }
  }

  async function removeSong(songId: string) {
    const res = await fetch(
      `/api/admin/mass-programs/${id}/songs?songId=${songId}`,
      { method: "DELETE" },
    );
    if (res.ok) fetchProgram();
  }

  if (loading) return <p className="text-text-muted">Loading…</p>;
  if (!program) return <p className="text-text-muted">Program not found</p>;

  return (
    <div>
      <Link
        href="/admin/mass-programs"
        className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Programs
      </Link>

      <h1 className="text-2xl font-bold text-text mb-1">{program.date}</h1>
      {program.title && <p className="text-text-muted mb-6">{program.title}</p>}

      <div className="space-y-4">
        {MASS_SECTIONS.map((section) => {
          const sectionSongs = program.songs.filter(
            (s) => s.massSection === section,
          );

          return (
            <div
              key={section}
              className="bg-surface border border-border rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
                  {section.replace("-", " ")}
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    setAddingSection(addingSection === section ? null : section)
                  }
                  className="text-text-muted hover:text-primary transition-colors"
                  title="Add song"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {sectionSongs.length === 0 && addingSection !== section && (
                <p className="text-xs text-text-muted">No songs assigned</p>
              )}

              {sectionSongs.map((song) => (
                <div
                  key={song.id}
                  className="flex items-center justify-between py-1.5"
                >
                  <div>
                    <span className="text-sm text-text">{song.hymnTitle}</span>
                    {song.hymnComposer && (
                      <span className="text-xs text-text-muted ml-2">
                        {song.hymnComposer}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSong(song.id)}
                    className="text-text-muted hover:text-red-400 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              {addingSection === section && (
                <div className="mt-2 border-t border-border/50 pt-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        searchHymns(e.target.value);
                      }}
                      placeholder="Search hymns…"
                      className="w-full pl-8 pr-3 py-1.5 bg-background border border-border rounded text-text text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                  {searchResults.length > 0 && (
                    <div className="mt-1 border border-border rounded bg-background max-h-40 overflow-y-auto">
                      {searchResults.map((hymn) => (
                        <button
                          type="button"
                          key={hymn.id}
                          onClick={() => addSong(hymn.id, section)}
                          className="w-full text-left px-3 py-1.5 text-sm text-text hover:bg-surface-elevated transition-colors"
                        >
                          {hymn.title}
                          {hymn.composer && (
                            <span className="text-text-muted ml-1 text-xs">
                              — {hymn.composer}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
