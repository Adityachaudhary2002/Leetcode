const redisClient = require("../config/redis");
const User = require("../models/user");
const validator = require('../utils/validator');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Submission = require("../models/submission");

// ✅ cookie options reused everywhere
const cookieOptions = {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
    domain: 'localhost',
};

const register = async (req, res) => {
    try {
        validator(req.body);
        const { firstName, emailId, password } = req.body;
        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = 'user';

        const user = await User.create(req.body);
        const token = jwt.sign(
            { _id: user._id, emailId, role: 'user' },
            process.env.JWT_KEY,
            { expiresIn: 60 * 60 }
        );
        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
            role: user.role,
        };
        res.cookie('token', token, cookieOptions); // ✅ fixed
        res.status(201).json({ user: reply, message: "Registered successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message }); // ✅ json
    }
};

const login = async (req, res) => {
    try {
        console.log("1. Body received:", req.body);

        const { emailId, password } = req.body;
        if(!emailId) throw new Error("emailId missing");
        if(!password) throw new Error("password missing");

        const user = await User.findOne({ emailId });
        console.log("2. User found:", !!user);
        if(!user) throw new Error("User not found");

        const match = await bcrypt.compare(password, user.password);
        console.log("3. Password match:", match);
        if(!match) throw new Error("Password wrong");

        console.log("4. JWT_KEY exists:", !!process.env.JWT_KEY);

        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
            role: user.role,
        };
        const token = jwt.sign(
            { _id: user._id, emailId, role: user.role },
            process.env.JWT_KEY,
            { expiresIn: 60 * 60 }
        );
        res.cookie('token', token, cookieOptions);
        res.status(200).json({ user: reply, message: "Login successfully" });

    } catch (err) {
        console.log("5. ERROR:", err.message); // ← tells us exactly what failed
        res.status(401).json({ message: err.message });
    }
};


// const login = async (req, res) => {
//     try {
//         const { emailId, password } = req.body;
//         if(!emailId) throw new Error("Invalid credentials");
//         if(!password) throw new Error("Invalid credentials");

//         const user = await User.findOne({ emailId });
//         if(!user) throw new Error("Invalid credentials");

//         const match = await bcrypt.compare(password, user.password);
//         if(!match) throw new Error("Invalid credentials");

//         const reply = {
//             firstName: user.firstName,
//             emailId: user.emailId,
//             _id: user._id,
//             role: user.role,
//         };
//         const token = jwt.sign(
//             { _id: user._id, emailId, role: user.role },
//             process.env.JWT_KEY,
//             { expiresIn: 60 * 60 }
//         );
//         res.cookie('token', token, cookieOptions); // ✅ fixed
//         res.status(200).json({ user: reply, message: "Login successfully" });
//     } catch (err) {
//         res.status(401).json({ message: err.message }); // ✅ json
//     }
// };

const logout = async (req, res) => {
    try {
        const { token } = req.cookies;
        if(!token) throw new Error("Already logged out"); // ✅ check token
        const payload = jwt.decode(token);
        if(!payload) throw new Error("Invalid token");   // ✅ check payload
        await redisClient.set(`token:${token}`, 'Blocked');
        await redisClient.expireAt(`token:${token}`, payload.exp);
        res.cookie("token", null, { expires: new Date(Date.now()) });
        res.json({ message: "Logged out successfully" }); // ✅ json
    } catch (err) {
        res.status(503).json({ message: err.message }); // ✅ json
    }
};

const adminRegister = async (req, res) => {
    try {
        validator(req.body);
        const { emailId, password } = req.body;
        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = 'admin'; // ✅ set admin role
        const user = await User.create(req.body);
        const token = jwt.sign(
            { _id: user._id, emailId, role: user.role },
            process.env.JWT_KEY,
            { expiresIn: 60 * 60 }
        );
        res.cookie('token', token, cookieOptions); // ✅ fixed
        res.status(201).json({ message: "Admin Registered Successfully" }); // ✅ json
    } catch (err) {
        res.status(400).json({ message: err.message }); // ✅ json
    }
};

const deleteProfile = async (req, res) => {
    try {
        const userId = req.result._id;
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: "Deleted Successfully" }); // ✅ json
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" }); // ✅ json
    }
};

module.exports = { register, login, logout, adminRegister, deleteProfile };




//  const redisClient=require("../config/redis")
//  const User = require("../models/user");
// // const user=require("../models/user")
//  const validator=require('../utils/validator');
//  const bcrypt=require("bcrypt");
//  const jwt=require('jsonwebtoken');
//  const submission= require("../models/submission");
// const user = require("../models/user");


// const register=async(req,res)=>{
// try{
//     //validate the data;
//     validator(req.body);
//   const {firstName,emailId,password}=req.body;
//    req.body.password=await bcrypt.hash(password,10);
//    req.body.role='user'
   
// const user=await user.create(req.body);
// const token= jwt.sign ({_id:user._id,emailId:emailId,role:'user'},process.env.JWT_KEY,{expiresIn:60*60});
// const reply={
//         firstName:user.firstName,
//         emailId:user.emailId,
//         _id:user._id,
//         role:user.role,
//     }
//    res.cookie('token',token,{maxAge:60*60*1000});
//    res.status(201).json({
//     user:reply,
//     message:"Loggin successfully"
//    })
// }
// catch(err){
//     res.status(400).send("Error:"+err);
// }
// }

