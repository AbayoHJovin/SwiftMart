const express=require("express")
const { addOffer } = require("../offerControllers")
const router=express.Router()
router.post("/addOffer",addOffer)
module.exports=router