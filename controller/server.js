const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./Routes/userRoutes");
const cookieParser = require("cookie-parser");
const productRoutes = require("./Routes/productRoutes");
const cartRoutes = require("./Routes/cartRoutes");
const FavRoutes = require("./Routes/favouriteRoutes");
const tokenRoutes = require("./Routes/tokenRoutes");
const offerRoutes = require("./Routes/offerRoutes");
const otpRoutes=require("./Routes/otpRoutes")
const subscriptionRoutes=require("./Routes/subscriptions")
const notificationRoutes = require("./Routes/notificationRoutes");
const Paypal = require("./Routes/PaypalRoutes");
require("dotenv").config();
const Mtn = require("./Routes/MTNRoutes");

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "https://homedel.vercel.app"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token'],
  })
);

app.use(express.json());

// Use routes with proper prefixes
app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", tokenRoutes);
app.use("/api", cartRoutes);
app.use("/api", FavRoutes);
app.use("/api", offerRoutes);
app.use("/api", otpRoutes);
app.use("/api", subscriptionRoutes);
app.use("/api", notificationRoutes);
app.use("/api", Paypal);
app.use("/api", Mtn);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});