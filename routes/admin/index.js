const express =  require("express")
const router =  express.Router()
router.use("/auth",require("./auth"));
router.use("/nirali",require("./NiraliRoutes"));
router.use("/account",require("./accountRoutes"));
router.use("/user",require("./userRoutes"));
router.use("/upload",require("./uploadRoutes"));
router.use("/",require("./testRoutes"));
router.use("/",require("./testRoutes"));
router.use("/",require("./testRoutes"));

module.exports = router;
