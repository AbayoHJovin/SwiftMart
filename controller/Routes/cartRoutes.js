const express = require("express");
const { addCartItem, getCartItem, deleteCartItem } = require("../cartControllers");
const router = express.Router();
router.post("/addItemOncart", addCartItem);
router.get("/getCartItems",getCartItem)
router.delete("/deleteCartItem",deleteCartItem)
module.exports = router;
