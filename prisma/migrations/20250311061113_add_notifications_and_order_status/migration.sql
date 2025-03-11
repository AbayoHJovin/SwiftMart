/*
  Warnings:

  - You are about to drop the column `approved` on the `orders` table. All the data in the column will be lost.
  - Made the column `orderDate` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `orders` DROP COLUMN `approved`,
    ADD COLUMN `approvalMessage` TEXT NULL,
    ADD COLUMN `status` ENUM('Pending', 'Approved', 'ApprovedWithMessage', 'Cancelled', 'Delivered') NOT NULL DEFAULT 'Pending',
    MODIFY `orderDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `users` ADD COLUMN `isAdmin` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NULL,
    `type` ENUM('OrderPlaced', 'OrderApproved', 'OrderCancelled', 'OrderDelivered', 'SystemNotice') NOT NULL,
    `message` TEXT NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Orders`(`orderId`) ON DELETE SET NULL ON UPDATE CASCADE;
