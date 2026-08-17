CREATE TABLE `breeze_pixel_configurations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`platform` varchar(80) NOT NULL,
	`pixelId` varchar(160) NOT NULL,
	`status` varchar(24) NOT NULL DEFAULT 'needs-review',
	`eventNamesJson` text NOT NULL,
	`sourceLabel` varchar(255) NOT NULL,
	`updatedByOpenId` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `breeze_pixel_configurations_id` PRIMARY KEY(`id`),
	CONSTRAINT `breeze_pixel_platform_id_unique` UNIQUE(`platform`,`pixelId`)
);
