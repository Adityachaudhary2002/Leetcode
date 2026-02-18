const problem=require("../models/problem");
const submission=require("../models/submission");
const {getLanguageById,submitbatch,submitToken}=require("../utils/problemUtility");

const submitCode = async(req,res)=>{
try{
   const userId=req.params._id;
   const problemId=req.params._id;
   const{code,language}=req.body;
   if(!userId||!code||!problemId||!language)
   return res.status(400).send("Some field missing"); 

   // fetch the problem from database
  const problem=await problem.findById(problemId);

  //testcases(Hidden)


  //we store our submission into database before judge0
  const submittedResult=await submission.create({
   userId,
   problemId,
   code,
   language,
   status:'pending',
   testCasesTotal:problem.hiddeenTestCases.length,
  })

  // judge0 ko code submit karna hai
     const languageId=getLanguageById(language);


   const submissions=problem.hiddeenTestCases.map((testcase)=>({
                source_code:code,
                language_id:languageId,
                stdin:testcase.Input,
                expected_output:testcase.output,
            }));
             const submitResult=await submitbatch(submissions);
           const resultToken=submitResult.map((value)=>value.token);
        const testResult=await submitToken(resultToken);

        //submittedResult ko update karna hoga
        let testCasesPassed=0;
        let memory=0;
        let status='accepted';
        let errorMessage=null;
        for(const test of testResult){
            if(test.status_id==3){
                testCasesPassed++;
                runtime=runtime+parseFloat(test.time)
                memory=math.max(memory,test.memory);

            }
            else{
                if(test.status_id==4){
                    status='error'
                    errorMessage=test.stderr
                }
                else{
                    status='wrong'
                    errorMessage=test.stderr
                }
            }
        }

      // store the result in database in submission
        submittedResult.status=status;
        submittedResult.testCasesPassed=testCasesPassed
        submittedResult.errorMessage=errorMessage;
        submittedResult.runtime=runtime;
        submittedResult.memory=memory;

        await submittedResult.save();
        
        // problemId ko insert krenge userSchema ke problemsolved me if it is not present there.
        if (!req.result.problemSolved.includes(problemId)){
            req.result.problemSolved.push(problemId);
            await req.result.save();
        }


        res.status(201).send(submittedResult);

}
catch(err){
  res.staus(500).send("Internal server Error"+err);
}

}


const runCode= async(req,res)=>{
    try{
   const userId=req.params._id;
   const problemId=req.params._id;
   const{code,language}=req.body;
   if(!userId||!code||!problemId||!language)
   return res.status(400).send("Some field missing"); 

   // fetch the problem from database
  const problem=await problem.findById(problemId);

  //testcases(Hidden)

  // judge0 ko code submit karna hai
     const languageId=getLanguageById(language);


   const submissions=problem.visibleTestCases.map((testcase)=>({
                source_code:code,
                language_id:languageId,
                stdin:testcase.Input,
                expected_output:testcase.output,
            }));
             const submitResult=await submitbatch(submissions);
           const resultToken=submitResult.map((value)=>value.token);
        const testResult=await submitToken(resultToken);

        res.status(201).send(submittedResult);

}
catch(err){
  res.staus(500).send("Internal server Error"+err);
}
}
module.exports={submitCode,runCode};