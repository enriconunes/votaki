/*
  Warnings:

  - The primary key for the `Candidate` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `City` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Party` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Position` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Vote` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `Candidate` DROP FOREIGN KEY `Candidate_idCity_fkey`;

-- DropForeignKey
ALTER TABLE `Candidate` DROP FOREIGN KEY `Candidate_idParty_fkey`;

-- DropForeignKey
ALTER TABLE `Candidate` DROP FOREIGN KEY `Candidate_idPosition_fkey`;

-- DropForeignKey
ALTER TABLE `Vote` DROP FOREIGN KEY `Vote_idCandidate_fkey`;

-- AlterTable
ALTER TABLE `Candidate` DROP PRIMARY KEY,
    MODIFY `idCandidate` CHAR(36) NOT NULL,
    MODIFY `idPosition` VARCHAR(191) NOT NULL,
    MODIFY `idParty` VARCHAR(191) NOT NULL,
    MODIFY `idCity` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`idCandidate`);

-- AlterTable
ALTER TABLE `City` DROP PRIMARY KEY,
    MODIFY `idCity` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`idCity`);

-- AlterTable
ALTER TABLE `Party` DROP PRIMARY KEY,
    MODIFY `idParty` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`idParty`);

-- AlterTable
ALTER TABLE `Position` DROP PRIMARY KEY,
    MODIFY `idPosition` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`idPosition`);

-- AlterTable
ALTER TABLE `Vote` DROP PRIMARY KEY,
    MODIFY `idCandidate` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`email`, `idCandidate`);

-- AddForeignKey
ALTER TABLE `Candidate` ADD CONSTRAINT `Candidate_idPosition_fkey` FOREIGN KEY (`idPosition`) REFERENCES `Position`(`idPosition`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Candidate` ADD CONSTRAINT `Candidate_idParty_fkey` FOREIGN KEY (`idParty`) REFERENCES `Party`(`idParty`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Candidate` ADD CONSTRAINT `Candidate_idCity_fkey` FOREIGN KEY (`idCity`) REFERENCES `City`(`idCity`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vote` ADD CONSTRAINT `Vote_idCandidate_fkey` FOREIGN KEY (`idCandidate`) REFERENCES `Candidate`(`idCandidate`) ON DELETE RESTRICT ON UPDATE CASCADE;
