const User = require("../model/Users");
const bcrypt = require("bcrypt");
const lodash = require("lodash");
const {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} = require("../auth/tokens");
const isAuth = require("../auth/isAuth");
require("dotenv").config();

function isAuth(authorization) {
  try {
    const token = authorization;
    const { adminToken } = verify(token, process.env.ACCESS_TOKEN);
    return adminToken;
  } catch (error) {
    console.error("Error verifying token:", error.message);
    return null;
  }
}

exports.signupUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
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

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);
    user.refreshToken = refreshToken;
    sendRefreshToken(res, refreshToken);
    sendAccessToken(req, res, accessToken);
    return;
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

exports.getUserDetails = async (req, res) => {
  const token=req.headers.token
  const Admintoken= isAuth(token)
  try {
    if(!Admintoken){
      throw new Error("Unauthorized")
    }
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
  try {
    const userId = isAuth(token);

    if (!userId) {
      return res.json({ user: null });
    }

    const currentUserCredentials = await User.findById(userId);
    const currentUser = lodash.omit(currentUserCredentials.toObject(), ["password"]);
    return res.status(200).json({ user: currentUser });
  } catch (e) {
    return res.status(401).json({ error: e.message || "Something went wrong" });
  }
};

exports.logOut = (req, res) => {
  res.clearCookie("refreshToken", { path: "/refresh_token" });
  return res.send({ message: "Logged out" });
};
