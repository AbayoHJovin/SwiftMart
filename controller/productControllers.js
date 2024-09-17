const Product = require("../model/Product");

exports.addProduct = async (req, res) => {
  try {
    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      gender: req.body.gender,
      category: req.body.category,
      sold: req.body.sold,
      stock: req.body.stock,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Error adding product" });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        gender: req.body.gender,
        category: req.body.category,
        sold: req.body.sold,
        stock: req.body.stock,
        image: req.file
          ? {
              data: req.file.buffer,
              contentType: req.file.mimetype,
            }
          : undefined,
      },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Error updating product" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.query.id);
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
    const product=await Product.findByIdAndUpdate(prodId,{popular:popularity},{new:true})
    return res.status(200).json({message:"product updated"})
  } catch (e) {
    return res.status(500).json({message:e.message || "Something went wrong"})
  }
}
exports.getpopularProducts=async (req,res)=>{
  try {
    const popularProds= await Product.find({popular:true})
    if(!popularProds){throw new Error("No popular products")}
    return res.status(200).json({data:popularProds})
  } catch (e) {
    return res.status(500).json({data:e.message || "Something went wrong"})
    
  }
}