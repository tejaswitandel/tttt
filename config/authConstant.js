/*
 * constants
 */

const JWT={
    ADMIN_SECRET:"myjwtadminsecret",
    EXPIRES_IN: 10000
}

const USER_ROLE ={
    User:1,
    Admin:2,
}

const PLATFORM = {
    ADMIN:1,
}

let LOGIN_ACCESS ={
    [USER_ROLE.User]:[PLATFORM.ADMIN],        
    [USER_ROLE.Admin]:[PLATFORM.ADMIN],        
}

const DEFAULT_ROLE= 1

const ROLE_RIGHTS={
    
    [USER_ROLE.User] : [
  "getAllByUserInAdminPlatform",
  "getByUserInAdminPlatform",
  "aggregateByUserInAdminPlatform",
  "getCountByUserInAdminPlatform",
  "createByUserInAdminPlatform",
  "addBulkByUserInAdminPlatform",
  "updateByUserInAdminPlatform",
  "updateBulkByUserInAdminPlatform",
  "partialUpdateByUserInAdminPlatform",
  "deleteByUserInAdminPlatform",
  "softDeleteByUserInAdminPlatform",
  "upsertByUserInAdminPlatform",
  "fileUploadByUserInAdminPlatform",
  "changePasswordByUserInAdminPlatform"
],
    
    [USER_ROLE.Admin] : [
  "getAllByAdminInAdminPlatform",
  "getByAdminInAdminPlatform",
  "aggregateByAdminInAdminPlatform",
  "getCountByAdminInAdminPlatform",
  "createByAdminInAdminPlatform",
  "addBulkByAdminInAdminPlatform",
  "updateByAdminInAdminPlatform",
  "updateBulkByAdminInAdminPlatform",
  "partialUpdateByAdminInAdminPlatform",
  "deleteByAdminInAdminPlatform",
  "softDeleteByAdminInAdminPlatform",
  "upsertByAdminInAdminPlatform",
  "fileUploadByAdminInAdminPlatform",
  "changePasswordByAdminInAdminPlatform"
],
    
}
const MAX_LOGIN_RETRY_LIMIT = 3;   

const SEND_LOGIN_OTP = {
        SMS:1,
    EMAIL:2,
}
const DEFAULT_SEND_LOGIN_OTP=SEND_LOGIN_OTP.SMS

const FORGOT_PASSWORD_WITH = {
  LINK: {
    sms: true,
    email: false
  },
  EXPIRETIME: 23
}

module.exports = {
    JWT,
    USER_ROLE,
    DEFAULT_ROLE,
    ROLE_RIGHTS,
    PLATFORM,
    MAX_LOGIN_RETRY_LIMIT,
    SEND_LOGIN_OTP,
    DEFAULT_SEND_LOGIN_OTP,
    FORGOT_PASSWORD_WITH,
    LOGIN_ACCESS
}