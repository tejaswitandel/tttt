/*
 * modelValidation.js
 * purpose     : request validation
 * description : validate each post and put request as per mongoose model
 **/

const joi = require("joi")
exports.schemaKeys = {
	id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
	data: joi.string(),
	name: joi.number().integer(),
	isActive: joi.boolean(),
	isDeleted: joi.boolean()
};
exports.updateSchemaKeys = {
	id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
	data: joi.string(),
	name: joi.number().integer(),
	isActive: joi.boolean(),
	isDeleted: joi.boolean()
};