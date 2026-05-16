// // const user=require("validator");
// const validator=(data)=>{
//     const mandatoryField=['firstName',"emailId",'password'];
//    const IsAllowed= mandatoryField.every((k)=>Object.keys(data).includes(k));
//    if(!IsAllowed)
//     throw new Error("some Feild missing");
//   if(!validator.isEmail(data.emaiId))
//     throw new Error("Invalid email");
// if(!validator.isStrongPassword(data.password))
//     throw new Error("weak password");

// }

// module.export=validator; 

const v = require("validator");

const validator = (data) => {
  const mandatoryField = ['firstName', 'emailId', 'password'];
  const isAllowed = mandatoryField.every((k) => Object.keys(data).includes(k));
  
  if (!isAllowed)
    throw new Error("Some field missing");
  
  if (!v.isEmail(data.emailId))
    throw new Error("Invalid email");
  
  if (!v.isStrongPassword(data.password))
    throw new Error("Weak password");
};

module.exports = validator;