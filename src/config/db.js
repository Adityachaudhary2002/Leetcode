 const mongoose=require('mongoose');
 async function main(){
    await mongoose.connnect(process.env.DB_CONNECT_STRING)

 }
 module.export=main;