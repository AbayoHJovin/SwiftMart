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
const Paypal = require("./Routes/PaypalRoutes");
require("dotenv").config();
const Mtn = require("./Routes/MTNRoutes");

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174', 
  'https://homedel-jov.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token'],
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(express.json());

  
  app.listen(5000, () => {
    console.log("Server is running on port 5000");
  });
app.use(userRoutes);
app.use(productRoutes);
app.use(tokenRoutes);
app.use(cartRoutes);
app.use(FavRoutes);
app.use(offerRoutes);
app.use(otpRoutes);
app.use(subscriptionRoutes)
app.use(Paypal);
app.use(Mtn);