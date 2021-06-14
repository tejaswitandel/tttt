const express = require('express');
const router = express.Router();
const userController = require("../../controller/admin/userController")
const auth = require("../../middleware/auth");

router.route("/create").post(userController.addUser);
router.route("/list").post(auth(...[ 'getAllByAdminInAdminPlatform' ]),userController.findAllUser);
router.route("/:id").get(auth(...[ 'getByAdminInAdminPlatform' ]),userController.getUser);
router.route("/count").post(auth(...[ 'getCountByAdminInAdminPlatform' ]),userController.getUserCount);
router.route("/aggregate").post(auth(...[ 'aggregateByAdminInAdminPlatform' ]),userController.getUserByAggregate);
router.route("/update/:id").put(auth(...[ 'updateByAdminInAdminPlatform' ]),userController.updateUser);    
router.route("/partial-update/:id").put(auth(...[ 'partialUpdateByAdminInAdminPlatform' ]),userController.partialUpdateUser);
router.route("/softDelete/:id").put(auth(...[ 'softDeleteByAdminInAdminPlatform' ]),userController.softDeleteUser);
router.route("/addBulk").post(userController.bulkInsertUser);
router.route("/updateBulk").put(auth(...[ 'updateBulkByAdminInAdminPlatform' ]),userController.bulkUpdateUser);
router.route("/change-password").put(auth(...[ 'changePasswordByAdminInAdminPlatform' ]),userController.changePassword);
module.exports = router;
