"use client";

import {
  ArrowLeft,
  Check,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/admin/toast";

interface ProgramSong {
  id: number;
  massSection: string;
  sortOrder: number;
  lyricsOverride: string | null;
  hymnId: number;
  hymnTitle: string;
  hymnComposer: string | null;
  hymnTradition: string | null;
}

interface MassProgram {
  id: number;
  date: string;
  title: string | null;
  songs: ProgramSong[];
}

interface SearchHymn {
  id: number;
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

const SECTION_LABELS: Record<string, string> = {
  prelude: "Prelude",
  introit: "Introit",
  kyrie: "Kyrie",
  gloria: "Gloria",
  responsorial: "Responsorial Psalm",
  alleluia: "Alleluia",
  offertory: "Offertory",
  sanctus: "Sanctus",
  "mysterium-fidei": "Mysterium Fidei",
  amen: "Amen",
  "agnus-dei": "Agnus Dei",
  communion: "Communion",
  recessional: "Recessional",
  reprise: "Reprise",
};

export default function AdminMassProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { toast } = useToast();
  const [program, setProgram] = useState<MassProgram | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit program metadata
  const [editingMeta, setEditingMeta] = useState(false);
  const [editDate, setEditDate] = useState("");
  const [editTitle, setEditTitle] = useState("");

  // Add song form state
  const [addingSection, setAddingSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchHymn[]>([]);

  // Lyrics override editing
  const [editingLyricsId, setEditingLyricsId] = useState<number | null>(null);
  const [lyricsText, setLyricsText] = useState("");

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

  async function addSong(hymnId: number, section: string) {
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
      toast("Song added");
    }
  }

  async function removeSong(songId: number) {
    if (!confirm("Remove this song?")) return;
    const res = await fetch(
      `/api/admin/mass-programs/${id}/songs?songId=${songId}`,
      { method: "DELETE" },
    );
    if (res.ok) {
      fetchProgram();
      toast("Song removed");
    }
  }

  async function saveMeta() {
    const res = await fetch(`/api/admin/mass-programs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: editDate, title: editTitle || null }),
    });
    if (res.ok) {
      setEditingMeta(false);
      fetchProgram();
      toast("Program updated");
    } else {
      toast("Failed to save", "error");
    }
  }

  async function saveLyricsOverride(songId: number) {
    const res = await fetch(`/api/admin/mass-programs/${id}/songs`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        songId,
        lyricsOverride: lyricsText || null,
      }),
    });
    if (res.ok) {
      setEditingLyricsId(null);
      fetchProgram();
      toast("Lyrics override saved");
    } else {
      toast("Failed to save lyrics", "error");
    }
  }

  if (loading) return <p className="text-text-muted">Loading...</p>;
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

      {/* Program Header */}
      {editingMeta ? (
        <div className="bg-surface border border-border rounded-lg p-4 mb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-xs text-text-muted mb-1">Date</span>
              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </label>
            <label className="block">
              <span className="block text-xs text-text-muted mb-1">Title</span>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="e.g. 4th Sunday of Lent"
                className="w-full px-3 py-2 bg-background border border-border rounded text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </label>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={saveMeta}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-obsidian font-semibold rounded text-sm hover:bg-primary-dark transition-colors"
            >
              <Save className="h-3.5 w-3.5" />
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditingMeta(false)}
              className="px-3 py-1.5 border border-border text-text-muted rounded text-sm hover:text-text transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text mb-1">
              {program.date}
            </h1>
            {program.title && (
              <p className="text-text-muted">{program.title}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setEditDate(program.date);
              setEditTitle(program.title ?? "");
              setEditingMeta(true);
            }}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border border-border text-text-muted rounded hover:text-text hover:border-text-muted transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
        </div>
      )}

      {/* Sections */}
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
                  {SECTION_LABELS[section] ?? section}
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
                  className="border-b border-border/30 last:border-b-0 py-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Link
                        href={`/admin/hymns/${song.hymnId}`}
                        className="text-sm text-text hover:text-primary transition-colors"
                      >
                        {song.hymnTitle}
                      </Link>
                      {song.hymnComposer && (
                        <span className="text-xs text-text-muted ml-2">
                          {song.hymnComposer}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingLyricsId(
                            editingLyricsId === song.id ? null : song.id,
                          );
                          setLyricsText(song.lyricsOverride ?? "");
                        }}
                        className={`p-1 rounded transition-colors ${
                          song.lyricsOverride
                            ? "text-primary"
                            : "text-text-muted hover:text-primary"
                        }`}
                        title="Edit lyrics override"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSong(song.id)}
                        className="p-1 text-text-muted hover:text-red-400 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Lyrics override display/edit */}
                  {editingLyricsId === song.id && (
                    <div className="mt-2 space-y-2">
                      <textarea
                        value={lyricsText}
                        onChange={(e) => setLyricsText(e.target.value)}
                        rows={3}
                        placeholder="Lyrics override (optional, overrides hymn verses)"
                        className="w-full px-3 py-2 bg-background border border-border rounded text-text text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => saveLyricsOverride(song.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-obsidian font-semibold rounded text-xs hover:bg-primary-dark transition-colors"
                        >
                          <Check className="h-3 w-3" />
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingLyricsId(null)}
                          className="px-2 py-1 border border-border text-text-muted rounded text-xs hover:text-text transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  {!editingLyricsId && song.lyricsOverride && (
                    <p className="mt-1 text-xs text-text-muted italic truncate">
                      Override: {song.lyricsOverride}
                    </p>
                  )}
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
                      placeholder="Search hymns..."
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
                              &mdash; {hymn.composer}
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
