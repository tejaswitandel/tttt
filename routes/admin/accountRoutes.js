const express = require('express');
const router = express.Router();
const accountController = require("../../controller/admin/accountController")
const auth = require("../../middleware/auth");

router.route("/create").post(auth(...[ 'createByAdminInAdminPlatform' ]),accountController.addAccount);
router.route("/list").post(auth(...[ 'getAllByAdminInAdminPlatform' ]),accountController.findAllAccount);
router.route("/:id").get(auth(...[ 'getByAdminInAdminPlatform' ]),accountController.getAccount);
router.route("/count").post(auth(...[ 'getCountByAdminInAdminPlatform' ]),accountController.getAccountCount);
router.route("/aggregate").post(auth(...[ 'aggregateByAdminInAdminPlatform' ]),accountController.getAccountByAggregate);
router.route("/update/:id").put(auth(...[ 'updateByAdminInAdminPlatform' ]),accountController.updateAccount);    
router.route("/partial-update/:id").put(auth(...[ 'partialUpdateByAdminInAdminPlatform' ]),accountController.partialUpdateAccount);
router.route("/softDelete/:id").put(auth(...[ 'softDeleteByAdminInAdminPlatform' ]),accountController.softDeleteAccount);
router.route("/addBulk").post(auth(...[ 'addBulkByAdminInAdminPlatform' ]),accountController.bulkInsertAccount);
router.route("/updateBulk").put(auth(...[ 'updateBulkByAdminInAdminPlatform' ]),accountController.bulkUpdateAccount);
module.exports = router;
