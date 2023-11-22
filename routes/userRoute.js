const router = require("express").Router();
const { getallusers, getuserbyid, updateUser, getlengthalluser, uplodephotoprofil, delituserprofile } = require('../controllers/userscontrollers');
const uplodephoto = require("../middleware/uploldphoto");
const validteobjectid = require("../middleware/validteobjectid");
const { verifytoken, verifytokenauthrztionandadmin, verifytokenandadmin } = require("../middleware/verifytoken");

router.route('/profile').get(verifytokenandadmin, getallusers)
router.route('/profile/uplode-photo-profil').post(verifytoken, uplodephoto.single("image"), uplodephotoprofil)
router.route('/count').get(verifytokenandadmin, getlengthalluser)
router.route('/profile/:id').get(validteobjectid, getuserbyid)
                            .put(validteobjectid, verifytokenauthrztionandadmin, updateUser)
                            .delete(validteobjectid,verifytokenauthrztionandadmin,delituserprofile)
module.exports = router 