/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Vote` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `Vote` DROP FOREIGN KEY `Vote_email_fkey`;

-- AlterTable
ALTER TABLE `Candidate` MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `description` VARCHAR(255) NOT NULL,
    MODIFY `image` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `City` MODIFY `name` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `Party` MODIFY `name` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `Position` MODIFY `name` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    MODIFY `email` VARCHAR(255) NOT NULL,
    ADD PRIMARY KEY (`email`);

-- AlterTable
ALTER TABLE `Vote` DROP PRIMARY KEY,
    MODIFY `email` VARCHAR(255) NOT NULL,
    ADD PRIMARY KEY (`email`, `idCandidate`);

-- AddForeignKey
ALTER TABLE `Vote` ADD CONSTRAINT `Vote_email_fkey` FOREIGN KEY (`email`) REFERENCES `User`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
