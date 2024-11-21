const isAuth = require("../auth/isAuth").default;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
exports.addFavouritesItem = async (req, res) => {
  const { userId, prodId } = req.body;
  try {
    if (!userId || !prodId) {
      throw new Error("Something went wrong!");
    }

    const userFavourites = await prisma.favorites.findUnique({
      where: { userId },
    });

    if (!userFavourites) {
      userFavourites = await prisma.favorites.create({
        data: {
          userId,
        },
      });
    }
    const existingProduct = await prisma.favProducts.findUnique({
      where: {
        favId_productId: {
          favId: userFavourites.favId,
          productId: prodId,
        },
      },
    });
    if (existingProduct) {
      throw new Error("Product is already in favorites");
    }
    await prisma.favProducts.create({
      data: {
        favId: userFavourites.favId,
        productId: prodId,
        quantity: 1,
      },
    });
    res
      .status(201)
      .json({ message: "Product added to Favorites successfully." });
  } catch (e) {
    return res
      .status(400)
      .json({ message: e.message || "Something went wrong" });
  }
};

exports.getFavouritesItem = async (req, res) => {
  const currentUserId = req.query.currentUser;
  const authorization = req.headers.authorization;

  try {
    if (!currentUserId || !authorization) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const userId = isAuth(authorization);
    if (!userId || userId !== currentUserId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const userFavorites = await prisma.favorites.findUnique({
      where: { userId: currentUserId },
      include: {
        favProducts: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!userFavorites || userFavorites.favProducts.length === 0) {
      return res.status(404).json({ message: "No items in your favorites." });
    }

    const products = userFavorites.favProducts.map((favProduct) => ({
      id: favProduct.id,
      productId: favProduct.productId,
      quantity: favProduct.quantity,
    }));

    return res.status(200).json({ products });
  } catch (e) {
    return res
      .status(500)
      .json({ message: e.message || "Something went wrong." });
  }
};
exports.deleteFavouritesItem = async (req, res) => {
  const { itemId, userId } = req.query;

  try {
    if (!itemId || !userId) {
      throw new Error("No item selected or user ID provided.");
    }

    const userFavorites = await prisma.favorites.findUnique({
      where: { userId },
    });

    if (!userFavorites) {
      throw new Error("Favorites not found.");
    }

    const deleteResult = await prisma.favProducts.deleteMany({
      where: {
        favId: userFavorites.favId,
        productId: itemId,
      },
    });

    if (deleteResult.count === 0) {
      throw new Error("Item not found in Favorites.");
    }

    return res.status(200).json({ message: "Item deleted successfully." });
  } catch (e) {
    return res
      .status(400)
      .json({ message: e.message || "Something went wrong." });
  }
};
