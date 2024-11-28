const isAuth = require("../auth/isAuth");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
exports.addCartItem = async (req, res) => {
  const { userId, prodId } = req.body;
  try {
    if (!userId || !prodId) {
      throw new Error("User ID and Product ID are required.");
    }

    let userCart = await prisma.cart.findFirst({
      where: { ownerId: userId },
      include: { cartProducts: true },
    });

    if (!userCart) {
      userCart = await prisma.cart.create({
        data: {
          ownerId: userId,
          cartProducts: {
            create: [{ productId: prodId }],
          },
        },
      });
    } else {
      const existingProduct = userCart.cartProducts.find(
        (item) => item.productId === prodId
      );

      if (existingProduct) {
        throw new Error("Item already in cart.");
      }

      await prisma.cartProducts.create({
        data: {
          cartId: userCart.cartId,
          productId: prodId,
        },
      });
    }

    return res.status(201).json({ message: "Added to cart." });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Something went wrong." });
  }
};

exports.getCartItem = async (req, res) => {
  const { currentUser } = req.query;

  try {
    if (!currentUser) {
      return res.status(401).json({ message: "Not authorized." });
    }

    const cart = await prisma.cart.findFirst({
      where: { ownerId: currentUser }, 
      include: {
        cartProducts: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.cartProducts.length === 0) {
      return res.status(404).json({ message: "No items in your cart." });
    }

    return res.status(200).json({ products: cart.cartProducts });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Something went wrong." });
  }
};

exports.deleteCartItem = async (req, res) => {
  const { itemId, userId } = req.query;

  try {
    if (!itemId || !userId) {
      throw new Error("Product ID and User ID are required.");
    }

    // Find the user's cart
    const userCart = await prisma.cart.findUnique({
      where: { ownerId: userId },
    });

    if (!userCart) {
      throw new Error("Cart not found.");
    }

    // Delete the specific product from the cart
    const deleteResult = await prisma.cartProducts.deleteMany({
      where: {
        cartId: userCart.cartId,
        productId: itemId,
      },
    });

    if (deleteResult.count === 0) {
      throw new Error("Item not found in cart.");
    }

    return res.status(200).json({ message: "Item deleted successfully." });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Something went wrong." });
  }
};

exports.deleteAllCartItems = async (req, res) => {
  const { userId } = req.query;

  try {
    if (!userId) {
      throw new Error("User ID is required.");
    }

    const userCart = await prisma.cart.findUnique({
      where: { ownerId: userId },
    });

    if (!userCart) {
      throw new Error("Cart not found.");
    }

    await prisma.cartProducts.deleteMany({
      where: { cartId: userCart.cartId },
    });

    return res.status(200).json({ message: "Cart reset successfully." });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Something went wrong." });
  }
};
