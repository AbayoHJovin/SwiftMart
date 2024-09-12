const jwt = require("jsonwebtoken");
const Users = require("../model/Users");
const {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} = require("../auth/tokens");
const isAuth = require("../auth/isAuth");
require("dotenv").config();
exports.refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.send({ accessToken: "" });
  }
  let payload = null;
  try {
    payload = jwt.verify(token, process.env.REFRESH_TOKEN);
  } catch (e) {
    return res.send({ accessToken: "" });
  }
  const user = await Users.findOne({ _id: payload.userId });
  if (!user) {
    return res.send({ accessToken: "" });
  }
  const accessToken = createAccessToken(user._id);
  const refreshToken = createRefreshToken(user._id);
  sendRefreshToken(res, refreshToken);
  return res.send({ accessToken: accessToken });
};

exports.protectedRoute=(req,res)=>{
  const token=req.headers.authorization
  if(!token) return res.status(401).send({message:"Unauthorized"})
  const userId=isAuth(token)
  if(!userId){
    return res.status(401).send({message:"Unauthorized"})
  }
  return res.status(200).json({message:"Authorized"})
}