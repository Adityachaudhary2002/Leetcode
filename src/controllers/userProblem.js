
const{ getLanguageById, submitbatch, submitToken } = require("../utils/problemUtility");
const{ findByIdAndUpdate } =require("../models/problem");
 const createProblem=async(req,res)=>{
    const{title,description,difficulty,tags,visibleTestCases,hiddenTestCases,startcode,referenceSolution,ProblemCreator}=req.body;

    try{
      
        for(const {language,completeCode} of referenceSolution){

            //src code
            //language id:
            //stdin:
            //expectedOutput:
            const languageId=getLanguageById(language);
            // I am creating Batch submission
            const submissions=visibleTestCases.map((testcase)=>({
                source_code:completeCode,
                language_id:languageId,
                stdin:testcase.Input,
                expected_output:testcase.output,
            }));
            const submitResult=await submitbatch(submissions);
            const resultToken=submitResult.map((value)=>value.token);

            const testResult=await submitToken(resultToken);
            for(const test of testResult){
                if(test.status_id!=3){
                    return res.status(400).send("Error Occured");
                }
            }
        }

        // we can store it in our DB
         const userproblem=await ProblemCreator.create({
            ...req.body,
            problemCreator: req.result._id
        });
        res.status(201).send("Problem saved Successfully");
    }
    catch(err){
     res.status(400).send("Error"+err);
    }
}
const updateProblem=async(req,res)=>{
 const{id} = req.params
 const{title,description,difficulty,tags,visibleTestCases,hiddenTestCases,startcode,referenceSolution,ProblemCreator}=req.body;
 try{
    if(!id){
        res.status(400).send("Missing ID Field");
    }
    const DsaProblem=await ProblemfindId(id);
    if(!DsaProblem){
        return res.status(404).send("ID is not present in server");
    }

 for(const {language,completeCode} of referenceSolution){

            //src code
            //language id:
            //stdin:
            //expectedOutput:
            const languageId=getLanguageById(language);
            // I am creating Batch submission
            const submissions=visibleTestCases.map((testcase)=>({
                source_code:completeCode,
                language_id:languageId,
                stdin:testcase.Input,
                expected_output:testcase.output,
            }));
            const submitResult=await submitbatch(submissions);
            const resultToken=submitResult.map((value)=>value.token);

            const testResult=await submitToken(resultToken);
            for(const test of testResult){
                if(test.status_id!=3){
                    return res.status(400).send("Error Occured");
                }
            }
        }

 await findByIdAndUpdate(id,{...req.body},{runValidators:true,new:true});
   res.status(200).send(newProblem);

 }
catch(err){
  res.status(500).send("Error"+err);
}
}
const deleteProblem=async(req,res)=>{
   const{id}=req.params;
   try{
if(!id)
    return res.status(400).send("ID is Missing");

const deletedProblem=await Problem.findIdByDelete(id);
if(!deletedProblem)
    return res.status(400).send("Problem is Missing");
res.status(200).send("Successfully Deleted");
   }
   catch(err){
   res.status(500).send("Error"+err);
   } 
}
const getProblemById=async(req,res)=>{
const{id}=req.params;
   try{
if(!id)
    return res.status(400).send("ID is Missing");

const getProblem=await Problem.findById(id);
if(!getProblem)
    return res.status(400).send("Problem is Missing");
res.status(200).send(getProblem);
   }
   catch(err){
   res.status(500).send("Error"+err);
   } 
}
const getAllProblem=async(req,res)=>{
   
   try{

    const getProblem=await Problem.find({});
  if(!getProblem)
    return res.status(400).send("Problem is Missing");
   res.status(200).send(getProblem);
   }
   catch(err){
   res.status(500).send("Error"+err);
   }  
}
export default{createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem};