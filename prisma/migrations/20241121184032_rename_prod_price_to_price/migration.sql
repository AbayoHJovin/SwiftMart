/*
  Warnings:

  - You are about to drop the column `prodPrice` on the `products` table. All the data in the column will be lost.
  - Added the required column `price` to the `Products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `products` DROP COLUMN `prodPrice`,
    ADD COLUMN `price` INTEGER NOT NULL;
