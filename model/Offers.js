// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   names: { type: String, required: true },
//   email: { type: String, required: true },
//   address: { type: String, required: true },
//   phoneNumber: { type: String, required: true },
//   paymentMethod: { type: String, required: true },
//   amount: { type: String, required: true },
//   products: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Product",
//       required: true,
//     },
//   ],
//   approved: { type: Boolean, default: false },
//   day: { type: String, required: true },
//   date: { type: String, required: true },
//   time: { type: String, required: true },
// });

// module.exports = mongoose.model("Offers", orderSchema);
