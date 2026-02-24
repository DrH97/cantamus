CREATE TABLE `admin_users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_users_username_unique` ON `admin_users` (`username`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `hymn_categories` (
	`hymn_id` text NOT NULL,
	`category_id` text NOT NULL,
	PRIMARY KEY(`hymn_id`, `category_id`),
	FOREIGN KEY (`hymn_id`) REFERENCES `hymns`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `hymn_verses` (
	`id` text PRIMARY KEY NOT NULL,
	`hymn_id` text NOT NULL,
	`verse_number` integer NOT NULL,
	`verse_text` text NOT NULL,
	`is_chorus` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`hymn_id`) REFERENCES `hymns`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `hymns` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`composer` text,
	`tradition` text,
	`language` text,
	`hymnal` text,
	`hymn_number` text,
	`hymn_page` text,
	`is_favourite` integer DEFAULT false NOT NULL,
	`is_wedding` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `mass_program_songs` (
	`id` text PRIMARY KEY NOT NULL,
	`mass_program_id` text NOT NULL,
	`hymn_id` text NOT NULL,
	`mass_section` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`lyrics_override` text,
	FOREIGN KEY (`mass_program_id`) REFERENCES `mass_programs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`hymn_id`) REFERENCES `hymns`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `mass_programs` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`title` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `mass_programs_date_unique` ON `mass_programs` (`date`);