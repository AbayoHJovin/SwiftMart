const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const userRoutes = require("./Routes/userRoutes");
const productRoutes = require("./Routes/productRoutes");
// const authRoutes = require("./Routes/authRoutes");
const cartRoutes = require("./Routes/cartRoutes");
const FavRoutes = require("./Routes/favouriteRoutes");
const tokenRoutes = require("./Routes/tokenRoutes");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/ecommerceDB")
  .then(() => console.log("Connected to the database"))
  .catch((e) => console.log(e));

app.use(userRoutes);
app.use(productRoutes);
app.use(tokenRoutes);
app.use(cartRoutes);
app.use(FavRoutes);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
