const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cloudinary = require("cloudinary").v2;

exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, gender, category, stock = 0, popular = false } = req.body;
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
  console.log("The upload result is: ",uploadResult)
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
    const updateData = {
      prodName: req.body.name,
      prodDescription: req.body.description,
      prodPrice: req.body.price,
      gender: req.body.gender,
      category: req.body.category,
      stock: req.body.stock,
    };

    if (req.file) {
      updateData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const updatedProduct = await prisma.products.update({
      where: {
        prodId: req.params.id,
      },
      data: updateData,
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating product" });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    // await Product.findByIdAndDelete(req.query.id);
    await prisma.products.delete({where:{prodId:req.query.id}})
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Error deleting product" });
  }
};

exports.makeAPopularProduct=async (req,res)=>{
  const prodId=req.query.prodId
  const popularity=req.headers.popularity
  try { 
    if(!prodId || !popularity){throw new Error("Please sent all credentials")}
    await prisma.products.update({
      where:{
        prodId:prodId
      },
      data:{
        popular:popularity
      }
    })
    return res.status(200).json({message:"product updated"})
  } catch (e) {
    return res.status(500).json({message:e.message || "Something went wrong"})
  }
}
exports.getpopularProducts=async (req,res)=>{
  try {
    const popularProds= await prisma.products.findMany({where:{popular:true}})
    if(!popularProds){throw new Error("No popular products")}
    return res.status(200).json({data:popularProds})
  } catch (e) {
    return res.status(500).json({data:e.message || "Something went wrong"})
    
  }
}