import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

// ── Tables ──────────────────────────────────────────────────────────

export const hymns = sqliteTable(
  "hymns",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    composer: text("composer"),
    tradition: text("tradition"),
    language: text("language"),
    hymnal: text("hymnal"),
    scoreUrl: text("score_url"),
    link: text("link"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [index("idx_hymns_title").on(table.title)],
);

export const hymnTags = sqliteTable(
  "hymn_tags",
  {
    hymnId: integer("hymn_id")
      .notNull()
      .references(() => hymns.id, { onDelete: "cascade" }),
    tag: text("tag").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.hymnId, table.tag] }),
    index("idx_hymn_tags_tag").on(table.tag),
  ],
);

export const hymnVerses = sqliteTable(
  "hymn_verses",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    hymnId: integer("hymn_id")
      .notNull()
      .references(() => hymns.id, { onDelete: "cascade" }),
    verseNumber: integer("verse_number").notNull(),
    verseText: text("verse_text").notNull(),
    isChorus: integer("is_chorus", { mode: "boolean" })
      .notNull()
      .default(false),
    language: text("language").notNull().default("en"),
  },
  (table) => [
    index("idx_hymn_verses_hymn_id").on(table.hymnId),
    uniqueIndex("idx_hymn_verses_unique").on(
      table.hymnId,
      table.verseNumber,
      table.language,
    ),
  ],
);

export const massPrograms = sqliteTable("mass_programs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull().unique(),
  title: text("title"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const massProgramSongs = sqliteTable(
  "mass_program_songs",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    massProgramId: integer("mass_program_id")
      .notNull()
      .references(() => massPrograms.id, { onDelete: "cascade" }),
    hymnId: integer("hymn_id")
      .notNull()
      .references(() => hymns.id, { onDelete: "cascade" }),
    massSection: text("mass_section").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    lyricsOverride: text("lyrics_override"),
  },
  (table) => [
    index("idx_mass_program_songs_program").on(table.massProgramId),
    index("idx_mass_program_songs_hymn").on(table.hymnId),
  ],
);

export const adminUsers = sqliteTable("admin_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ── Relations ───────────────────────────────────────────────────────

export const hymnsRelations = relations(hymns, ({ many }) => ({
  verses: many(hymnVerses),
  tags: many(hymnTags),
  programSongs: many(massProgramSongs),
}));

export const hymnTagsRelations = relations(hymnTags, ({ one }) => ({
  hymn: one(hymns, { fields: [hymnTags.hymnId], references: [hymns.id] }),
}));

export const hymnVersesRelations = relations(hymnVerses, ({ one }) => ({
  hymn: one(hymns, { fields: [hymnVerses.hymnId], references: [hymns.id] }),
}));

export const massProgramsRelations = relations(massPrograms, ({ many }) => ({
  songs: many(massProgramSongs),
}));

export const massProgramSongsRelations = relations(
  massProgramSongs,
  ({ one }) => ({
    program: one(massPrograms, {
      fields: [massProgramSongs.massProgramId],
      references: [massPrograms.id],
    }),
    hymn: one(hymns, {
      fields: [massProgramSongs.hymnId],
      references: [hymns.id],
    }),
  }),
);
