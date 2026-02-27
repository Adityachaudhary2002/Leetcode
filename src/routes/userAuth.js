const express=require('express');
const authRouter=express.Router();
const {register,login,logout,adminRegister,deleteProfile}=require('../controllers/userAuthent');


const userMiddleware=require('../middleware/userMiddleware');
const adminMiddleware=require('../middleware/adminMiddleware');


//register
authRouter.post('/register',register);
//login
authRouter.post('/login',login);
//logout
authRouter.post('/logout', userMiddleware,logout);
//admin 
authRouter.post('/admin/register',adminMiddleware,adminRegister);
//getprofile
//authRouter.get('/getprofile',getprofile);
authRouter.delete('/profile',userMiddleware,deleteProfile);


module.exports=authRouter;
