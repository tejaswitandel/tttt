const Nirali = require("../../model/Nirali")
const utils = require("../../utils/messages")
const NiraliSchemaKey = require("../../utils/validation/NiraliValidation");
const validation = require("../../utils/validateRequest");
const dbService = require("../../utils/dbService");

const addNirali = async(req, res) => {
    try {
        let isValid = validation.validateParamsWithJoi(req.body,NiraliSchemaKey.schemaKeys);
        if (isValid.error) {
            return utils.inValidParam(isValid.details, res);
        } 
        const data = new Nirali({
            ...req.body,
        })
        let result = await dbService.createDocument(Nirali,data);
        result = (({test,id}) => ({test,id}))(result);
        

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
const findAllNirali = async(req, res) => {
    try {
        let options = {}
        let query={}
        let result;
        if(req.body.isCountOnly){
            if (req.body.query !== undefined) {
                query = { ...req.body.query }
            }
            result = await dbService.countDocument(Nirali, query);
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
                result = await dbService.getAllDocuments( Nirali,query,options);
               
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

const getNirali = async(req, res) => {
    try {
        let query={};
        query.id = req.params.id;
        let result = await dbService.getDocumentByQuery(Nirali,query);
        
        if(result){
            return  utils.successResponse(result, res);
        }
        return utils.recordNotFound([],res);
    }
    catch(error){
        return utils.failureResponse(error.message,res)
    }
}
const getNiraliCount = async(req, res) => {
    try {
        let where ={};
        if(req.body.where){
            where = req.body.where;
        }
        let result = await dbService.countDocument(Nirali,where);
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

const getNiraliByAggregate = async (req,res)=>{
    try{
        let result=await dbService.getDocumentByAggregation(Nirali,req.body);
        if(result){
            return utils.successResponse(result, res);
        }
        return utils.recordNotFound([],res);
    }catch(error){
        return utils.failureResponse(error.message,res)
    }
}
const updateNirali = async(req, res) => {
    try {
        const data = {
                ...req.body,
            id:req.params.id
        }
        let isValid = validation.validateParamsWithJoi(
            data,
            NiraliSchemaKey.schemaKeys
        );
        if (isValid.error) {
            return  utils.inValidParam(isValid.details, res);
        }
        let result = await dbService.findOneAndUpdateDocument(Nirali,{_id:req.params.id},data,{new:true});
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
const partialUpdateNirali = async (req, res) => {
    try {
        const data = {
            ...req.body,
            id: req.params.id
        }
        let isValid = validation.validateParamsWithJoi(
            data,
            NiraliSchemaKey.updateSchemaKeys
        );
        if (isValid.error) {
            return utils.inValidParam(isValid.details, res);
        }
        let result = await dbService.updateDocument(Nirali, req.params.id, data);
        if (!result) {
            return utils.failureResponse("something is wrong", res)
        }
        
        return utils.successResponse(result, res);
    }
    catch(error){
        return utils.failureResponse(error.message, res)
    }
}
const softDeleteNirali = async (req, res) => {
    try{
        let result = await dbService.updateDocument(Nirali, { _id: req.params.id }, { isDeleted: true });
        if(!result){
            return utils.failedSoftDelete(res);
        }
        return  utils.successResponse(result, res);
    }catch(error){
        return utils.failureResponse(error.message,res); 
    }
}
const bulkInsertNirali = async(req,res)=>{
    try{
        let data;   
        if(req.body.data !== undefined && req.body.data.length){
            data = req.body.data;
            let result =await dbService.bulkInsert(Nirali,data);
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
const bulkUpdateNirali=async(req,res)=>{
    try {
        let filter={};
        let data;
        if(req.body.filter !== undefined){
            filter = req.body.filter
        }
        if(req.body.data !== undefined){
            data = req.body.data;
            let result = await dbService.bulkUpdate(Nirali,filter,data);
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
    addNirali,
    findAllNirali,
    getNirali,
    getNiraliCount,
    getNiraliByAggregate,
    updateNirali,
    partialUpdateNirali,
    softDeleteNirali,
    bulkInsertNirali,
    bulkUpdateNirali,
}
