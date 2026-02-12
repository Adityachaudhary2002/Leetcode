
const {getLanguageById,submitbatch,submitToken}= require("../utils/problemUtility");
const Problem= require("../models/problem")
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
module.exports=createProblem;