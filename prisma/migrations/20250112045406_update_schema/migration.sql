/*
  Warnings:

  - You are about to drop the `transactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `Transactions_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `Transactions_userId_fkey`;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `transactionUrl` TEXT NULL;

-- DropTable
DROP TABLE `transactions`;
