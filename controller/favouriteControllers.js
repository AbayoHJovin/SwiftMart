const isAuth = require("../auth/isAuth");
const Favourites = require("../model/Favourites");
exports.addFavouritesItem = async (req, res) => {
  const { userId, prodId } = req.body;
  try {
    if (!userId || !prodId) {
      throw new Error("Something went wrong!");
    }

    // Find the user's Favourites
    const userFavourites = await Favourites.findOne({ userId });

    if (!userFavourites) {
      // If the Favourites doesn't exist, create a new one
      const newFavourites = await Favourites.create({
        userId: userId,
        products: [{ productId: prodId }],
      });
      return res.status(201).json({ message: "Added to Favourites" });
    } else {
      // Check if the product is already in the Favourites
      const findItem = userFavourites.products.find(
        (item) => item.productId.toString() === prodId
      );

      if (findItem) {
        throw new Error("Item already in Favourites");
      }

      // If not, add the product to the Favourites
      userFavourites.products.push({ productId: prodId });
      await userFavourites.save();

      return res.status(201).json({ message: "Added to Favourites" });
    }
  } catch (e) {
    return res
      .status(400)
      .json({ message: e.message || "Something went wrong" });
  }
};

// exports.getFavouritesItem = async (req, res) => {
//   const currentUserId = req.query.currentUser;
//   const authorization = req.headers.authorization;
//   try {
//     if (!currentUserId || !authorization) {
//       throw new Error("Not authorized");
//     }
//     const userId = isAuth(authorization);
//     if (!userId) {
//       throw new Error("Not authorized");
//     }
//     const getItems = await Favourites.findOne({ userId: currentUserId });
//     if (!getItems) {
//       throw new Error("No item on your Favourites");
//     }
//     return res.status(200).json({ data: getItems });
//   } catch (e) {
//     return res
//       .status(401)
//       .json({ message: e.message || "Something went wrong" });
//   }
// };

exports.getFavouritesItem = async (req, res) => {
  const currentUserId = req.query.currentUser;
  const authorization = req.headers.authorization;

  try {
    if (!currentUserId || !authorization) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Validate token and get userId
    const userId = isAuth(authorization);
    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Find the user's cart
    const cart = await Favourites.findOne({ userId: currentUserId });
    if (!cart || cart.products.length === 0) {
      return res.status(404).json({ message: "No items in your cart" });
    }

    return res.status(200).json({ products: cart.products });
  } catch (e) {
    return res.status(500).json({ message: e.message || "Something went wrong" });
  }
};


exports.deleteFavouritesItem = async (req, res) => {
  const { itemId, userId } = req.query;
  try {
    if (!itemId || !userId) {
      throw new Error("No item selected");
    }

    const userFavourites = await Favourites.findOne({ userId: userId });
    if (!userFavourites) {
      throw new Error("Favourites not found");
    }

    const updatedProducts = userFavourites.products.filter(
      (product) => product.productId.toString() !== itemId
    );

    if (updatedProducts.length === userFavourites.products.length) {
      throw new Error("Item not found in Favourites");
    }

    userFavourites.products = updatedProducts;
    await userFavourites.save();

    return res
      .status(200)
      .json({ message: "Item deleted", data: userFavourites.products });
  } catch (e) {
    return res
      .status(401)
      .json({ message: e.message || "Something went wrong" });
  }
};
