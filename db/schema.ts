import { sql } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const hymns = sqliteTable("hymns", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  composer: text("composer"),
  tradition: text("tradition"),
  language: text("language"),
  hymnal: text("hymnal"),
  hymnNumber: text("hymn_number"),
  hymnPage: text("hymn_page"),
  isFavourite: integer("is_favourite", { mode: "boolean" })
    .notNull()
    .default(false),
  isWedding: integer("is_wedding", { mode: "boolean" })
    .notNull()
    .default(false),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

export const hymnVerses = sqliteTable("hymn_verses", {
  id: text("id").primaryKey(),
  hymnId: text("hymn_id")
    .notNull()
    .references(() => hymns.id, { onDelete: "cascade" }),
  verseNumber: integer("verse_number").notNull(),
  verseText: text("verse_text").notNull(),
  isChorus: integer("is_chorus", { mode: "boolean" }).notNull().default(false),
});

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // mass_section | liturgical_season | pack
  sortOrder: integer("sort_order").notNull().default(0),
});

export const hymnCategories = sqliteTable(
  "hymn_categories",
  {
    hymnId: text("hymn_id")
      .notNull()
      .references(() => hymns.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.hymnId, table.categoryId] })],
);

export const massPrograms = sqliteTable("mass_programs", {
  id: text("id").primaryKey(),
  date: text("date").notNull().unique(),
  title: text("title"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

export const massProgramSongs = sqliteTable("mass_program_songs", {
  id: text("id").primaryKey(),
  massProgramId: text("mass_program_id")
    .notNull()
    .references(() => massPrograms.id, { onDelete: "cascade" }),
  hymnId: text("hymn_id")
    .notNull()
    .references(() => hymns.id, { onDelete: "cascade" }),
  massSection: text("mass_section").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  lyricsOverride: text("lyrics_override"),
});

export const adminUsers = sqliteTable("admin_users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});
