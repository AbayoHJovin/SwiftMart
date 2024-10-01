const User = require("../model/Users");
const bcrypt = require("bcrypt");
const lodash = require("lodash");
const axios=require("axios")
const {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} = require("../auth/tokens");
const isAuth = require("../auth/isAuth");
require("dotenv").config();

exports.signupUser = async (req, res) => {
  const { username, email, password } = req.body;
  const verifyEmailUrl = `https://api.zerobounce.net/v2/validate?api_key=${process.env.ZB_API_KEY}&email=${email}`;
  try {
    const verificationResponse = await axios.get(verifyEmailUrl);
    console.log(verificationResponse.status)
    const { status } = verificationResponse.data;
    if(status === "valid"){

      if (!username || !email || !password) {
        throw new Error("Missing credentials");
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
        .status(400)
        .json({ success: false, message: "User already exists" });
      }
      
      const hashedPassword = await bcrypt.hash(password, 5);
      const saveUser = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });
    res
    .status(201)
    .json({ success: true, message: "User created successfully" });
  }else{
    throw new Error("Invalid email")
  }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  let isAdmin = false;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    if (user.email === process.env.AD_EMAIL) {
      isAdmin = true;
    }
    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);
    user.refreshToken = refreshToken;
    sendRefreshToken(res, refreshToken);
    sendAccessToken(req, res, accessToken, isAdmin);
    return;
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.find();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

exports.updateUserDetails = async (req, res) => {
  const userId = req.query.userId;
  const { name, email, profilePicture } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = name || user.username;
    user.email = email || user.email;
    user.profilePicture = profilePicture || user.profilePicture;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

exports.getCurrentUser = async (req, res) => {
  const token = req.headers.token;
  let isAdmin = false;
  try {
    const userId = isAuth(token);

    if (!userId) {
      return res.json({ user: null });
    }
    const currentUserCredentials = await User.findById(userId);
    if (currentUserCredentials.email === process.env.AD_EMAIL) {
      isAdmin = true;
    }
    const currentUser = lodash.omit(currentUserCredentials.toObject(), [
      "password",
    ]);
    return res.status(200).json({ user: currentUser, isAdmin: isAdmin });
  } catch (e) {
    console.log(e);
    return res.status(401).json({ error: e.message || "Something went wrong" });
  }
};

exports.logOut = (req, res) => {
  res.clearCookie("refreshToken", { path: "/refresh_token" });
  return res.send({ message: "Logged out" });
};
