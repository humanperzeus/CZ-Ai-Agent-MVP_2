CREATE TABLE `PersonalityConfig` (
    `id` text PRIMARY KEY NOT NULL,
    `createdAt` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
    `updatedAt` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
    `key` text NOT NULL,
    `value` text NOT NULL,
    `category` text NOT NULL,
    `priority` integer NOT NULL,
    `isActive` integer NOT NULL DEFAULT 1
);

CREATE UNIQUE INDEX `PersonalityConfig_key_unique` ON `PersonalityConfig` (`key`); 