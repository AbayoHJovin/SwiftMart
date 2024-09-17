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
  const userId = req.query.userId;
  try {
    if (!userId) {
      const allOffers = await Offers.find({});
      if (!allOffers) {
        throw new Error("No orders found");
      }
      return res.status(200).json({ message: allOffers });
    } else {
      const userOffers = await Offers.find({userId:userId})
      if(!userOffers){
        throw new Error("No offers made")
      }
      return res.status(200).json({message:userOffers})
    }
  } catch (e) {
    return res.status(200).json({ error: e.message || "Something went wrong" });
  }
};

exports.approveOffer = async (req, res) => {
  const offerId = req.query.offerId;
  try {
    if (!offerId) {
      throw new Error("No offer id is found");
    }
    const offer = await Offers.findByIdAndUpdate(
      offerId,
      { approved: true },
      { new: true }
    );
    if (!offer) {
      throw new Error("No offer is found");
    }
    return res.status(200).json({ message: "Offer Approved" });
  } catch (e) {
    return res
      .status(401)
      .json({ message: e.message || "Something went wrong" });
  }
};

exports.declineOffer = async (req, res) => {
  const offerId = req.query.offerId;
  try {
    if (!offerId) {
      throw new Error("No offerId Found");
    }
    await Offers.findByIdAndDelete(offerId);
    return res.status(200).json({ message: "Offer removed" });
  } catch (e) {
    return res
      .status(401)
      .json({ message: e.message || "Something went wrong" });
  }
};
