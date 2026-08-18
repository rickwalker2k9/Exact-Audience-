CREATE TABLE `breeze_client_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionHash` varchar(64) NOT NULL,
	`loginName` varchar(120) NOT NULL,
	`acknowledgedAt` timestamp NOT NULL,
	`loggedInAt` timestamp NOT NULL DEFAULT (now()),
	`lastSeenAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp NOT NULL,
	`closedAt` timestamp,
	CONSTRAINT `breeze_client_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `breeze_client_sessions_sessionHash_unique` UNIQUE(`sessionHash`)
);
