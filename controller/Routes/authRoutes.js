const express=require('express')
const { authMiddleware } = require('../../auth/middleware')
const router=express.Router()
router.get("/",authMiddleware)
module.exports=router
