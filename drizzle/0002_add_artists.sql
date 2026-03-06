CREATE TABLE `artists` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`voice_part` text,
	`instrument` text,
	`is_conductor` integer DEFAULT false NOT NULL,
	`is_cor_member` integer DEFAULT false NOT NULL,
	`photo_url` text,
	`bio` text,
	`website` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_artists_name` ON `artists` (`name`);
