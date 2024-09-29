const express=require("express")
const { generateOtp, verifyOtp, checkAdmin, resendOtpCookie } = require("../mail/otp")
const router=express.Router()
router.patch("/generate-otp",generateOtp)
router.post("/verify-otp",verifyOtp)
router.get("/check-admin",checkAdmin)
router.get("/resendCookie",resendOtpCookie)
module.exports=router