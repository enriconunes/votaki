/*
  Warnings:

  - The primary key for the `Vote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `idVote` was added to the `Vote` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `Vote` DROP PRIMARY KEY,
    ADD COLUMN `idVote` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`idVote`);

-- CreateTable
CREATE TABLE `Geolocation` (
    `id` CHAR(36) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `idVote` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Geolocation_idVote_key`(`idVote`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Geolocation` ADD CONSTRAINT `Geolocation_idVote_fkey` FOREIGN KEY (`idVote`) REFERENCES `Vote`(`idVote`) ON DELETE RESTRICT ON UPDATE CASCADE;
