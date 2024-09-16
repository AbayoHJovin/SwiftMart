const Offers = require("../model/Offers");
exports.addOffer = async (req, res) => {
  const {
    userId,
    names,
    email,
    address,
    phoneNumber,
    paymentMethod,
    amount,
    products,
    day,
    date,
    time,
  } = req.body;

  try {
    // Basic validation for required fields
    if (
      !userId ||
      !names ||
      !email ||
      !phoneNumber ||
      !paymentMethod ||
      !amount
    ) {
      throw new Error("Missing details!");
    }

    // Check if products array is provided and contains valid product IDs
    if (!products || !Array.isArray(products) || products.length === 0) {
      throw new Error(
        "Products are required and must be an array of valid product IDs!"
      );
    }

    // Ensure no product is null or undefined
    const validProducts = products.filter((productId) => productId);
    if (validProducts.length !== products.length) {
      throw new Error("All product IDs must be valid and not null.");
    }

    // Create the new offer
    const newOffer = await Offers.create({
      userId,
      names,
      email,
      address,
      phoneNumber,
      paymentMethod,
      amount,
      products: validProducts,
      day,
      date,
      time,
    });

    return res.status(201).json({ message: "Offer placed" });
  } catch (e) {
    return res.status(400).json({ error: e.message || "Something went wrong" });
  }
};

exports.getOffer = async (req, res) => {
  try {
    const allOffers = await Offers.find({});
    if (!allOffers) {
      throw new Error("No orders found");
    }
    return res.status(200).json({ message: allOffers });
  } catch (e) {
    console.log(e);
    return res.status(200).json({ error: e.message || "Something went wrong" });
  }
};