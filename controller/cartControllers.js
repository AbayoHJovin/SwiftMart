const isAuth = require("../auth/isAuth");
const Cart = require("../model/Cart");
exports.addCartItem = async (req, res) => {
  const { userId, prodId } = req.body;
  try {
    if (!userId || !prodId) {
      throw new Error("Something went wrong!");
    }

    const userCart = await Cart.findOne({ userId });

    if (!userCart) {
      const newCart = await Cart.create({
        userId: userId,
        products: [{ productId: prodId }],
      });
      return res.status(201).json({ message: "Added to cart" });
    } else {
      const findItem = userCart.products.find(
        (item) => item.productId.toString() === prodId
      );

      if (findItem) {
        throw new Error("Item already in cart");
      }

      userCart.products.push({ productId: prodId });
      await userCart.save();

      return res.status(201).json({ message: "Added to cart" });
    }
  } catch (e) {
    return res
      .status(400)
      .json({ message: e.message || "Something went wrong" });
  }
};


exports.getCartItem = async (req, res) => {
  const currentUserId = req.query.currentUser;
  const authorization = req.headers.authorization;

  try {
    if (!currentUserId || !authorization) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const userId = isAuth(authorization);
    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const cart = await Cart.findOne({ userId: currentUserId });
    if (!cart || cart.products.length === 0) {
      return res.status(404).json({ message: "No items in your cart" });
    }

    return res.status(200).json({ products: cart.products });
  } catch (e) {
    return res.status(500).json({ message: e.message || "Something went wrong" });
  }
};

exports.deleteCartItem = async (req, res) => {
  const { itemId, userId } = req.query;
  try {
    if (!itemId || !userId) {
      throw new Error("No item selected");
    }

    const cart = await Cart.findOne({ userId: userId });
    if (!cart) {
      throw new Error("Cart not found");
    }

    const updatedProducts = cart.products.filter(
      (product) => product.productId.toString() !== itemId
    );

    if (updatedProducts.length === cart.products.length) {
      throw new Error("Item not found in cart");
    }

    cart.products = updatedProducts;
    await cart.save();

    return res.status(200).json({ message: "Item deleted", data: cart.products });
  } catch (e) {
    return res.status(401).json({ message: e.message || "Something went wrong" });
  }
};

exports.deleteAllcartItems = async (req, res) => {
  const { userId } = req.query;
  try {
    if (!userId) {
      throw new Error("No item selected");
    }

    const cart = await Cart.deleteMany({ userId: userId });
    if (!cart) {
      throw new Error("Cart not found");
    }
    return res.status(200).json({ message: "Reset the cart" });
  } catch (e) {
    return res.status(401).json({ message: e.message || "Something went wrong" });
  }
};

