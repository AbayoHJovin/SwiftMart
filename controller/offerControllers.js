const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.addOffer = async (req, res) => {
  const {
    userId,
    phoneNo,
    paymentMethod,
    price,
    address,
    products,
    orderDate,
  } = req.body;
  try {
    if (
      !userId ||
      !phoneNo ||
      !paymentMethod ||
      !price ||
      !address ||
      !products ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      throw new Error("Missing or invalid details!");
    }

    const validProducts = products.filter(
      (product) => product.productId && product.quantity
    );
    if (validProducts.length !== products.length) {
      throw new Error(
        "All product entries must have valid productId and quantity."
      );
    }

    const newOrder = await prisma.orders.create({
      data: {
        ordererId: userId,
        address,
        phoneNo,
        paymentMethod,
        price,
        orderDate: orderDate,
        orderItems: {
          create: validProducts.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: { orderItems: true },
    });

    return res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: e.message || "Something went wrong" });
  }
};

exports.getOffer = async (req, res) => {
  const userId = req.query.userId;
  try {
    const userOrders = await prisma.orders.findMany({
      where: { ordererId: userId },
      include: { orderItems: true }, // Ensure orderItems are fetched with order details
    });
    if (userOrders.length === 0) {
      throw new Error("No orders found for the user");
    }
    return res.status(200).json({ orders: userOrders });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: e.message || "Something went wrong" });
  }
};

exports.approveOffer = async (req, res) => {
  const { offerId } = req.query;

  try {
    if (!offerId) throw new Error("Offer ID is required");

    const updatedOrder = await prisma.orders.update({
      where: { orderId: offerId },
      data: { approved: true },
    });

    return res
      .status(200)
      .json({ message: "Offer approved successfully", order: updatedOrder });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: e.message || "Something went wrong" });
  }
};

exports.declineOffer = async (req, res) => {
  const { offerId } = req.query;

  try {
    if (!offerId) throw new Error("Offer ID is required");

    const existingOrder = await prisma.orders.findUnique({
      where: { orderId: offerId },
    });

    if (!existingOrder) {
      return res.status(404).json({ error: "Offer not found" });
    }
    const deleteOfferDependencies = await prisma.orderItem.deleteMany({
      where: {
        orderId:offerId
      },
    });
    await prisma.orders.delete({
      where: { orderId: offerId },
    });

    return res.status(200).json({ message: "Offer removed successfully" });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: e.message || "Something went wrong" });
  }
};
