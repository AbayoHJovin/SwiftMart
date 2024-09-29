const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./Routes/userRoutes");
const productRoutes = require("./Routes/productRoutes");
const cartRoutes = require("./Routes/cartRoutes");
const FavRoutes = require("./Routes/favouriteRoutes");
const tokenRoutes = require("./Routes/tokenRoutes");
const cookieParser = require("cookie-parser");
const offerRoutes = require("./Routes/offerRoutes");
const otpRoutes=require("./Routes/otpRoutes")
require("dotenv").config();

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "https://homedel.vercel.app"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to the database");
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((e) => console.log(e));

app.use(userRoutes);
app.use(productRoutes);
app.use(tokenRoutes);
app.use(cartRoutes);
app.use(FavRoutes);
app.use(offerRoutes);
app.use(otpRoutes);