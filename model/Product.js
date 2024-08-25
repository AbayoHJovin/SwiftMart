const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  gender: String,
  category: String,
  stock: Number,
  sold: Number,
  image: {
    data: Buffer,
    contentType: String,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
