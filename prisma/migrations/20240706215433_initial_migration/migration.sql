-- CreateTable
CREATE TABLE `User` (
    `email` INTEGER NOT NULL,

    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Position` (
    `idPosition` INTEGER NOT NULL AUTO_INCREMENT,
    `name` INTEGER NOT NULL,

    PRIMARY KEY (`idPosition`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Party` (
    `idParty` INTEGER NOT NULL AUTO_INCREMENT,
    `name` INTEGER NOT NULL,

    PRIMARY KEY (`idParty`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `City` (
    `idCity` INTEGER NOT NULL AUTO_INCREMENT,
    `name` INTEGER NOT NULL,

    PRIMARY KEY (`idCity`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Candidate` (
    `idCandidate` INTEGER NOT NULL AUTO_INCREMENT,
    `name` INTEGER NOT NULL,
    `description` INTEGER NOT NULL,
    `image` INTEGER NOT NULL,
    `idPosition` INTEGER NOT NULL,
    `idParty` INTEGER NOT NULL,
    `idCity` INTEGER NOT NULL,

    PRIMARY KEY (`idCandidate`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vote` (
    `email` INTEGER NOT NULL,
    `idCandidate` INTEGER NOT NULL,

    PRIMARY KEY (`email`, `idCandidate`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Candidate` ADD CONSTRAINT `Candidate_idPosition_fkey` FOREIGN KEY (`idPosition`) REFERENCES `Position`(`idPosition`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Candidate` ADD CONSTRAINT `Candidate_idParty_fkey` FOREIGN KEY (`idParty`) REFERENCES `Party`(`idParty`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Candidate` ADD CONSTRAINT `Candidate_idCity_fkey` FOREIGN KEY (`idCity`) REFERENCES `City`(`idCity`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vote` ADD CONSTRAINT `Vote_email_fkey` FOREIGN KEY (`email`) REFERENCES `User`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vote` ADD CONSTRAINT `Vote_idCandidate_fkey` FOREIGN KEY (`idCandidate`) REFERENCES `Candidate`(`idCandidate`) ON DELETE RESTRICT ON UPDATE CASCADE;
