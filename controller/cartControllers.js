const Cart = require("../model/Cart");
exports.addCartItem = async (req, res) => {
  const { userId, prodId } = req.body;
  try {
    if (!userId || !prodId) {
      throw new Error("Something went wrong!");
    }

    // Find the user's cart
    const userCart = await Cart.findOne({ userId });

    if (!userCart) {
      // If the cart doesn't exist, create a new one
      const newCart = await Cart.create({
        userId: userId,
        products: [{ productId: prodId }],
      });
      return res.status(201).json({ message: "Added to cart" });
    } else {
      // Check if the product is already in the cart
      const findItem = userCart.products.find(
        (item) => item.productId.toString() === prodId
      );

      if (findItem) {
        throw new Error("Item already in cart");
      }

      // If not, add the product to the cart
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
  try {
    if (!currentUserId) {
      throw new Error("Unauthorized");
    }
    const getItems = await Cart.findOne({ userId: currentUserId });
    if (!getItems) {
      throw new Error("No item on your cart");
    }
    return res.status(200).json({ data: getItems });
  } catch (e) {
    return res
      .status(401)
      .json({ message: e.message || "Something went wrong" });
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

