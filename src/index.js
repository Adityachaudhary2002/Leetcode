const express= require('express')
const app=express();
require('dotenv').config();
const main=require('./config/db')
const cookieparser =require('cookie-parser');
const authRouter=require("./routes/userAuth");
const port=3000

app.use(express.json());
app.use(cookieparser());
app.use('/user',authRouter);

const InitializeConnection=async()=>{
    try{
        await Promise.all([main(),redisClient.connect()]);
        console.log("DB Connected");
        app.listen(process.env.PORT,()=>{
    console.log("server  listening at port number:"+process.env.PORT);
})
    }
    catch(err){
       console.log("Error"+err);
    }
}
InitializeConnection();
console.log(`Server is listening at ${port} port`)











//main()
//.then(async()=>{
   // app.listen(process.env.PORT,()=>{
   //      console.log("server listening at port number:"+process.env.PORT);
  //  })
//})
//.catch(err=>console.log("Error Occured:"+err));
//app.listen(process.env.PORT,()=>{
 //   console.log("server at port number:"+process.env.PORT);
//})