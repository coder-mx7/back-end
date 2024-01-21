const router = require("express").Router();
const { verifytoken, verifytokenauthrztionandadmin, verifytokenandadmin } = require("../middleware/verifytoken");
const valadtoinobjectid = require('../middleware/validteobjectid');
const { createnewcommunte, getallcommunt, deleteCommunte, updateCommunte } = require("../controllers/commentControllers");

router.route("/")
       .post(verifytoken, createnewcommunte)
       .get(verifytokenandadmin, getallcommunt)

// /:id      
router.route("/:id")
       .delete(valadtoinobjectid,verifytoken,deleteCommunte)
       .put(valadtoinobjectid,verifytoken,updateCommunte)

module.exports = router