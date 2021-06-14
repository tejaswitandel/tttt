const express = require("express");
const router = express.Router()
const testController = require("../../controller/admin/testController");    

router.post("/", (req, res) => {
    testController.test(req,res);
})
router.post("http://localhost:3000/users", (req, res) => {
    testController.test(req,res);
})
router.post("TEST", (req, res) => {
    testController.test(req,res);
})
    
module.exports = router;