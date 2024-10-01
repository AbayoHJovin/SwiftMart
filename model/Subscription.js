const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    emails: {
        type: [String],  // Array of strings to store multiple email addresses
        required: true   // You can make it required if necessary
    }
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
