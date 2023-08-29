CREATE TABLE `image` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`imageUrl` varchar(255) NOT NULL,
	`date` date NOT NULL,
	`optic` varchar(255) NOT NULL,
	`camera` varchar(255) NOT NULL,
	`mount` varchar(255) NOT NULL,
	`filters` varchar(255) NOT NULL,
	`sqml` varchar(255) NOT NULL,
	`exposureDetails` varchar(255) NOT NULL,
	`acquisition` varchar(255) NOT NULL,
	`processing` varchar(255) NOT NULL,
	`info` varchar(255) NOT NULL,
	`annotationUrl` varchar(255) NOT NULL,
	CONSTRAINT `image_id` PRIMARY KEY(`id`),
	CONSTRAINT `image_name_unique` UNIQUE(`name`)
);
