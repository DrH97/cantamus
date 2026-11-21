CREATE TABLE `mass_sections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`label` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `mass_sections_slug_unique` ON `mass_sections` (`slug`);
--> statement-breakpoint
INSERT INTO `mass_sections` (`slug`, `label`, `sort_order`) VALUES
	('prelude', 'Prelude', 0),
	('introit', 'Introit', 1),
	('kyrie', 'Kyrie', 2),
	('gloria', 'Gloria', 3),
	('responsorial', 'Responsorial Psalm', 4),
	('alleluia', 'Alleluia', 5),
	('offertory', 'Offertory', 6),
	('sanctus', 'Sanctus', 7),
	('mysterium-fidei', 'Mysterium Fidei', 8),
	('amen', 'Amen', 9),
	('agnus-dei', 'Agnus Dei', 10),
	('communion', 'Communion', 11),
	('recessional', 'Recessional', 12),
	('reprise', 'Reprise', 13);