// const login=async(req,res)=>{
//     try{
//       const {emailId,password}=req.body;
//       if(!emailId)
//         throw new Error("Invalid credentils");
//     if(!password)
//         throw new Error("Invalid credentils");
//     const user=await user.findone({emailId});
//     const match=bcrypt.compare(password,user.password);
//     if(!match)
//         throw new Error("Invalid credentials");
//     const reply={
//         firstName:user.firstName,
//         emailId:user.emailId,
//         _id:user._id,
//         role:user.role,
//     }
//       const token= jwt.sign ({_id:user._id,emailId:emailId,role:user.role},process.env.JWT_KEY,{expiresIn:60*60});
//       res.cookie('token',token,{maxAge:60*60*1000});
//       res.status(201).json({
//         user:reply,
//         message:"Loggin Successfully"
//       })

//     }
//     catch{
//     res.status(401).send("Error"+err);
//     }
// }
// const logout=async(req,res)=>{
//     try{
//      const {token}=req.cookie;
//      const payload=jwt.decode(token);
//      await redisClient.set('token:${token}','Blocked');
//      await redisClient.expireAt('token:${token}',payload.exp);
//       res.cookie("token",null,{expires:new Date(Date.now())});
//       res.send("Logged out successfully");
//     }
//     catch{
// res.status(503).res.send("Error"+err);
//     }
// }
// const adminRegister=async(req,res)=>{
//     try{
//         //validate the data;
//         //if(req.result.role!='admin')
//         //throw new Error("Invalid Credentials");
//         validator(req.body);
//         const{firstName,emailId,password} =req.body;
//         req.body.password=await bcrypt.hash(password,10);
//         const user=await user.create(req.body);
//         const token=jwt.sign({_id:user._id,emailId:emailId,role:user.role},process.env.JWT_KEY,{expiresIn:60*60});
//         res.cookie('token',token,{maxage:60*60*1000});
//         res.status(201).send("User Registered Successfully");
//     }
//     catch(err){
//         res.status(400).send("User Registered Successfully");

//     }
// }
// const deleteProfile=async(req,res)=>{
// try{
// const userId=req.result_id;

// //user Schema delete
//  await user.findByIdAndDelete(userId);

//  // submission se bhi delete karo
//  //await submission.deleteMany({userId});
//  res.status(200).send("Deleted Successfully");
// }
// catch(err){
//    res.status(500).send("Internal Server Error ");
// }
// }




// module.exports={register,login,logout,adminRegister,deleteProfile};



// const redisClient = require("../config/redis");
// const User = require("../models/user");
// const validator = require('../utils/validator');
// const bcrypt = require("bcrypt");
// const jwt = require('jsonwebtoken');
// const Submission = require("../models/submission");

// const register = async (req, res) => {
//   try {
//     validator(req.body);
//     const { firstName, emailId, password } = req.body;
//     req.body.password = await bcrypt.hash(password, 10);
//     req.body.role = 'user';

//     const user = await User.create(req.body);
//     const token = jwt.sign(
//       { _id: user._id, emailId: emailId, role: 'user' },
//       process.env.JWT_KEY,
//       { expiresIn: 60 * 60 }
//     );
//     const reply = {
//       firstName: user.firstName,
//       emailId: user.emailId,
//       _id: user._id,
//       role: user.role,
//     };
//     res.cookie('token', token, { maxAge: 60 * 60 * 1000 });
//     res.status(201).json({ user: reply, message: "Registered successfully" });
//   } catch (err) {
//     res.status(400).send("Error: " + err);
//   }
// };

// const login = async (req, res) => {
//   try {
//     const { emailId, password } = req.body;
//     if (!emailId) throw new Error("Invalid credentials");
//     if (!password) throw new Error("Invalid credentials");

//     const user = await User.findOne({ emailId });
//     if (!user) throw new Error("Invalid credentials");

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) throw new Error("Invalid credentials");

//     const reply = {
//       firstName: user.firstName,
//       emailId: user.emailId,
//       _id: user._id,
//       role: user.role,
//     };
//     const token = jwt.sign(
//       { _id: user._id, emailId: emailId, role: user.role },
//       process.env.JWT_KEY,
//       { expiresIn: 60 * 60 }
//     );
//     res.cookie('token', token, { maxAge: 60 * 60 * 1000 });
//     res.status(200).json({ user: reply, message: "Login successfully" });
//   } catch (err) {
//     res.status(401).send("Error: " + err);
//   }
// };

// const logout = async (req, res) => {
//   try {
//     const { token } = req.cookies;
//     const payload = jwt.decode(token);
//     await redisClient.set(`token:${token}`, 'Blocked');
//     await redisClient.expireAt(`token:${token}`, payload.exp);
//     res.cookie("token", null, { expires: new Date(Date.now()) });
//     res.send("Logged out successfully");
//   } catch (err) {
//     res.status(503).send("Error: " + err);
//   }
// };

// const adminRegister = async (req, res) => {
//   try {
//     validator(req.body);
//     const { firstName, emailId, password } = req.body;
//     req.body.password = await bcrypt.hash(password, 10);
//     const user = await User.create(req.body);
//     const token = jwt.sign(
//       { _id: user._id, emailId: emailId, role: user.role },
//       process.env.JWT_KEY,
//       { expiresIn: 60 * 60 }
//     );
//     res.cookie('token', token, { maxAge: 60 * 60 * 1000 });
//     res.status(201).send("Admin Registered Successfully");
//   } catch (err) {
//     res.status(400).send("Error: " + err);
//   }
// };

// const deleteProfile = async (req, res) => {
//   try {
//     const userId = req.result._id;
//     await User.findByIdAndDelete(userId);
//     res.status(200).send("Deleted Successfully");
//   } catch (err) {
//     res.status(500).send("Internal Server Error");
//   }
// };

// module.exports = { register, login, logout, adminRegister, deleteProfile };