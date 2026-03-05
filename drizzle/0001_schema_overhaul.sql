-- This migration is destructive: drops all old tables and recreates with integer PKs.
-- Run import-firebase.ts after applying to repopulate data.

DROP TABLE IF EXISTS `mass_program_songs`;--> statement-breakpoint
DROP TABLE IF EXISTS `mass_programs`;--> statement-breakpoint
DROP TABLE IF EXISTS `hymn_categories`;--> statement-breakpoint
DROP TABLE IF EXISTS `hymn_verses`;--> statement-breakpoint
DROP TABLE IF EXISTS `categories`;--> statement-breakpoint
DROP TABLE IF EXISTS `hymns`;--> statement-breakpoint
DROP TABLE IF EXISTS `admin_users`;--> statement-breakpoint

CREATE TABLE `hymns` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `title` text NOT NULL,
  `composer` text,
  `tradition` text,
  `language` text,
  `hymnal` text,
  `score_url` text,
  `link` text,
  `created_at` integer DEFAULT (unixepoch()) NOT NULL,
  `updated_at` integer DEFAULT (unixepoch()) NOT NULL
);--> statement-breakpoint
CREATE INDEX `idx_hymns_title` ON `hymns` (`title`);--> statement-breakpoint

CREATE TABLE `hymn_tags` (
  `hymn_id` integer NOT NULL,
  `tag` text NOT NULL,
  PRIMARY KEY(`hymn_id`, `tag`),
  FOREIGN KEY (`hymn_id`) REFERENCES `hymns`(`id`) ON UPDATE no action ON DELETE cascade
);--> statement-breakpoint
CREATE INDEX `idx_hymn_tags_tag` ON `hymn_tags` (`tag`);--> statement-breakpoint

CREATE TABLE `hymn_verses` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `hymn_id` integer NOT NULL,
  `verse_number` integer NOT NULL,
  `verse_text` text NOT NULL,
  `is_chorus` integer DEFAULT false NOT NULL,
  `language` text DEFAULT 'en' NOT NULL,
  FOREIGN KEY (`hymn_id`) REFERENCES `hymns`(`id`) ON UPDATE no action ON DELETE cascade
);--> statement-breakpoint
CREATE INDEX `idx_hymn_verses_hymn_id` ON `hymn_verses` (`hymn_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_hymn_verses_unique` ON `hymn_verses` (`hymn_id`, `verse_number`, `language`);--> statement-breakpoint

CREATE TABLE `mass_programs` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `date` text NOT NULL,
  `title` text,
  `created_at` integer DEFAULT (unixepoch()) NOT NULL,
  `updated_at` integer DEFAULT (unixepoch()) NOT NULL
);--> statement-breakpoint
CREATE UNIQUE INDEX `mass_programs_date_unique` ON `mass_programs` (`date`);--> statement-breakpoint

CREATE TABLE `mass_program_songs` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `mass_program_id` integer NOT NULL,
  `hymn_id` integer NOT NULL,
  `mass_section` text NOT NULL,
  `sort_order` integer DEFAULT 0 NOT NULL,
  `lyrics_override` text,
  FOREIGN KEY (`mass_program_id`) REFERENCES `mass_programs`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`hymn_id`) REFERENCES `hymns`(`id`) ON UPDATE no action ON DELETE cascade
);--> statement-breakpoint
CREATE INDEX `idx_mass_program_songs_program` ON `mass_program_songs` (`mass_program_id`);--> statement-breakpoint
CREATE INDEX `idx_mass_program_songs_hymn` ON `mass_program_songs` (`hymn_id`);--> statement-breakpoint

CREATE TABLE `admin_users` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `username` text NOT NULL,
  `password_hash` text NOT NULL,
  `created_at` integer DEFAULT (unixepoch()) NOT NULL
);--> statement-breakpoint
CREATE UNIQUE INDEX `admin_users_username_unique` ON `admin_users` (`username`);
