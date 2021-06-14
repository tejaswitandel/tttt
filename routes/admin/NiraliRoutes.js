const express = require('express');
const router = express.Router();
const NiraliController = require("../../controller/admin/NiraliController")
const auth = require("../../middleware/auth");

router.route("/create").post(auth(...[ 'createByAdminInAdminPlatform' ]),NiraliController.addNirali);
router.route("/list").post(auth(...[ 'getAllByAdminInAdminPlatform' ]),NiraliController.findAllNirali);
router.route("/:id").get(auth(...[ 'getByAdminInAdminPlatform' ]),NiraliController.getNirali);
router.route("/count").post(auth(...[ 'getCountByAdminInAdminPlatform' ]),NiraliController.getNiraliCount);
router.route("/aggregate").post(auth(...[ 'aggregateByAdminInAdminPlatform' ]),NiraliController.getNiraliByAggregate);
router.route("/update/:id").put(auth(...[ 'updateByAdminInAdminPlatform' ]),NiraliController.updateNirali);    
router.route("/partial-update/:id").put(auth(...[ 'partialUpdateByAdminInAdminPlatform' ]),NiraliController.partialUpdateNirali);
router.route("/softDelete/:id").put(auth(...[ 'softDeleteByAdminInAdminPlatform' ]),NiraliController.softDeleteNirali);
router.route("/addBulk").post(auth(...[ 'addBulkByAdminInAdminPlatform' ]),NiraliController.bulkInsertNirali);
router.route("/updateBulk").put(auth(...[ 'updateBulkByAdminInAdminPlatform' ]),NiraliController.bulkUpdateNirali);
module.exports = router;
