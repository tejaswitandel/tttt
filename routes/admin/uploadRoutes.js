var express = require('express');
var router = express.Router();

const fileUploadController = require("../../controller/admin/fileUploadController");
const auth = require("../../middleware/auth");
router.post("/",auth(...[
  'fileUploadByUserInAdminPlatform',
  'fileUploadByAdminInAdminPlatform'
]),fileUploadController.upload);

module.exports = router;