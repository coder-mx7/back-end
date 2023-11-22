const router = require("express").Router();
const { createnewpost, getposts } = require("../controllers/postscontrollers");
const { verifytoken, verifytokenauthrztionandadmin, verifytokenandadmin } = require("../middleware/verifytoken");
const uplodephoto = require("../middleware/uploldphoto");



router.route("/")
       .post(verifytoken,uplodephoto.single("image"),createnewpost)
       .get(getposts)

module.exports = router