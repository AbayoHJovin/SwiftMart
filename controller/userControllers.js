const bcrypt = require("bcrypt");
const lodash = require("lodash");
const axios = require("axios");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const { PrismaClient } = require("@prisma/client");
const cloudinary= require("cloudinary").v2
const {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} = require("../auth/tokens");
const isAuth = require("../auth/isAuth");
require("dotenv").config();
const prisma = new PrismaClient();
exports.signupUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      throw new Error("Missing credentials");
    }
    const existingUser = await prisma.users.findFirst({
      where: { email: email },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    const saveUser = await prisma.users.create({
      data: { username: username, email: email, password: hashedPassword },
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
  let isAdmin = false;
  try {
    const user = await prisma.users.findFirst({ where: { email: email } });
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
    const accessToken = createAccessToken(user.userId);
    const refreshToken = createRefreshToken(user.userId);
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
    const user = await prisma.users.findMany();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

const streamifier = require("streamifier"); 

exports.updateUserDetails = async (req, res) => {
  const userId = req.body.userId;
  const { username, email } = req.body;

  try {
    if (!username || !email) {
      throw new Error("Please provide both username and email");
    }

    let profilePictureUrl = null;

    if (req.file) {
      profilePictureUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "profile_pictures" }, 
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url); 
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });
    }

    const updatedUser = await prisma.users.update({
      where: { userId },
      data: {
        ...(username && { username }),
        ...(email && { email }),
        ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
      },
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
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
    const currentUserCredentials = await prisma.users.findUnique({
      where: { userId },
    });
    if (!currentUserCredentials) {
      throw new Error("No user is found");
    }
    if (currentUserCredentials.email === process.env.AD_EMAIL) {
      isAdmin = true;
    }
    const currentUser = lodash.omit(currentUserCredentials, ["password"]);
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

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const newPass = otpGenerator.generate(8, {
    digits: true,
    lowerCaseAlphabets: true,
    upperCaseAlphabets: true,
    specialChars: true,
  });
  try {
    if (!email) {
      return res.status(401).json({ message: "No email entered" });
    }
    const doesEmailExist = await prisma.users.findFirst({
      data: { email: email },
    });
    if (!doesEmailExist) {
      return res.status(401).json({ message: "The email doesn't exist" });
    }
    const newPasswordHashed = await bcrypt.hash(newPass, 5);
    const updatedPassword = await prisma.users.update({
      where: {
        email: email,
      },
      data: {
        password: newPasswordHashed,
      },
    });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.COMPANY_EMAIL,
        pass: process.env.COMPANY_PASSWORD,
      },
    });
    await transporter.sendMail({
      from: process.env.COMPANY_EMAIL,
      to: email,
      subject: "Resetting your homedel Password",
      text: `How can you reset your homedel password ?`,
      html: `
      <div
      style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f4f4f4;
      "
    >
      <div
        style="
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        "
      >
        <h2 style="text-align: center; color: #4caf50">
          Password Reset Request
        </h2>
        <p>Hello <strong>${doesEmailExist.username}</strong>,</p>
        <p>
          We have generated a new password for your account. Please use the
          password below to log in:
        </p>
        <p
          style="
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            padding: 10px;
            background-color: #e6fad9;
            border: 1px solid #4caf50;
            border-radius: 4px;
            color: #333;
          "
        >
          ${newPass}
        </p>
        <p>
          After logging in, it is highly recommended that you reset your
          password to something more secure and memorable.
        </p>
        <h4>To reset your password:</h4>
        <ol>
          <li>Log in to your account using the new password.</li>
          <li>Navigate to the "Account"</li>
          <li>
            Click on "Password (On the sidebar)" and follow the instructions.
          </li>
        </ol>
        <p>
          Else if you chose the password we've generated for you, you may
          continue with it
        </p>
        <p>
          If you encounter any issues, feel free to contact our support team.
        </p>
        <p>Best regards,</p>
        <p><strong>The Company Team</strong></p>
      </div>
    </div>
    `,
    });
    return res
      .status(200)
      .json({ message: "Password reset instructions sent to your email" });
  } catch (e) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

exports.checkOldPassword = async (req, res) => {
  const { email, password } = req.headers;
  try {
    if (!email || !password) {
      return res.status(401).json({ message: "Missing values" });
    }
    const user = await prisma.users.findFirst({ where: { email: email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    return res.status(200).json({ message: "Password is valid" });
  } catch (e) {
    return res.status(401).json({ error: e.message || "Something went wrong" });
  }
};

exports.updatePassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 5);
    const updatedPassword = await prisma.users.update({
      where: {
        email: email,
      },
      data: {
        password: hashedPassword,
      },
    });
    if (!updatedPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (e) {
    return res
      .status(200)
      .json({ message: e.message || "Something went wrong" });
  }
};
