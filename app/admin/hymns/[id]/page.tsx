"use client";

import {
  ArrowLeft,
  Check,
  ExternalLink,
  FileText,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/admin/toast";

interface HymnDetail {
  id: number;
  title: string;
  composer: string | null;
  tradition: string | null;
  language: string | null;
  hymnal: string | null;
  link: string | null;
  scoreUrl: string | null;
  tags: { tag: string }[];
  verses: {
    id: number;
    verseNumber: number;
    verseText: string;
    isChorus: boolean;
    language: string;
  }[];
}

export default function AdminHymnDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [hymn, setHymn] = useState<HymnDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<HymnDetail>>({});
  const [saving, setSaving] = useState(false);
  const [newTag, setNewTag] = useState("");

  // Verse editing
  const [editingVerseId, setEditingVerseId] = useState<number | null>(null);
  const [editVerseForm, setEditVerseForm] = useState({
    verseNumber: 0,
    verseText: "",
    isChorus: false,
    language: "en",
  });
  const [addingVerse, setAddingVerse] = useState(false);
  const [newVerseForm, setNewVerseForm] = useState({
    verseNumber: 1,
    verseText: "",
    isChorus: false,
    language: "en",
  });

  // Score upload
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fetchHymn = useCallback(() => {
    fetch(`/api/admin/hymns/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then(setHymn)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchHymn();
  }, [fetchHymn]);

  function startEditing() {
    if (!hymn) return;
    setEditForm({
      title: hymn.title,
      composer: hymn.composer,
      tradition: hymn.tradition,
      language: hymn.language,
      hymnal: hymn.hymnal,
      link: hymn.link,
      scoreUrl: hymn.scoreUrl,
    });
    setEditing(true);
  }

  async function saveEdit() {
    setSaving(true);
    const res = await fetch(`/api/admin/hymns/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      toast("Hymn updated");
      setEditing(false);
      fetchHymn();
    } else {
      toast("Failed to save", "error");
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this hymn? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/hymns/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast("Hymn deleted");
      router.push("/admin/hymns");
    } else {
      toast("Failed to delete", "error");
    }
  }

  async function addTag() {
    const tag = newTag.trim().toLowerCase();
    if (!tag) return;
    const res = await fetch(`/api/admin/hymns/${id}/tags`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag }),
    });
    if (res.ok) {
      setNewTag("");
      fetchHymn();
      toast("Tag added");
    }
  }

  async function removeTag(tag: string) {
    const res = await fetch(
      `/api/admin/hymns/${id}/tags?tag=${encodeURIComponent(tag)}`,
      { method: "DELETE" },
    );
    if (res.ok) {
      fetchHymn();
      toast("Tag removed");
    }
  }

  async function saveVerse() {
    if (editingVerseId === null) return;
    const res = await fetch(`/api/admin/hymns/${id}/verses`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingVerseId, ...editVerseForm }),
    });
    if (res.ok) {
      setEditingVerseId(null);
      fetchHymn();
      toast("Verse updated");
    } else {
      toast("Failed to save verse", "error");
    }
  }

  async function deleteVerse(verseId: number) {
    if (!confirm("Delete this verse?")) return;
    const res = await fetch(
      `/api/admin/hymns/${id}/verses?verseId=${verseId}`,
      { method: "DELETE" },
    );
    if (res.ok) {
      fetchHymn();
      toast("Verse deleted");
    }
  }

  async function addNewVerse() {
    if (!newVerseForm.verseText.trim()) return;
    const res = await fetch(`/api/admin/hymns/${id}/verses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newVerseForm),
    });
    if (res.ok) {
      setAddingVerse(false);
      setNewVerseForm({
        verseNumber: 1,
        verseText: "",
        isChorus: false,
        language: "en",
      });
      fetchHymn();
      toast("Verse added");
    } else {
      toast("Failed to add verse", "error");
    }
  }

  async function uploadScore(file: File) {
    if (!file) return;
    const allowed = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/webp",
    ];
    if (!allowed.includes(file.type)) {
      toast("Invalid file type. Allowed: PDF, PNG, JPEG, WebP", "error");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast("File too large. Maximum 10 MB", "error");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`/api/admin/hymns/${id}/score`, {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      fetchHymn();
      toast("Score uploaded");
    } else {
      const data = await res.json().catch(() => ({}));
      toast(data.error ?? "Upload failed", "error");
    }
    setUploading(false);
  }

  async function deleteScore() {
    if (!confirm("Remove the score file?")) return;
    const res = await fetch(`/api/admin/hymns/${id}/score`, {
      method: "DELETE",
    });
    if (res.ok) {
      fetchHymn();
      toast("Score removed");
    } else {
      toast("Failed to remove score", "error");
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadScore(file);
  }

  if (loading) return <p className="text-text-muted">Loading...</p>;
  if (!hymn) return <p className="text-text-muted">Hymn not found</p>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/admin/hymns"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Hymns
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

      {/* Hymn Details */}
      {editing ? (
        <div className="bg-surface border border-border rounded-lg p-5 mb-6 space-y-4">
          <EditField
            label="Title"
            value={editForm.title ?? ""}
            onChange={(v) => setEditForm({ ...editForm, title: v })}
          />
          <EditField
            label="Composer"
            value={editForm.composer ?? ""}
            onChange={(v) => setEditForm({ ...editForm, composer: v || null })}
          />
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-xs text-text-muted mb-1">
                Tradition
              </span>
              <select
                value={editForm.tradition ?? ""}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    tradition: e.target.value || null,
                  })
                }
                className="w-full px-3 py-2 bg-background border border-border rounded text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">None</option>
                <option value="gregorian">Gregorian</option>
                <option value="classical">Classical</option>
                <option value="african">African</option>
                <option value="contemporary">Contemporary</option>
              </select>
            </label>
            <EditField
              label="Language"
              value={editForm.language ?? ""}
              onChange={(v) =>
                setEditForm({ ...editForm, language: v || null })
              }
            />
          </div>
          <EditField
            label="Hymnal"
            value={editForm.hymnal ?? ""}
            onChange={(v) => setEditForm({ ...editForm, hymnal: v || null })}
          />
          <EditField
            label="Link"
            value={editForm.link ?? ""}
            onChange={(v) => setEditForm({ ...editForm, link: v || null })}
          />
          <EditField
            label="Score URL"
            value={editForm.scoreUrl ?? ""}
            onChange={(v) => setEditForm({ ...editForm, scoreUrl: v || null })}
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text mb-1">{hymn.title}</h1>
          {hymn.composer && (
            <p className="text-text-muted mb-4">{hymn.composer}</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <Detail label="Tradition" value={hymn.tradition} />
            <Detail label="Language" value={hymn.language} />
            <Detail label="Hymnal" value={hymn.hymnal} />
            <Detail label="ID" value={String(hymn.id)} />
          </div>

          <div className="flex flex-wrap gap-3 mb-4">
            {hymn.link && (
              <a
                href={hymn.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-dark transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                External Link
              </a>
            )}
            {hymn.scoreUrl && (
              <a
                href={hymn.scoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-dark transition-colors"
              >
                <FileText className="h-4 w-4" />
                Sheet Music
              </a>
            )}
          </div>
        </div>
      )}

      {/* Tags Section */}
      <div className="bg-surface border border-border rounded-lg p-4 mb-6">
        <h2 className="text-sm font-semibold text-text mb-3">Tags</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {hymn.tags.map((t) => (
            <span
              key={t.tag}
              className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded group"
            >
              {t.tag}
              <button
                type="button"
                onClick={() => removeTag(t.tag)}
                className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {hymn.tags.length === 0 && (
            <span className="text-xs text-text-muted">No tags</span>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add tag..."
            className="flex-1 px-3 py-1.5 bg-background border border-border rounded text-text text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
          <button
            type="button"
            onClick={addTag}
            disabled={!newTag.trim()}
            className="px-3 py-1.5 bg-primary text-obsidian font-semibold rounded text-sm hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>

      {/* Score Section */}
      <div className="bg-surface border border-border rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text">Sheet Music</h2>
          {hymn.scoreUrl && (
            <button
              type="button"
              onClick={deleteScore}
              className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-red-400 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              Remove
            </button>
          )}
        </div>

        {hymn.scoreUrl ? (
          <ScoreDisplay url={hymn.scoreUrl} onReplace={(f) => uploadScore(f)} />
        ) : (
          <ScoreDropZone
            uploading={uploading}
            dragOver={dragOver}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onFileSelect={(f) => uploadScore(f)}
          />
        )}
      </div>
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text">
            Verses ({hymn.verses.length})
          </h2>
          <button
            type="button"
            onClick={() => {
              const maxNum = Math.max(
                0,
                ...hymn.verses.map((v) => v.verseNumber),
              );
              setNewVerseForm({
                verseNumber: maxNum + 1,
                verseText: "",
                isChorus: false,
                language: "en",
              });
              setAddingVerse(true);
            }}
            className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-primary transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Verse
          </button>
        </div>

        {addingVerse && (
          <div className="bg-background border border-primary/30 rounded-lg p-4 mb-4">
            <h3 className="text-xs font-semibold text-primary mb-3">
              New Verse
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <label className="block">
                <span className="block text-xs text-text-muted mb-1">
                  Number
                </span>
                <input
                  type="number"
                  value={newVerseForm.verseNumber}
                  onChange={(e) =>
                    setNewVerseForm({
                      ...newVerseForm,
                      verseNumber: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-1.5 bg-surface border border-border rounded text-text text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </label>
              <label className="block">
                <span className="block text-xs text-text-muted mb-1">
                  Language
                </span>
                <input
                  type="text"
                  value={newVerseForm.language}
                  onChange={(e) =>
                    setNewVerseForm({
                      ...newVerseForm,
                      language: e.target.value,
                    })
                  }
                  className="w-full px-3 py-1.5 bg-surface border border-border rounded text-text text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </label>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm text-text-muted">
                  <input
                    type="checkbox"
                    checked={newVerseForm.isChorus}
                    onChange={(e) =>
                      setNewVerseForm({
                        ...newVerseForm,
                        isChorus: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  Chorus
                </label>
              </div>
            </div>
            <textarea
              value={newVerseForm.verseText}
              onChange={(e) =>
                setNewVerseForm({ ...newVerseForm, verseText: e.target.value })
              }
              rows={4}
              placeholder="Enter verse text..."
              className="w-full px-3 py-2 bg-surface border border-border rounded text-text text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 mb-3"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addNewVerse}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-obsidian font-semibold rounded text-sm hover:bg-primary-dark transition-colors"
              >
                <Check className="h-3.5 w-3.5" />
                Save
              </button>
              <button
                type="button"
                onClick={() => setAddingVerse(false)}
                className="px-3 py-1.5 border border-border text-text-muted rounded text-sm hover:text-text transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {hymn.verses.length === 0 && !addingVerse ? (
          <p className="text-text-muted text-sm">No verses recorded</p>
        ) : (
          <div className="space-y-3">
            {hymn.verses.map((verse) => (
              <div
                key={verse.id}
                className="border border-border rounded-lg p-4"
              >
                {editingVerseId === verse.id ? (
                  <div>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <label className="block">
                        <span className="block text-xs text-text-muted mb-1">
                          Number
                        </span>
                        <input
                          type="number"
                          value={editVerseForm.verseNumber}
                          onChange={(e) =>
                            setEditVerseForm({
                              ...editVerseForm,
                              verseNumber: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-1.5 bg-background border border-border rounded text-text text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                        />
                      </label>
                      <label className="block">
                        <span className="block text-xs text-text-muted mb-1">
                          Language
                        </span>
                        <input
                          type="text"
                          value={editVerseForm.language}
                          onChange={(e) =>
                            setEditVerseForm({
                              ...editVerseForm,
                              language: e.target.value,
                            })
                          }
                          className="w-full px-3 py-1.5 bg-background border border-border rounded text-text text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                        />
                      </label>
                      <div className="flex items-end">
                        <label className="flex items-center gap-2 text-sm text-text-muted">
                          <input
                            type="checkbox"
                            checked={editVerseForm.isChorus}
                            onChange={(e) =>
                              setEditVerseForm({
                                ...editVerseForm,
                                isChorus: e.target.checked,
                              })
                            }
                            className="rounded"
                          />
                          Chorus
                        </label>
                      </div>
                    </div>
                    <textarea
                      value={editVerseForm.verseText}
                      onChange={(e) =>
                        setEditVerseForm({
                          ...editVerseForm,
                          verseText: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full px-3 py-2 bg-background border border-border rounded text-text text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 mb-3"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={saveVerse}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-obsidian font-semibold rounded text-sm hover:bg-primary-dark transition-colors"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingVerseId(null)}
                        className="px-3 py-1.5 border border-border text-text-muted rounded text-sm hover:text-text transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-text-muted">
                        {verse.isChorus
                          ? "Chorus"
                          : `Verse ${verse.verseNumber}`}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingVerseId(verse.id);
                            setEditVerseForm({
                              verseNumber: verse.verseNumber,
                              verseText: verse.verseText,
                              isChorus: verse.isChorus,
                              language: verse.language,
                            });
                          }}
                          className="p-1 text-text-muted hover:text-primary transition-colors"
                          title="Edit verse"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteVerse(verse.id)}
                          className="p-1 text-text-muted hover:text-red-400 transition-colors"
                          title="Delete verse"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-text text-sm whitespace-pre-line leading-relaxed">
                      {verse.verseText}
                    </p>
                  </div>
                )}
              </div>
            ))}
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

function ScoreDisplay({
  url,
  onReplace,
}: {
  url: string;
  onReplace: (file: File) => void;
}) {
  const isPdf = /\.pdf$/i.test(url);
  return (
    <div>
      {isPdf ? (
        <iframe
          src={url}
          className="w-full h-[600px] rounded border border-border"
          title="Sheet music"
        />
      ) : (
        // biome-ignore lint/performance/noImgElement: user upload, dimensions unknown
        <img
          src={url}
          alt="Sheet music"
          className="max-w-full rounded border border-border"
        />
      )}
      <div className="mt-2 flex items-center gap-3">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:text-primary-dark transition-colors"
        >
          Open in new tab
        </a>
        <label className="text-xs text-text-muted hover:text-primary transition-colors cursor-pointer">
          Replace file
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onReplace(f);
            }}
          />
        </label>
      </div>
    </div>
  );
}

function ScoreDropZone({
  uploading,
  dragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
}: {
  uploading: boolean;
  dragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (file: File) => void;
}) {
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: drop zone for file upload
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
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
            Drag & drop a score file here
          </p>
          <p className="text-xs text-text-muted mb-3">
            PDF, PNG, JPEG, or WebP (max 10 MB)
          </p>
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-obsidian font-semibold rounded text-sm hover:bg-primary-dark transition-colors cursor-pointer">
            <Upload className="h-3.5 w-3.5" />
            Choose File
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFileSelect(f);
              }}
            />
          </label>
        </>
      )}
    </div>
  );
}
