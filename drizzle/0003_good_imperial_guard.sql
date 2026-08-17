CREATE TABLE `breeze_source_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`source` varchar(32) NOT NULL,
	`recordKey` varchar(64) NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(64) NOT NULL,
	`ageRange` varchar(64) NOT NULL,
	`incomeRange` varchar(64) NOT NULL,
	`city` varchar(120) NOT NULL,
	`state` varchar(32) NOT NULL,
	`sourceLabel` varchar(255) NOT NULL,
	`recordOrdinal` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `breeze_source_records_id` PRIMARY KEY(`id`),
	CONSTRAINT `breeze_source_record_unique` UNIQUE(`source`,`recordKey`)
);
