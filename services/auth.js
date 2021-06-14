const User = require("../model/user")
const dbService = require("../utils/dbService");
const { JWT,LOGIN_ACCESS,
    PLATFORM,MAX_LOGIN_RETRY_LIMIT,DEFAULT_SEND_LOGIN_OTP,SEND_LOGIN_OTP,FORGOT_PASSWORD_WITH,NO_OF_DEVICE_ALLOWED} = require("../config/authConstant");
const jwt = require("jsonwebtoken");
const common = require("../utils/common");
const moment = require("moment");
const bcrypt = require("bcrypt");
const emailService = require("./email/emailService");
const sendSMS = require("./sms/smsService");
const uuid = require("uuid").v4;

async function generateToken(user,secret){
    return jwt.sign( {id:user.id,username:user.username}, secret, {
        expiresIn: JWT.EXPIRES_IN * 60
    });
}
async function sendEmailForResetPasswordLink(user) {
    try {
        let token = uuid();
        let expires = moment();
        expires = expires.add(FORGOT_PASSWORD_WITH.EXPIRETIME, "minutes").toISOString();
        await dbService.updateDocument(User,user.id,
            { resetPasswordLink: { code: token, expireTime: expires } });
        let viewType = "/reset-password/";
        let msg = "Click on the link below to reset your password.";
        let mailObj = {
            subject: "Reset Password",
            to: user.email,
            template: "/views/resetPassword",
            data: {
                link: "http://localhost:3000" + viewType + token,
                linkText: "Reset Password",
                message:msg
            }
        };
        await emailService.sendEmail(mailObj);
        return true;
    } catch (e) {
        return false;
    }
}
async function sendSMSForResetPasswordLink(user) {
    try {
        let token = uuid();
        let expires = moment();
        expires = expires.add(FORGOT_PASSWORD_WITH.EXPIRETIME, "minutes").toISOString();
        await dbService.updateDocument(User,user.id,
            { resetPasswordLink: { code: token, expireTime: expires } });
        let viewType = "/reset-password/";
        let msg = `Click on the link to reset your password.
        http://localhost:3000${viewType + token}`;
        let smsObj = {
            to:user.mobileNo,
            message:msg
        }
        await sendSMS(smsObj);
        return true;
    } catch (error) {
        return false;
    }
}
async function sendSMSForLoginOtp(user) {
    try {
        let otp = common.randomNumber();
        let expires = moment();
        expires = expires.add(6, "hours").toISOString();
        await dbService.updateDocument(User, user.id, { loginOTP: { code: otp, expireTime: expires } });
        let message = `OTP code for Login `;
        let otpMsg = `${message}: ${otp}`;
        let smsObj = {
            to:user.mobileNo,
            message:otpMsg
        }
        await sendSMS(smsObj);
        return true;
    } catch (error) {
        return false;
    }
}
let auth =  module.exports = {}
    auth.loginUser=async(username,password,url) => {
            try {
                let where = {$or:[{username:username},{password:username}]}
                const user = await dbService.getDocumentByQuery(User,where);
                if (user) {
                    if(user.loginTry >= MAX_LOGIN_RETRY_LIMIT){
                        return { flag:true, message:"you have exceed the number of limit.you have to reset the password"}
                    }
                    const isPasswordMatched = await user.isPasswordMatch(password);
                    if (isPasswordMatched) {
                        const {password,...userData}=user.toJSON()
                        let token;
                        if(!user.role){
                            return {flag:true, data:'You have no assigned any role'}
                        }
                        if(url.includes('admin')){
                            if(!LOGIN_ACCESS[user.role].includes(PLATFORM.ADMIN)){
                                return {flag:true, data:'you are unable to access this platform'}
                            }
                            token = await generateToken(userData,JWT.ADMIN_SECRET)
                        }
                        if(user.loginRetryLimit){
                            await dbService.updateDocument(User,user.id,{loginTry:0});
                        }
                        let tokens = user.tokens;
                        if(user.tokens.length == NO_OF_DEVICE_ALLOWED){
                            tokens.pop();
                        }
                        tokens.unshift(token);
                        await dbService.updateDocument(User,user.id,{tokens});
                        delete userData.tokens;
                        const userToReturn = { ...userData, ...{ token } };
                        return {flag:false,data:userToReturn}
                    } else {
                        await dbService.updateDocument(User,user.id,{loginTry:user.loginTry+1});
                        return {flag:true,data:'Incorrect Password'}
                    }
                } else {
                    return {flag:true,data:'User not exists'}
                }
            } catch (error) {
                throw new Error(error.message)
            }
    },
    auth.changePassword=async(params)=>{
        try {
            let password = params.newPassword;
            let where = {_id:params.userId};
            let user = await dbService.getDocumentByQuery(User,where);
            if (user && user.id) {
                password = await bcrypt.hash(password, 8);
                let updatedUser = dbService.updateDocument(User,user.id,{password});
                if (updatedUser) {
                    return {flag:false,data:user};                
                }
                return {flag:true,data:'password can not changed due to some error.please try again'}
            }
            return {flag:true,data:'User not found'}
        } catch (error) {
            throw new Error(error.message)
        }
    },
    auth.sendResetPasswordNotification=async (user) => {
        let resultOfEmail=false;
        let resultOfSMS=false;
        try {
            if(FORGOT_PASSWORD_WITH.LINK.email){
                resultOfEmail = await sendEmailForResetPasswordLink(user);
                }
            if(FORGOT_PASSWORD_WITH.LINK.sms){
                resultOfSMS = await sendSMSForResetPasswordLink(user);
            }
            return {resultOfEmail,resultOfSMS};
        } catch (error) {
            throw new Error(error.message)
        }
    },
    auth.resetPassword=async (user, newPassword) => {
        try {
            let where = { _id: user.id };
            const dbUser = await dbService.getDocumentByQuery(User,where);
            if (!dbUser) {
                return {
                    flag: false,
                    data: "User not found",
                };
            }
            newPassword = await bcrypt.hash(newPassword, 8);
            await dbService.updateDocument(User, user.id, {
                password: newPassword,
                resetPasswordLink: null,
                loginTry:0
            });
            let mailObj = {
                subject: 'Reset Password',
                to: user.email,
                template: '/views/successfullyResetPassword',
                data: {
                    isWidth: true,
                    email: user.email || '-',
                    message: "Password Successfully Reset"
                }
            };
            await emailService.sendEmail(mailObj);
            return {
                flag: false,
                data: "Password reset successfully",
            };
        } catch (error) {
            throw new Error(error.message)
        }
    },
    auth.sendLoginOTP = async (username,password) => {
        try {
            let where = {$or:[{username:username},{password:username}]}
            let user = await dbService.getDocumentByQuery(User,where);
            if(!user){
                return {flag:true, data:'User not found'}
            }
            if(user.loginTry >= MAX_LOGIN_RETRY_LIMIT){
                return {flag:true,data:'you have exceed the number of limit.you have to reset the password'}
            }
            const isPasswordMatched = await user.isPasswordMatch(password);
            if (!isPasswordMatched) {
                await dbService.updateDocument(User,user.id,{loginTry:user.loginTry+1});
                return {flag:true,data:'Incorrect Password'}
            }
            let res;
            if(DEFAULT_SEND_LOGIN_OTP===SEND_LOGIN_OTP.EMAIL){
                // send Email here
            }else if(DEFAULT_SEND_LOGIN_OTP===SEND_LOGIN_OTP.SMS){
                // send SMS here
                res = await sendSMSForLoginOtp(user);
            }
            if(!res){
                return {flag:false,data:"otp can not be sent due to some issue try again later."};    
            }
            return {flag:false,data:"Please check your email for OTP"};
        } catch (error) {
            throw new Error(error.message)
        }
    },
    auth.loginWithOTP = async (username, password, url) => {
        try {
            let result = await auth.loginUser(username, password, url);
            if (!result.flag) {
                result.loginOTP=null;
                await dbService.updateDocument(User,{_id:result.data.id},{ loginOTP: null });
                return {flag:false,data:result}
            }
            return {flag:true,data:result.data}
            
        } catch (error) {
            throw new Error(error.message)
        }
    }