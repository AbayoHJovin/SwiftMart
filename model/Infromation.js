import mongoose from "mongoose";

const info = new mongoose.Schema({
  totalSales: {
    type: Number,
    required: false,
    default: 0,
  },
  income:{
    type:Number,
    required:false,
    default:0,
  },
  orders:{
    type:Number,
    required:false,
    default:0
  },
//   pending:{}
})

module.exports=mongoose.model("info",info)