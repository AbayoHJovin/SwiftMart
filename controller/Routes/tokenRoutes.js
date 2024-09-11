const express=require("express")
const { refreshToken } = require("../tokenControllers")
const router=express.Router()
router.post("/refresh_token",refreshToken)
module.exports=router