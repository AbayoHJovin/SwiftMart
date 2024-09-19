const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  gender: String,
  category: String,
  stock: Number,
  sold: Number,
  booked:{type:Number,default:0},
  liked:{type:Number,default:0},
  image: {
    data: Buffer,
    contentType: String,
  },
  popular:{type:Boolean,default:false}
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
