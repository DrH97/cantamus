"use client";

import {
  AlertTriangle,
  Calendar,
  Heart,
  Mic,
  Music,
  Plus,
  Star,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface DashboardData {
  stats: {
    hymnCount: number;
    favouriteCount: number;
    weddingCount: number;
    programCount: number;
    artistCount: number;
    hymnsWithoutVerses: number;
    hymnsWithoutTags: number;
  };
  recentHymns: {
    id: number;
    title: string;
    composer: string | null;
    updatedAt: string;
    tags: { tag: string }[];
  }[];
  tagDistribution: { tag: string; count: number }[];
  upcomingPrograms: { id: number; date: string; title: string | null }[];
  recentPrograms: { id: number; date: string; title: string | null }[];
}

function formatDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function DashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => (res.ok ? res.json() : null))
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-text">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton items
              key={i}
              className="bg-surface border border-border rounded-lg p-5 animate-pulse"
            >
              <div className="h-4 bg-border rounded w-20 mb-2" />
              <div className="h-8 bg-border rounded w-12" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return <p className="text-text-muted">Failed to load dashboard</p>;

  const { stats } = data;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Dashboard</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/hymns/new"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary text-obsidian font-semibold rounded text-sm hover:bg-primary-dark transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Hymn
          </Link>
          <Link
            href="/admin/mass-programs"
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-border text-text-muted font-medium rounded text-sm hover:text-text hover:border-text-muted transition-colors"
          >
            <Calendar className="h-4 w-4" />
            New Program
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Hymns"
          value={stats.hymnCount}
          icon={<Music className="h-5 w-5" />}
          href="/admin/hymns"
        />
        <StatCard
          label="Favourites"
          value={stats.favouriteCount}
          icon={<Star className="h-5 w-5" />}
          color="text-primary"
        />
        <StatCard
          label="Wedding"
          value={stats.weddingCount}
          icon={<Heart className="h-5 w-5" />}
          color="text-pink-400"
          href="/admin/wedding"
        />
        <StatCard
          label="Artists"
          value={stats.artistCount}
          icon={<Mic className="h-5 w-5" />}
          href="/admin/artists"
        />
        <StatCard
          label="Mass Programs"
          value={stats.programCount}
          icon={<Calendar className="h-5 w-5" />}
          href="/admin/mass-programs"
        />
      </div>

      {/* Attention Needed */}
      {(stats.hymnsWithoutVerses > 0 || stats.hymnsWithoutTags > 0) && (
        <div className="bg-amber-950/30 border border-amber-700/30 rounded-lg p-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-amber-300 mb-3">
            <AlertTriangle className="h-4 w-4" />
            Needs Attention
          </h2>
          <div className="flex flex-wrap gap-4">
            {stats.hymnsWithoutVerses > 0 && (
              <div className="text-sm text-amber-200/80">
                <span className="font-medium text-amber-200">
                  {stats.hymnsWithoutVerses}
                </span>{" "}
                hymns without lyrics
              </div>
            )}
            {stats.hymnsWithoutTags > 0 && (
              <div className="text-sm text-amber-200/80">
                <span className="font-medium text-amber-200">
                  {stats.hymnsWithoutTags}
                </span>{" "}
                hymns without tags
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Programs */}
        <div className="bg-surface border border-border rounded-lg">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-semibold text-text">
              Upcoming Programs
            </h2>
          </div>
          <div className="p-2">
            {data.upcomingPrograms.length === 0 ? (
              <p className="text-sm text-text-muted p-2">
                No upcoming programs
              </p>
            ) : (
              data.upcomingPrograms.map((prog) => (
                <Link
                  key={prog.id}
                  href={`/admin/mass-programs/${prog.id}`}
                  className="flex items-center gap-3 p-2 rounded hover:bg-surface-elevated transition-colors"
                >
                  <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-text truncate">
                      {formatDate(prog.date)}
                    </p>
                    {prog.title && (
                      <p className="text-xs text-text-muted truncate">
                        {prog.title}
                      </p>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Programs */}
        <div className="bg-surface border border-border rounded-lg">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-semibold text-text">Recent Programs</h2>
          </div>
          <div className="p-2">
            {data.recentPrograms.length === 0 ? (
              <p className="text-sm text-text-muted p-2">No past programs</p>
            ) : (
              data.recentPrograms.map((prog) => (
                <Link
                  key={prog.id}
                  href={`/admin/mass-programs/${prog.id}`}
                  className="flex items-center gap-3 p-2 rounded hover:bg-surface-elevated transition-colors"
                >
                  <Calendar className="h-4 w-4 text-text-muted flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-text truncate">
                      {formatDate(prog.date)}
                    </p>
                    {prog.title && (
                      <p className="text-xs text-text-muted truncate">
                        {prog.title}
                      </p>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Tag Distribution */}
        <div className="bg-surface border border-border rounded-lg">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-semibold text-text flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </h2>
          </div>
          <div className="p-4">
            {data.tagDistribution.length === 0 ? (
              <p className="text-sm text-text-muted">No tags yet</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {data.tagDistribution.map((t) => (
                  <span
                    key={t.tag}
                    className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded"
                  >
                    {t.tag}
                    <span className="text-primary/60 font-medium">
                      {t.count}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recently Updated Hymns */}
        <div className="bg-surface border border-border rounded-lg">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text">
              Recently Updated
            </h2>
            <Link
              href="/admin/hymns"
              className="text-xs text-text-muted hover:text-primary transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="p-2">
            {data.recentHymns.map((hymn) => (
              <Link
                key={hymn.id}
                href={`/admin/hymns/${hymn.id}`}
                className="flex items-center justify-between p-2 rounded hover:bg-surface-elevated transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm text-text truncate">{hymn.title}</p>
                  {hymn.composer && (
                    <p className="text-xs text-text-muted truncate">
                      {hymn.composer}
                    </p>
                  )}
                </div>
                {hymn.tags.length > 0 && (
                  <div className="flex gap-1 flex-shrink-0 ml-2">
                    {hymn.tags.slice(0, 2).map((t) => (
                      <span
                        key={t.tag}
                        className="inline-block bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded"
                      >
                        {t.tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
  href,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color?: string;
  href?: string;
}) {
  const content = (
    <div className="bg-surface border border-border rounded-lg p-5 hover:border-primary/30 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-text-muted">{label}</p>
        <span className={color ?? "text-text-muted"}>{icon}</span>
      </div>
      <p className="text-3xl font-bold text-text">{value}</p>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
