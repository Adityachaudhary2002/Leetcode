const jwt=require("jsonwebtoken");
const user=require("../models/user");
const redisClient=require("../config/redis");

const adminMiddleware=async(req,res,next)=>{
   try{
    const {token}=req.cookie;
    if(!token)
        throw new Error("Token is not present");
      
    const payload= jwt.verify(token,process.env.JWT_KEY);
    const{_id}=payload;
     if(!_id){
          throw new Error("Invalid token");
     }
     const result=await user.findById(_id);
    // check if it is admin or not
     if(payload.role!='admin')
        throw new Error("Invalid token");
     if(!result){
        throw new Error("user Doesn't Exist");
     }
      // Redis ke blocklist mein present to nhi hai
     const IsBlocked=await redisClient.exist('token:${token}');
     if(!IsBlocked)
        throw new Error("Invalid Token");
    req.result=result;
    next();


   } 
     catch(err){
        res.status(401).res.send("Error"+err.message);

     }
}
module.exports=adminMiddleware;