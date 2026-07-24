CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE TABLE `voter_ctv_prefs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`voterKey` varchar(128) NOT NULL,
	`bundleNetworkIds` text,
	`primaryPlatform` varchar(64),
	`filtersJson` text,
	`lastPreset` varchar(64),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `voter_ctv_prefs_id` PRIMARY KEY(`id`),
	CONSTRAINT `voter_ctv_prefs_voterKey_unique` UNIQUE(`voterKey`)
);
