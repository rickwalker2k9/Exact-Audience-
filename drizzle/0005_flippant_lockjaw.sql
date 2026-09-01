CREATE TABLE `breeze_current_lead_list` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slotNumber` int NOT NULL,
	`recordKey` varchar(64) NOT NULL,
	`sourceLeadListId` int NOT NULL,
	`assignedAt` timestamp NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `breeze_current_lead_list_id` PRIMARY KEY(`id`),
	CONSTRAINT `breeze_current_lead_slot_unique` UNIQUE(`slotNumber`),
	CONSTRAINT `breeze_current_lead_record_unique` UNIQUE(`recordKey`)
);
--> statement-breakpoint
CREATE TABLE `breeze_daily_lead_lists` (
	`id` int AUTO_INCREMENT NOT NULL,
	`listDate` timestamp NOT NULL,
	`releaseCount` int NOT NULL,
	`importedRecordCount` int NOT NULL,
	`sourceLastSyncedAt` timestamp NOT NULL,
	`sourceLabel` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `breeze_daily_lead_lists_id` PRIMARY KEY(`id`),
	CONSTRAINT `breeze_daily_lead_list_date_unique` UNIQUE(`listDate`)
);
--> statement-breakpoint
CREATE TABLE `breeze_upcoming_leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recordKey` varchar(64) NOT NULL,
	`leadListId` int NOT NULL,
	`queuePosition` int NOT NULL,
	`addedAt` timestamp NOT NULL,
	`releasedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `breeze_upcoming_leads_id` PRIMARY KEY(`id`),
	CONSTRAINT `breeze_upcoming_lead_record_unique` UNIQUE(`recordKey`),
	CONSTRAINT `breeze_upcoming_lead_position_unique` UNIQUE(`queuePosition`)
);
--> statement-breakpoint
ALTER TABLE `breeze_source_records` ADD `children` varchar(64) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `breeze_source_records` ADD `homeowner` varchar(64) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `breeze_source_records` ADD `gender` varchar(32) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `breeze_source_records` ADD `zip` varchar(16) DEFAULT '' NOT NULL;