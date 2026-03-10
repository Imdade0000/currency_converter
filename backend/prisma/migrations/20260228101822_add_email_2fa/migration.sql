-- AlterTable
ALTER TABLE `users` ADD COLUMN `isTwoFactorEnabled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `twoFactorEmailCode` VARCHAR(191) NULL,
    ADD COLUMN `twoFactorEmailExpires` DATETIME(3) NULL;
