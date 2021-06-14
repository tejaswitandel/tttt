const Account = require("../../model/account")
const utils = require("../../utils/messages")
const accountSchemaKey = require("../../utils/validation/accountValidation");
const validation = require("../../utils/validateRequest");
const dbService = require("../../utils/dbService");

const addAccount = async(req, res) => {
    try {
        let isValid = validation.validateParamsWithJoi(req.body,accountSchemaKey.schemaKeys);
        if (isValid.error) {
            return utils.inValidParam(isValid.details, res);
        } 
        const data = new Account({
            ...req.body,
        })
        let result = await dbService.createDocument(Account,data);
        

        return  utils.successResponse(result, res);
    } catch (error) {
        if(error.name === "ValidationError"){
            return utils.validationError(error.message, res);
        }
        if(error.code && error.code == 11000){
            return utils.isDuplicate(error.message, res);
        }
        return utils.failureResponse(error.message,res); 
    }
}
const findAllAccount = async(req, res) => {
    try {
        let options = {}
        let query={}
        let result;
        if(req.body.isCountOnly){
            if (req.body.query !== undefined) {
                query = { ...req.body.query }
            }
            result = await dbService.countDocument(Account, query);
            if (result) {
                result = { totalRecords: result }
                return utils.successResponse(result, res);
            } 
            return utils.recordNotFound([], res)
        }
        else {
            if (req.body.options !== undefined) {
                if(req.body.options.populate){
                    delete req.body.options.populate;
                }
                options = { ...req.body.options };
                
                if(req.body.query !==undefined){
                    query={...req.body.query}
                }
                result = await dbService.getAllDocuments( Account,query,options);
               
                if(!result){
                    return utils.recordNotFound([],res);
                }
                return utils.successResponse(result, res);
            }
        }
    }
    catch(error){
        return utils.failureResponse(error.message,res);
    }
}

const getAccount = async(req, res) => {
    try {
        let query={};
        query.id = req.params.id;
        let result = await dbService.getDocumentByQuery(Account,query);
        
        if(result){
            return  utils.successResponse(result, res);
        }
        return utils.recordNotFound([],res);
    }
    catch(error){
        return utils.failureResponse(error.message,res)
    }
}
const getAccountCount = async(req, res) => {
    try {
        let where ={};
        if(req.body.where){
            where = req.body.where;
        }
        let result = await dbService.countDocument(Account,where);
        if(result){
            result = {totalRecords:result}
            return utils.successResponse(result, res);
        }
        return utils.recordNotFound([],res);
    }
    catch(error){
        return utils.failureResponse(error.message,res);
    }
}

const getAccountByAggregate = async (req,res)=>{
    try{
        let result=await dbService.getDocumentByAggregation(Account,req.body);
        if(result){
            return utils.successResponse(result, res);
        }
        return utils.recordNotFound([],res);
    }catch(error){
        return utils.failureResponse(error.message,res)
    }
}
const updateAccount = async(req, res) => {
    try {
        const data = {
                ...req.body,
            id:req.params.id
        }
        let isValid = validation.validateParamsWithJoi(
            data,
            accountSchemaKey.schemaKeys
        );
        if (isValid.error) {
            return  utils.inValidParam(isValid.details, res);
        }
        let result = await dbService.findOneAndUpdateDocument(Account,{_id:req.params.id},data,{new:true});
        if(!result){
            return utils.failureResponse("something is wrong",res)
        }
        
        return  utils.successResponse(result, res);
    }
    catch(error){
        if(error.name === "ValidationError"){
            return utils.isDuplicate(error.message, res);
        }
        if(error.code && error.code == 11000){
            return utils.isDuplicate(error.message, res);
        }
        return utils.failureResponse(error.message,res);
    }
}
const partialUpdateAccount = async (req, res) => {
    try {
        const data = {
            ...req.body,
            id: req.params.id
        }
        let isValid = validation.validateParamsWithJoi(
            data,
            accountSchemaKey.updateSchemaKeys
        );
        if (isValid.error) {
            return utils.inValidParam(isValid.details, res);
        }
        let result = await dbService.updateDocument(Account, req.params.id, data);
        if (!result) {
            return utils.failureResponse("something is wrong", res)
        }
        
        return utils.successResponse(result, res);
    }
    catch(error){
        return utils.failureResponse(error.message, res)
    }
}
const softDeleteAccount = async (req, res) => {
    try{
        let result = await dbService.updateDocument(Account, { _id: req.params.id }, { isDeleted: true });
        if(!result){
            return utils.failedSoftDelete(res);
        }
        return  utils.successResponse(result, res);
    }catch(error){
        return utils.failureResponse(error.message,res); 
    }
}
const bulkInsertAccount = async(req,res)=>{
    try{
        let data;   
        if(req.body.data !== undefined && req.body.data.length){
            data = req.body.data;
            let result =await dbService.bulkInsert(Account,data);
            return  utils.successResponse(result, res);
        }else{
            return utils.failureResponse('Invalid Data',res)
        }  
    }catch(error){
        if(error.name === "ValidationError"){
            return utils.validationError(error.message, res);
        }
        if(error.code && error.code == 11000){
            return utils.isDuplicate(error.message, res);
        }
        return utils.failureResponse(error.message,res);
    }
}
const bulkUpdateAccount=async(req,res)=>{
    try {
        let filter={};
        let data;
        if(req.body.filter !== undefined){
            filter = req.body.filter
        }
        if(req.body.data !== undefined){
            data = req.body.data;
            let result = await dbService.bulkUpdate(Account,filter,data);
            if(!result){
                return utils.failureResponse("something is wrong.",res)
            }
            return  utils.successResponse(result, res);
        }
        else{
            return utils.failureResponse("Invalid Data", res)
        }
    }
    catch(error){
        return utils.failureResponse(error.message,res); 
    }
}


module.exports = {
    addAccount,
    findAllAccount,
    getAccount,
    getAccountCount,
    getAccountByAggregate,
    updateAccount,
    partialUpdateAccount,
    softDeleteAccount,
    bulkInsertAccount,
    bulkUpdateAccount,
}
