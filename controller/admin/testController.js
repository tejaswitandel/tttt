const user = require("../../model/user")
const account = require("../../model/account")
const customQueryService = require("../../services/customQueryService.js")
const testService = require("../../services/admin/testService"); 
const utils = require("../../utils/messages")
/* 
* dfdf
*/
const test=async (req,res)=>{
try {
        if(combinedOutput){
            return utils.successResponse(combinedOutput,res);
        }
    } catch (error) {
        throw error;
    }
}    
/* 
* test
*/
const test=async (req,res)=>{
try {
    // let result =  testService.test();
    
    let isValid={};
    let combinedOutput={};
    const validation = require("../../utils/validateRequest");  
        const query_6198 = {}
        query_6198.filter = {"username":{"$exists":false}}
        
        let list = await customQueryService.find(user,query_6198)
        combinedOutput.list = list
        const query_1312 = {}
        query_1312.filter = "{\"username\":{\"$exists\":false,\"$eq\":\"test\"},\"name\":{\"$exists\":true}}"
        
        let data = await customQueryService.find(user,query_1312)
        combinedOutput.data = data
        if(combinedOutput){
            return utils.successResponse(combinedOutput,res);
        }
    } catch (error) {
        throw error;
    }
}    
/* 
* sdsd
*/
const test=async (req,res)=>{
try {
    // let result =  testService.test();
    
    let isValid={};
    let combinedOutput={};
    const validation = require("../../utils/validateRequest");  
        const query_6626 = {}        
        let test = await customQueryService.find(account,query_6626)
        combinedOutput.test = test
        const query_1009 = {}
        query_1009.filter = "{\"username\":\"sdas\",\"name\":{\"$exists\":false},\"password\":\"csdsds\"}"
        
        let count = await customQueryService.find(user,query_1009)
        combinedOutput.count = count
        const query_6096 = {}
        query_6096.filter = "\"{\\\"name\\\":{\\\"$exists\\\":false}}\""
        
        let account = await customQueryService.find(account,query_6096)
        combinedOutput.account = account
        const query_7212 = {}
        query_7212.filter = "\"{\\\"name\\\":{\\\"$exists\\\":true}}\""
        
        let accountCount = await customQueryService.find(account,query_7212)
        combinedOutput.accountCount = accountCount
        if(combinedOutput){
            return utils.successResponse(combinedOutput,res);
        }
    } catch (error) {
        throw error;
    }
}    
module.exports={
    test,
    test,
    test,
}

    

