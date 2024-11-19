const {PrismaClient} =require("@prisma/client")
const prisma = new PrismaClient()
exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, gender, category, stock = 0, booked = 0, popular = false } = req.body;
    const { buffer, mimetype } = req.file;

    const base64Image = `data:${mimetype};base64,${buffer.toString("base64")}`;

    const newProduct = await prisma.products.create({
      data: {
        prodName: name,
        prodDescription: description,
        prodPrice: parseInt(price, 10),
        gender:gender,
        category:category,
        stock: parseInt(stock, 10),
        booked: parseInt(booked, 10),
        popular: popular === "true",
        image: base64Image,
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
    res.json(products);
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
      booked: req.body.sold,
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