const SubscriptionModel = require("../../model/Subscription");
const nodemailer = require("nodemailer");
require("dotenv").config();

exports.handleSubscription = async (req, res) => {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  try {
    let subscription = await SubscriptionModel.findOne();

    if (subscription) {
      if (subscription.emails.includes(email)) {
        return res.status(400).json({ message: "Email already subscribed" });
      }

      subscription.emails.push(email);
      await subscription.save();
    } else {
      subscription = new SubscriptionModel({ emails: [email] });
      await subscription.save();
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.COMPANY_EMAIL,
        pass: process.env.COMPANY_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.COMPANY_EMAIL,
      to: email,
      subject: "Subscription Confirmation",
      text: `Thank you for subscribing to our newsletter! You'll now receive updates and news from us.`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Subscription successful!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};
