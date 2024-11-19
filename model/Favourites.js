// const mongoose = require("mongoose");

// const favouritesSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   products: [
//     {
//       productId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Product",
//         required: true,
//       },
//     },
//   ],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// favouritesSchema.pre("save", function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

// const Favourites = mongoose.model("Favourites", favouritesSchema);

// module.exports = Favourites;
