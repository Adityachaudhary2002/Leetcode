
const{ getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");
// const{ findByIdAndUpdate } =require("../models/problem");
 const Problem=require("../models/problem");
 const user=require("../models/user");
 const submission=require("../models/submission");

 const createProblem=async(req,res)=>{
    const{title,description,difficulty,tags,visibleTestCases,hiddenTestCases,startcode,referenceSolution,ProblemCreator}=req.body;

    try{
      
        for(const {language,completecode} of referenceSolution){

            //src code
            //language id:
            //stdin:
            //expectedOutput:
             let lang = language.toLowerCase();  // 'C++' → 'c++'
            const languageId=getLanguageById(lang);
            // I am creating Batch submission
            const submissions=visibleTestCases.map((testcase)=>({
                source_code:completecode,
                language_id:languageId,
                stdin:testcase.input,
                expected_output:testcase.output,
            }));
              console.log("=== SUBMISSION DEBUG ===");
              console.log("language:", lang);
              console.log("languageId:", languageId);
              console.log("source_code:", submissions[0].source_code);
              console.log("stdin:", submissions[0].stdin);
              console.log("expected_output:", submissions[0].expected_output);
              console.log("========================");
            const submitResult=await submitBatch(submissions);
            const resultToken=submitResult.map((value)=>value.token);

            const testResult=await submitToken(resultToken);
            for(const test of testResult){
                if(test.status_id!=3){
                    return res.status(400).json({ message: "Test cases failed for reference solution (status_id: " + test.status_id + ")" });
                }
            }
        }

        // we can store it in our DB
         const userProblem=await Problem.create({
            ...req.body,
            problemCreator: req.result._id
        });
        res.status(201).json({ message: "Problem saved Successfully" });
    }
    catch(err){
     res.status(400).json({ message: err.message });
    }
}
const updateProblem=async(req,res)=>{
 const{id} = req.params
 const{title,description,difficulty,tags,visibleTestCases,hiddenTestCases,startcode,referenceSolution,ProblemCreator}=req.body;
 try{
    if(!id){
        res.status(400).send("Missing ID Field");
    }
    const DsaProblem=await Problem.findId(id);
    if(!DsaProblem){
        return res.status(404).send("ID is not present in server");
    }

 for(const {language,completecode} of referenceSolution){

            //src code
            //language id:
            //stdin:
            //expectedOutput:
            const languageId=getLanguageById(language);
            // I am creating Batch submission
            const submissions=visibleTestCases.map((testcase)=>({
                source_code:completecode,
                language_id:languageId,
                stdin:testcase.input,
                expected_output:testcase.output,
            }));
            const submitResult=await submitBatch(submissions);
            const resultToken=submitResult.map((value)=>value.token);

            const testResult=await submitToken(resultToken);
            for(const test of testResult){
                if(test.status_id!=3){
                    return res.status(400).send("Error Occured");
                }
            }
        }

 const newProblem = await  Problem.findByIdAndUpdate(id,{...req.body},{runValidators:true,new:true});
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
    return res.status(404).send("Problem is Missing");
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

const getProblem=await Problem.findById(id).select('_id title description difficulty tags  visibleTestCases  startcode referenceSolution');
if(!getProblem)
    return res.status(404).send("Problem is Missing");
res.status(200).send(getProblem);
   }
   catch(err){
   res.status(500).send("Error"+err);
   } 
}
const getAllProblem=async(req,res)=>{
   
   try{

    const getProblem=await Problem.find({}).select('_id title difficulty tags');
  if(getProblem.length==0)
    return res.status(404).send("Problem is Missing");
   res.status(200).send(getProblem);
   }
   catch(err){
   res.status(500).send("Error"+err);
   }  
}
const solvedAllProblemByUser=async(req,res)=>{
   try{
     // const count=req.result.problemSolved.length;
     // res.status(200).send(req.result.problemSolved);
     const userId=req.result._id;
    const user=await user.findById(userId).populate({
        path:"problemSolved",
        select:"_id title difficulty tags",
    });
       res.status(200).send(user.problemSolved);
   }
   catch(err){
     res.status(500).send("Server Error");
   }
}
const submittedProblem=async(req,res)=>{
    try{
const userId=req.result._id;
const problemId=req.params.pid;
 const ans= await submission.find({userId,problemId});
 if(ans.length==0)
    res.status(200).send("NO Submission is present");

    res.status(200).send(ans);
    }
    catch(err){
res.status(500).send("Internal Sever Error");
    }
}
module.exports={createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblemByUser,submittedProblem};