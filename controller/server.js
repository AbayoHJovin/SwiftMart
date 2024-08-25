const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const userRoutes = require("./Routes/userRoutes");
const productRoutes = require("./Routes/productRoutes");
const authRoutes = require("./Routes/authRoutes");
const cartRoutes = require("./Routes/cartRoutes");
const FavRoutes=require("./Routes/favouriteRoutes")

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/ecommerceDB")
  .then(() => console.log("Connected to the database"))
  .catch((e) => console.log(e));

app.use(userRoutes);
app.use(productRoutes);
app.use(authRoutes);
app.use(cartRoutes);
app.use(FavRoutes)

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
