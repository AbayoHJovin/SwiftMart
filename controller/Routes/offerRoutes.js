const express=require("express")
const { addOffer, getOffer } = require("../offerControllers")
const router=express.Router()
router.post("/addOffer",addOffer)
router.get("/getOffer",getOffer)
module.exports=router