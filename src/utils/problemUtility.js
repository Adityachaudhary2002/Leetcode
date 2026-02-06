
const axios=require('axios');
const getLanguageById=(lang)=>{
    const language={
        "c++":54,
        "java":62,
        "javascript":63,
    }
    return language[lang.toLowercase()];
}

const submitBatch=async(submissions)=>{



}
module.export=(getLanguageById,submitBatch);