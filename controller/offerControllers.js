const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.addOffer = async (req, res) => {
  const { orderData, paymentMethod, transactionUrl, userId } = req.body;
  const {
    phoneNo,
    price,
    address,
    products: orderProducts,
    orderDate,
  } = orderData;

  try {
    if (
      !userId ||
      !phoneNo ||
      !paymentMethod ||
      !transactionUrl ||
      !price ||
      !address ||
      !orderProducts ||
      !Array.isArray(orderProducts) ||
      orderProducts.length === 0
    ) {
      throw new Error("Missing or invalid details!");
    }

    const validProducts = orderProducts.filter(
      (product) => product.productId && product.quantity
    );
    if (validProducts.length !== orderProducts.length) {
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
        transactionUrl: transactionUrl,
        status: 'Pending',
        orderItems: {
          create: validProducts.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: { orderItems: true },
    });

    // Create notification for admin
    const admins = await prisma.users.findMany({
      where: { isAdmin: true }
    });

    // Create notifications for all admins
    await Promise.all(admins.map(admin => 
      prisma.notification.create({
        data: {
          userId: admin.userId,
          title: "New Order Received",
          message: `New order #${newOrder.orderId} has been placed for RWF ${price}`,
          type: "OrderPlaced",
          orderId: newOrder.orderId
        }
      })
    ));

    // Create notification for customer
    await prisma.notification.create({
      data: {
        userId: userId,
        title: "Order Placed Successfully",
        message: `Your order #${newOrder.orderId} has been placed and is pending approval.`,
        type: "OrderPlaced",
        orderId: newOrder.orderId
      }
    });

    for (const item of orderProducts) {
      const product = await prisma.products.findUnique({
        where: { prodId: item.productId },
      });

      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found.`);
      }
      
      console.log("product.stock", product.stock);
      console.log("item.quantity", item.quantity);
      if (product.stock < item.quantity) {
        throw new Error(
          `Not enough stock for product: ${product.name}. Available: ${product.stock}`
        );
      }

      await prisma.products.update({
        where: { prodId: item.productId },
        data: { stock: product.stock - item.quantity },
      });
    }
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
      include: { 
        orderItems: true,
        notifications: {
          where: {
            userId: userId
          }
        }
      },
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
  const { message } = req.body;

  try {
    if (!offerId) throw new Error("Offer ID is required");

    const order = await prisma.orders.findUnique({
      where: { orderId: offerId },
      include: { orderItems: true }
    });

    if (!order) {
      throw new Error("Order not found");
    }

    const status = message ? 'ApprovedWithMessage' : 'Approved';

    const updatedOrder = await prisma.orders.update({
      where: { orderId: offerId },
      data: { 
        status,
        approvalMessage: message || null
      },
    });

    // Create notification for customer
    await prisma.notification.create({
      data: {
        userId: order.ordererId,
        title: message ? "Order Approved with Message" : "Order Approved",
        message: message || `Your order #${offerId} has been approved.`,
        type: "OrderApproved",
        orderId: offerId
      }
    });

    return res
      .status(200)
      .json({ message: "Order approved successfully", order: updatedOrder });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: e.message || "Something went wrong" });
  }
};

exports.declineOffer = async (req, res) => {
  const { offerId } = req.query;
  const { reason } = req.body;

  try {
    if (!offerId) throw new Error("Offer ID is required");

    const existingOrder = await prisma.orders.findUnique({
      where: { orderId: offerId },
    });

    if (!existingOrder) {
      return res.status(404).json({ error: "Offer not found" });
    }

    // Create notification for customer about order cancellation
    await prisma.notification.create({
      data: {
        userId: existingOrder.ordererId,
        title: "Order Cancelled",
        message: reason || `Your order #${offerId} has been cancelled.`,
        type: "OrderCancelled",
        orderId: offerId
      }
    });

    // Delete order items first
    await prisma.orderItem.deleteMany({
      where: {
        orderId: offerId,
      },
    });

    // Then delete the order
    await prisma.orders.delete({
      where: { orderId: offerId },
    });

    return res.status(200).json({ message: "Order removed successfully" });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: e.message || "Something went wrong" });
  }
};
