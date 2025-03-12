/*
  Warnings:

  - You are about to alter the column `type` on the `notification` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(50)`.
  - You are about to drop the column `status` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `isAdmin` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `notification` MODIFY `type` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `status`,
    ADD COLUMN `approved` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `orderDate` TEXT NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `isAdmin`,
    ADD COLUMN `refreshToken` TEXT NULL;
