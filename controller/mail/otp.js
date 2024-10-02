const User = require("../../model/Users");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
// const { sendOtpToken } = require("../../auth/tokens");
require("dotenv").config();

exports.generateOtp = async (req, res) => {
  const otp = otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });

  try {
    const updatedAdmin = await User.findOneAndUpdate(
      { email: process.env.AD_EMAIL },
      { otp: otp },
      { new: true }
    );
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.COMPANY_EMAIL,
        pass: process.env.COMPANY_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.COMPANY_EMAIL,
      to: process.env.AD_EMAIL,
      subject: "OTP Verification",
      text: `Your OTP for verification is: ${otp}`,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: e.message || "Error sending OTP" });
  }
};

exports.verifyOtp = async (req, res) => {
  const { otp } = req.body;

  try {
    const otpRecord = await User.findOne({ otp }).exec();
    if (!otpRecord) {
      res.status(400).json({ message: "Invalid OTP" });
    }
    const token = jwt.sign({ otp }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("adminAuth", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
      path: "/",
      // secure: process.env.NODE_ENV === "production", // Only over HTTPS in production
      // sameSite: "None",
      // maxAge: 1000 * 60 * 60, // 1 hour
    });
    console.log(req.cookies);
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};

exports.resendOtpCookie = async (req, res) => {
  const adminAuth = req.cookies.adminAuth;
  console.log(req.cookies);

  try {
    if (!adminAuth) {
      throw new Error("Unauthorized");
    }
    const decoded = jwt.verify(adminAuth, process.env.JWT_SECRET);
    const newToken = jwt.sign(
      { isAdmin: decoded.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("adminAuth", newToken, {
      httpOnly: true,
      path: "/",
      // secure: process.env.NODE_ENV === "production",
      // sameSite: "None",
      // maxAge: 1000 * 60 * 60,
    });

    return res.status(200).json({ message: "Token refreshed successfully" });
  } catch (e) {
    return res
      .status(500)
      .json({ message: e.message || "Error refreshing token" });
  }
};

exports.checkAdmin = async (req, res) => {
  const adminAuth = req.cookies.adminAuth;
  console.log(req.cookies);
  try {
    if (adminAuth) {
      return res.status(200).json({ isAdmin: true });
    } else {
      return res.status(401).json({ isAdmin: false, message: "Unauthorized" });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ message: e.message || "Error checking admin status" });
  }
};

exports.logOut = (req, res) => {
  res.clearCookie("adminAuth", { path: "/" });
  return res.send({ message: "Logged out" });
};
