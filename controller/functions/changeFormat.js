// Import required modules
const cloudinary = require("cloudinary").v2;
const { createCanvas } = require("canvas");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

/**
 * Transforms the success response data from various payment APIs into an image and uploads it to Cloudinary.
 * @param {Object} data - The success response data from the payment API.
 * @param {string} paymentType - The type of payment (e.g., "MTN", "PayPal", "Card").
 * @returns {Promise<Object>} - The result from Cloudinary or an error object.
 */
const changeFormatAndPushToCloudinary = async (data, paymentType) => {
  try {
    let transformedData;

    // Transform the data based on the payment type
    if (paymentType === "MTN") {
      transformedData = {
        paidWith: "MTN MoMo",
        amount: data.amount,
        currency: data.currency,
        status: data.status,
        payer: data.payer.partyId,
        payerMessage: data.payerMessage,
        payeeNote: data.payeeNote,
      };
    } else if (paymentType === "PayPal" || paymentType === "Card") {
      transformedData = {
        paidWith: paymentType,
        transactionId: data.id || data.transaction_id,
        amount: data.amount.total || data.amount,
        currency: data.amount.currency || data.currency,
        status: data.state || data.status,
        payer: data.payer.email || data.payer_info.email,
        payerMessage: data.payer_message || "Payment successful.",
        payeeNote: data.payee_note || "Thank you for your transaction.",
      };
    } else {
      throw new Error("Unsupported payment type");
    }

    // Create an image using Canvas
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext("2d");

    // Set background color
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add header
    ctx.fillStyle = "#28a745"; // Green color for the header
    ctx.fillRect(0, 0, canvas.width, 100);
    ctx.fillStyle = "#ffffff";
    ctx.font = "30px Arial bold";
    ctx.textAlign = "center";
    ctx.fillText("Payment Receipt", canvas.width / 2, 60);

    // Set text styles for content
    ctx.fillStyle = "#000000";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";

    // Write data to the canvas
    let y = 150;
    for (const [key, value] of Object.entries(transformedData)) {
      ctx.fillStyle = "#28a745"; // Green color for labels
      ctx.fillText(`${key.charAt(0).toUpperCase() + key.slice(1)}:`, 50, y);
      ctx.fillStyle = "#000000"; // Black color for values
      ctx.fillText(`${value}`, 300, y);
      y += 40;
    }

    // Add footer
    ctx.fillStyle = "#28a745"; // Green footer background
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
    ctx.fillStyle = "#ffffff";
    ctx.font = "18px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Thank you for your purchase!", canvas.width / 2, canvas.height - 20);

    // Convert the canvas to a buffer
    const buffer = canvas.toBuffer("image/png");

    // Upload the image to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: `${paymentType.toLowerCase()}-payments`,
          public_id:
            transformedData.transactionId || transformedData.payer || "receipt",
        },
        (error, result) => {
          if (error) {
            console.error("Error uploading to Cloudinary:", error);
            reject(new Error("Failed to upload to Cloudinary"));
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });

    console.log("uploadResponse", uploadResponse);
    return uploadResponse;
  } catch (error) {
    console.error("Error in changeFormatAndPushToCloudinary:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = changeFormatAndPushToCloudinary;
