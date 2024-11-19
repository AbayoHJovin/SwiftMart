-- CreateTable
CREATE TABLE `Users` (
    `userId` VARCHAR(191) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `otp` VARCHAR(10) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Users_email_key`(`email`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cart` (
    `cartId` VARCHAR(191) NOT NULL,
    `ownerId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`cartId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CartProducts` (
    `id` VARCHAR(191) NOT NULL,
    `cartId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,

    UNIQUE INDEX `CartProducts_cartId_productId_key`(`cartId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Products` (
    `prodId` VARCHAR(191) NOT NULL,
    `prodName` VARCHAR(255) NOT NULL,
    `prodDescription` TEXT NOT NULL,
    `prodPrice` INTEGER NOT NULL,
    `gender` ENUM('Male', 'Female', 'Unisex') NOT NULL,
    `category` VARCHAR(255) NOT NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `booked` INTEGER NOT NULL DEFAULT 0,
    `popular` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`prodId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Orders` (
    `orderId` VARCHAR(191) NOT NULL,
    `ordererId` VARCHAR(191) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `phoneNo` VARCHAR(15) NOT NULL,
    `paymentMethod` VARCHAR(255) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `approved` BOOLEAN NOT NULL DEFAULT false,
    `orderDate` DATE NULL,

    PRIMARY KEY (`orderId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItem` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,

    UNIQUE INDEX `OrderItem_orderId_productId_key`(`orderId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Favorites` (
    `favId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`favId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FavProducts` (
    `id` VARCHAR(191) NOT NULL,
    `favId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,

    UNIQUE INDEX `FavProducts_favId_productId_key`(`favId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subscription` (
    `subscriptionId` VARCHAR(191) NOT NULL,
    `email` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Subscription_email_key`(`email`),
    PRIMARY KEY (`subscriptionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartProducts` ADD CONSTRAINT `CartProducts_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`cartId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartProducts` ADD CONSTRAINT `CartProducts_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`prodId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_ordererId_fkey` FOREIGN KEY (`ordererId`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Orders`(`orderId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`prodId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Favorites` ADD CONSTRAINT `Favorites_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FavProducts` ADD CONSTRAINT `FavProducts_favId_fkey` FOREIGN KEY (`favId`) REFERENCES `Favorites`(`favId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FavProducts` ADD CONSTRAINT `FavProducts_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`prodId`) ON DELETE RESTRICT ON UPDATE CASCADE;
