"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";

interface HymnDetail {
  id: string;
  title: string;
  composer: string | null;
  tradition: string | null;
  language: string | null;
  hymnal: string | null;
  hymnNumber: string | null;
  hymnPage: string | null;
  isFavourite: boolean;
  isWedding: boolean;
  verses: {
    id: string;
    verseNumber: number;
    verseText: string;
    isChorus: boolean;
  }[];
}

export default function AdminHymnDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [hymn, setHymn] = useState<HymnDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/hymns/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then(setHymn)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-text-muted">Loading…</p>;
  if (!hymn) return <p className="text-text-muted">Hymn not found</p>;

  return (
    <div>
      <Link
        href="/admin/hymns"
        className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Hymns
      </Link>

      <h1 className="text-2xl font-bold text-text mb-1">{hymn.title}</h1>
      {hymn.composer && <p className="text-text-muted mb-4">{hymn.composer}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Detail label="Tradition" value={hymn.tradition} />
        <Detail label="Language" value={hymn.language} />
        <Detail label="Hymnal" value={hymn.hymnal} />
        <Detail label="Number" value={hymn.hymnNumber} />
        <Detail label="Page" value={hymn.hymnPage} />
        <Detail label="Favourite" value={hymn.isFavourite ? "Yes" : "No"} />
        <Detail label="Wedding" value={hymn.isWedding ? "Yes" : "No"} />
      </div>

      <h2 className="text-lg font-semibold text-text mb-3">
        Verses ({hymn.verses.length})
      </h2>
      {hymn.verses.length === 0 ? (
        <p className="text-text-muted text-sm">No verses recorded</p>
      ) : (
        <div className="space-y-3">
          {hymn.verses.map((verse) => (
            <div
              key={verse.id}
              className="bg-surface border border-border rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-text-muted">
                  {verse.isChorus ? "Chorus" : `Verse ${verse.verseNumber}`}
                </span>
              </div>
              <p className="text-text text-sm whitespace-pre-line leading-relaxed">
                {verse.verseText}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <p className="text-xs text-text-muted">{label}</p>
      <p className="text-sm text-text">{value || "—"}</p>
    </div>
  );
}
