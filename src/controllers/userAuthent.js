 const user = require("../models/user");
// const user=require("../models/user")
 const validate=require('../utils/validator');
 const bcrypt=require("bcrypt");
 const jwt=require('jsonwebtoken');
 const submission= require("../models/submission");
const register=async(req,res)=>{
try{
    //validate the data;
    validator(req.body);
  const {firstName,emailId,password}=req.body;
   req.body.password=await bcrypt.hash(password,10);
   //req.body.role='admin'
   
const user=await user.create(req.body);
const token= jwt.sign ({_id:user._id,emailId:emailId,role:user.role},process.env.JWT_KEY,{expiresIn:60*60});
   res.cookie('token',token,{maxAge:60*60*1000});
   res.status(201).send("User Registered successfully");
}
catch(err){
    res.status(400).send("Error:"+err);
}
}

const login=async(req,res)=>{
    try{
      const {emailId,password}=req.body;
      if(!emailId)
        throw new Error("Invalid credentils");
    if(!password)
        throw new Error("Invalid credentils");
    const user=await user.findone({emailId});
    const match=bcrypt.compare(password,user.password);
    if(!match)
        throw new Error("Invalid credentials");
      const token= jwt.sign ({_id:user._id,emailId:emailId,role:user.role},process.env.JWT_KEY,{expiresIn:60*60});
      res.cookie('token',token,{maxAge:60*60*1000});
      res.status(200).send("Logged In successfully");

    }
    catch{
    res.status(401).send("Error"+err);
    }
}
const logout=async(req,res)=>{
    try{
     const {token}=req.cookie;
     const payload=jwt.decode(token);
     await redisclient.set('token:${token}','Blocked');
     await redisclient.expireAt('token:${token}',payload.exp);
      res.cookie("token",null,{expires:new Date(Date.now())});
      res.send("Logged out successfully");
    }
    catch{
res.status(503).res.send("Error"+err);
    }
}
const adminRegister=async(req,res)=>{
    try{

    }
    catch(err){

    }
}
const deleteProfile=async(req,res)=>{
try{
const userId=req.result_id;

//user Schema delete
 await user.findByIdAndDelete(userId);

 // submission se bhi delete karo
 await submission.deleteMany({userId});
 res.status(200).send("Deleted Successfully");
}
catch(err){
   res.status(500).send("Internal Server Error ");
}
}




module.exports={register,login,logout,adminRegister,deleteProfile};