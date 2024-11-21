const express = require("express");
const { addCartItem, getCartItem, deleteCartItem, deleteAllCartItems } = require("../cartControllers");
const router = express.Router();
router.post("/addItemOncart", addCartItem);
router.get("/getCartItems",getCartItem)
router.delete("/deleteCartItem",deleteCartItem)
router.delete("/deleteAllCartItems",deleteAllCartItems)
module.exports = router;
