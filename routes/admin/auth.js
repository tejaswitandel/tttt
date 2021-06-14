const express =  require("express");
const routes  =  express.Router();
const authController =  require("../../controller/admin/authController")
routes.route("/register").post(authController.register);
routes.post("/send_login_otp",authController.sendOtpForLogin);
routes.post("/login_with_otp",authController.loginWithOTP);
routes.route("/forgot-password").post(authController.forgotPassword);
routes.route("/validate-otp").post(authController.validateResetPasswordOtp);
routes.route("/reset-password").put(authController.resetPassword);

module.exports = routes;