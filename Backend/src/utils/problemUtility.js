
const axios=require('axios');
const getLanguageById=(lang)=>{
    const language={
        "c++":54,
        "java":62,
        "javascript":63,
    }
    return language[lang.toLowerCase()];
}
const waiting=async(Timer)=>{
  return new Promise((resolve)=>{
    setTimeout(resolve,Timer);
  });
}
// const waiting = (timer) => {
//     return new Promise((resolve) => {
//         setTimeout(resolve, timer);
//     });
// }

// const submitBatch=async(submissions)=>{
//     try {
//         const promises = submissions.map(async (sub) => {
//             const options = {
//                 method: 'POST',
//                 url: 'https://judge0-ce.p.rapidapi.com/submissions',
//                 params: {
//                     base64_encoded: 'true',
//                     fields: '*'
//                 },
//                 headers: {
//                     'x-rapidapi-key': process.env.JUDGE0_KEY,
//                     'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
//                     'Content-Type': 'application/json'
//                 },
//                 data: sub
//             };
//             const response = await axios.request(options);
//             return { token: response.data.token };
//         });
        
//         return await Promise.all(promises);
//     } catch (error) {
//         console.error("submitBatch individual:", error.response?.data || error.message);
//         throw new Error(`Judge0 API Error: ${error.response?.data?.message || error.message}`);
//     }
// }
const submitBatch=async(submissions)=>{
    try {
        const toBase64 = (str) => Buffer.from(str || '').toString('base64');

        const promises = submissions.map(async (sub) => {
            const options = {
                method: 'POST',
                url: 'https://judge0-ce.p.rapidapi.com/submissions',
                params: {
                    base64_encoded: 'true',
                    fields: '*'
                },
                headers: {
                    'x-rapidapi-key': process.env.JUDGE0_KEY,
                    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
                    'Content-Type': 'application/json'
                },
                data: {
                    source_code: toBase64(sub.source_code),        // ✅
                    language_id: sub.language_id,                  // ✅ no encoding
                    stdin: toBase64(sub.stdin),                    // ✅
                    expected_output: toBase64(sub.expected_output) // ✅
                }
            };
            const response = await axios.request(options);
            return { token: response.data.token };
        });
        
        return await Promise.all(promises);
    } catch (error) {
        console.error("submitBatch individual:", error.response?.data || error.message);
        throw new Error(`Judge0 API Error: ${error.response?.data?.message || error.message}`);
    }
}
const submitToken=async(resultTokens)=>{
  async function fetchSingleToken(token) {
    const options = {
        method: 'GET',
        url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
        params: {
            base64_encoded: 'true',
            fields: '*'
        },
        headers: {
            'x-rapidapi-key': process.env.JUDGE0_KEY,
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
        }
    };
    const response = await axios.request(options);
    return response.data;
  }
  
  while(true){
    try {
      const results = await Promise.all(resultTokens.map(t => fetchSingleToken(t)));
      
      const isResultObtained = results.every((r) => r.status_id > 2);
    
      if(isResultObtained){
         const fromBase64=(str)=>
          str?Buffer.from(str,"base64").toString("utf-8"):null;
  
         results.forEach((r)=>{
          r.stdout=fromBase64(r.stdout);
          r.stderr=fromBase64(r.stderr);
          r.compile_output=fromBase64(r.compile_output);
         });
  
         return results;
      }
      
      await waiting(1000);
    } catch (error) {
      console.error("submitToken individual:", error.response?.data || error.message);
      throw new Error(`Judge0 API Error: ${error.response?.data?.message || error.message}`);
    }
  }
}
module.exports={getLanguageById,submitBatch,submitToken};