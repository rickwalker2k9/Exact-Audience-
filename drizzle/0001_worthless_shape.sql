CREATE TABLE `breeze_import_sources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerOpenId` varchar(64) NOT NULL,
	`sourceLabel` varchar(255) NOT NULL,
	`storageKey` text NOT NULL,
	`mappingJson` text NOT NULL,
	`approvedRecordCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `breeze_import_sources_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `breeze_lead_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contactKey` varchar(128) NOT NULL,
	`stage` varchar(32) NOT NULL DEFAULT 'approved',
	`websiteVisitedAt` timestamp,
	`formStartedAt` timestamp,
	`formCompletedAt` timestamp,
	`updatedByOpenId` varchar(64) NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `breeze_lead_progress_id` PRIMARY KEY(`id`),
	CONSTRAINT `breeze_lead_progress_contactKey_unique` UNIQUE(`contactKey`)
);
