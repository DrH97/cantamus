"use client";

import {
  ArrowLeft,
  ExternalLink,
  Pencil,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/admin/toast";

interface ArtistDetail {
  id: number;
  name: string;
  voicePart: string | null;
  instrument: string | null;
  isConductor: boolean;
  isCORMember: boolean;
  photoUrl: string | null;
  bio: string | null;
  website: string | null;
}

const voicePartLabels: Record<string, string> = {
  soprano: "Soprano",
  alto: "Alto",
  tenor: "Tenor",
  bass: "Bass",
  instrumentalist: "Instrumentalist",
};

export default function AdminArtistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [artist, setArtist] = useState<ArtistDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ArtistDetail>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fetchArtist = useCallback(() => {
    fetch(`/api/admin/artists/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then(setArtist)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchArtist();
  }, [fetchArtist]);

  function startEditing() {
    if (!artist) return;
    setEditForm({
      name: artist.name,
      voicePart: artist.voicePart,
      instrument: artist.instrument,
      isConductor: artist.isConductor,
      isCORMember: artist.isCORMember,
      bio: artist.bio,
      website: artist.website,
    });
    setEditing(true);
  }

  async function saveEdit() {
    setSaving(true);
    const res = await fetch(`/api/admin/artists/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      toast("Artist updated");
      setEditing(false);
      fetchArtist();
    } else {
      toast("Failed to save", "error");
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this artist? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/artists/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast("Artist deleted");
      router.push("/admin/artists");
    } else {
      toast("Failed to delete", "error");
    }
  }

  async function uploadPhoto(file: File) {
    if (!file) return;
    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast("Invalid file type. Allowed: PNG, JPEG, WebP", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast("File too large. Maximum 5 MB", "error");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`/api/admin/artists/${id}/photo`, {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      fetchArtist();
      toast("Photo uploaded");
    } else {
      const data = await res.json().catch(() => ({}));
      toast(data.error ?? "Upload failed", "error");
    }
    setUploading(false);
  }

  async function deletePhoto() {
    if (!confirm("Remove the photo?")) return;
    const res = await fetch(`/api/admin/artists/${id}/photo`, {
      method: "DELETE",
    });
    if (res.ok) {
      fetchArtist();
      toast("Photo removed");
    } else {
      toast("Failed to remove photo", "error");
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadPhoto(file);
  }

  if (loading) return <p className="text-text-muted">Loading...</p>;
  if (!artist) return <p className="text-text-muted">Artist not found</p>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/admin/artists"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Artists
        </Link>
        <div className="flex items-center gap-2">
          {!editing && (
            <button
              type="button"
              onClick={startEditing}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border border-border text-text-muted rounded hover:text-text hover:border-text-muted transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
          )}
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border border-red-800/50 text-red-400 rounded hover:bg-red-950/30 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>

      {editing ? (
        <div className="bg-surface border border-border rounded-lg p-5 space-y-4">
          <EditField
            label="Name"
            value={editForm.name ?? ""}
            onChange={(v) => setEditForm({ ...editForm, name: v })}
          />
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-xs text-text-muted mb-1">
                Voice Part
              </span>
              <select
                value={editForm.voicePart ?? ""}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    voicePart: e.target.value || null,
                  })
                }
                className="w-full px-3 py-2 bg-background border border-border rounded text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">None</option>
                <option value="soprano">Soprano</option>
                <option value="alto">Alto</option>
                <option value="tenor">Tenor</option>
                <option value="bass">Bass</option>
                <option value="instrumentalist">Instrumentalist</option>
              </select>
            </label>
            <EditField
              label="Instrument"
              value={editForm.instrument ?? ""}
              onChange={(v) =>
                setEditForm({ ...editForm, instrument: v || null })
              }
            />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-text-muted">
              <input
                type="checkbox"
                checked={editForm.isConductor ?? false}
                onChange={(e) =>
                  setEditForm({ ...editForm, isConductor: e.target.checked })
                }
                className="rounded"
              />
              Conductor
            </label>
            <label className="flex items-center gap-2 text-sm text-text-muted">
              <input
                type="checkbox"
                checked={editForm.isCORMember ?? false}
                onChange={(e) =>
                  setEditForm({ ...editForm, isCORMember: e.target.checked })
                }
                className="rounded"
              />
              COR Member
            </label>
          </div>
          <div>
            <span className="block text-xs text-text-muted mb-1">Bio</span>
            <textarea
              value={editForm.bio ?? ""}
              onChange={(e) =>
                setEditForm({ ...editForm, bio: e.target.value || null })
              }
              rows={4}
              className="w-full px-3 py-2 bg-background border border-border rounded text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <EditField
            label="Website"
            value={editForm.website ?? ""}
            onChange={(v) => setEditForm({ ...editForm, website: v || null })}
          />
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={saveEdit}
              disabled={saving}
              className="inline-flex items-center gap-1 px-4 py-2 bg-primary text-obsidian font-semibold rounded text-sm hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-4 py-2 border border-border text-text-muted rounded text-sm hover:text-text transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold text-text mb-1">{artist.name}</h1>

          <div className="flex flex-wrap gap-2 mb-4">
            {artist.isCORMember && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                COR Member
              </span>
            )}
            {artist.isConductor && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                Conductor
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <Detail
              label="Voice Part"
              value={
                artist.voicePart
                  ? (voicePartLabels[artist.voicePart] ?? artist.voicePart)
                  : null
              }
            />
            <Detail label="Instrument" value={artist.instrument} />
            <Detail label="ID" value={String(artist.id)} />
          </div>

          {artist.bio && (
            <div className="mb-4">
              <p className="text-xs text-text-muted mb-1">Bio</p>
              <p className="text-text text-sm whitespace-pre-line">
                {artist.bio}
              </p>
            </div>
          )}

          {artist.website && (
            <a
              href={artist.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-dark transition-colors mb-6"
            >
              <ExternalLink className="h-4 w-4" />
              Website
            </a>
          )}
        </div>
      )}

      {/* Photo Section */}
      <div className="bg-surface border border-border rounded-lg p-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text">Photo</h2>
          {artist.photoUrl && (
            <button
              type="button"
              onClick={deletePhoto}
              className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-red-400 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              Remove
            </button>
          )}
        </div>

        {artist.photoUrl ? (
          <div>
            {/* biome-ignore lint/performance/noImgElement: user upload, dimensions unknown */}
            <img
              src={artist.photoUrl}
              alt={artist.name}
              className="max-w-xs rounded border border-border"
            />
            <div className="mt-2">
              <label className="text-xs text-text-muted hover:text-primary transition-colors cursor-pointer">
                Replace photo
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadPhoto(f);
                  }}
                />
              </label>
            </div>
          </div>
        ) : (
          // biome-ignore lint/a11y/noStaticElementInteractions: drop zone for file upload
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-border hover:border-text-muted"
            }`}
          >
            {uploading ? (
              <p className="text-sm text-text-muted">Uploading...</p>
            ) : (
              <>
                <Upload className="h-8 w-8 text-text-muted mx-auto mb-2" />
                <p className="text-sm text-text-muted mb-1">
                  Drag & drop a photo here
                </p>
                <p className="text-xs text-text-muted mb-3">
                  PNG, JPEG, or WebP (max 5 MB)
                </p>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-obsidian font-semibold rounded text-sm hover:bg-primary-dark transition-colors cursor-pointer">
                  <Upload className="h-3.5 w-3.5" />
                  Choose File
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadPhoto(f);
                    }}
                  />
                </label>
              </>
            )}
          </div>
        )}
      </div>
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
      <p className="text-sm text-text">{value || "\u2014"}</p>
    </div>
  );
}

function EditField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="block text-xs text-text-muted mb-1">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-background border border-border rounded text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
    </label>
  );
}
