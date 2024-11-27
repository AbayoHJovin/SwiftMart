/*
  Warnings:

  - A unique constraint covering the columns `[ownerId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Cart_ownerId_key` ON `Cart`(`ownerId`);
