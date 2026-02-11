
const {getLanguageById,submitbatch}= require("../utils/problemUtility");
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
            const submissions=visibleTestCases.map((Input,output)=>({
                source_code:completeCode,
                language_id:languageId,
                stdin:Input,
                expected_output:output,
            }));
            const submitResult=await submitbatch(submissions);

        }

        
    }
    catch(err){

    }
}