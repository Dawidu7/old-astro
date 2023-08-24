ALTER TABLE `option` MODIFY COLUMN `type` enum('angle','camera','catalog','constellation','filter','telescope') NOT NULL;--> statement-breakpoint
ALTER TABLE `telescope` MODIFY COLUMN `focalLength` int NOT NULL;--> statement-breakpoint
ALTER TABLE `telescope` MODIFY COLUMN `diameter` int NOT NULL;--> statement-breakpoint
ALTER TABLE `telescope` MODIFY COLUMN `focalRatio` float NOT NULL;