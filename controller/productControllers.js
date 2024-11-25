const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("cloudinary").v2;

exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      gender,
      category,
      stock = 0,
      popular = false,
      image
    } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "image", folder: "products" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });
    console.log("The upload result is: ", uploadResult);
    const newProduct = await prisma.products.create({
      data: {
        prodName: name,
        prodDescription: description,
        price: parseInt(price, 10),
        gender: gender,
        category: category,
        stock: parseInt(stock, 10),
        popular: popular === "true",
        image: uploadResult.secure_url,
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Error adding product" });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await prisma.products.findMany();
    return res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
};



exports.updateProduct = async (req, res) => {
  try {
    const { prodName, prodDescription, price, gender, category, stock, popular } =
      req.body;
    const productId = req.params.id;

    const updateData = {
      prodName,
      prodDescription,
      price: parseFloat(price),
      gender,
      category,
      stock: parseInt(stock, 10),
      popular: popular === "true" || popular === true, // Convert to boolean
    };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
      });
      updateData.image = result.secure_url;
    }

    const updatedProduct = await prisma.products.update({
      where: { prodId: productId },
      data: updateData,
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await prisma.products.findUnique({
      where: { prodId: req.params.id },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const imageUrl = product.image;
    const publicId = imageUrl.split("/").slice(-1)[0].split(".")[0];

    await cloudinary.uploader.destroy(publicId);

    await prisma.products.delete({
      where: { prodId: req.params.id },
    });

    res.status(200).json({ message: "Product and image deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: error.message || "Error deleting product" });
  }
};

exports.makeAPopularProduct = async (req, res) => {
  const prodId = req.query.prodId;
  const popularity = req.headers.popularity === "true";

  try {
    if (!prodId || popularity === undefined) {
      throw new Error("Please send all required fields");
    }

    await prisma.products.update({
      where: {
        prodId: prodId,
      },
      data: {
        popular: popularity,
      },
    });

    return res.status(200).json({ message: "Product updated successfully" });
  } catch (e) {
    console.error(e.message);
    return res
      .status(500)
      .json({ message: e.message || "Something went wrong" });
  }
};

exports.getpopularProducts = async (req, res) => {
  try {
    const popularProds = await prisma.products.findMany({
      where: { popular: true },
    });
    if (!popularProds) {
      throw new Error("No popular products");
    }
    return res.status(200).json({ data: popularProds });
  } catch (e) {
    return res.status(500).json({ data: e.message || "Something went wrong" });
  }
};
