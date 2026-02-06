const user=require("validator");
const validator=(data)=>{
    const mandatoryField=['firstName',"emailId",'password'];
   const IsAllowed= mandatoryField.every((k)=>Object.keys(data).includes(k));
   if(!IsAllowed)
    throw new Error("some Feild missing");
  if(!validator.isEmail(data.emaiID))
    throw new Error("Invalid email");
if(!validator.isStrongPassword(data.password))
    throw new Error("week password");

}

module.export=validator; 