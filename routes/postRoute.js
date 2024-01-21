const router = require("express").Router();
const { createnewpost, getposts, singelpost, getcountposts, deletedpost,updatepostctrl, updatepostimagectrl, togglelikedpost } = require("../controllers/postscontrollers");
const { verifytoken, verifytokenauthrztionandadmin, verifytokenandadmin } = require("../middleware/verifytoken");
const uplodephoto = require("../middleware/uploldphoto");
const valadtoinobjectid = require('../middleware/validteobjectid');

router.route("/")
       .post(verifytoken, uplodephoto.single("image"), createnewpost)
       .get(verifytoken, getposts)

//get count post
router.route("/count").get(getcountposts )

//get post by id
router.route("/:id").get(valadtoinobjectid, singelpost)
                    .delete(valadtoinobjectid,verifytoken,deletedpost)
                    .put(valadtoinobjectid,verifytoken,updatepostctrl)

// /api/post/update-image 
router.route("/update-image/:id")
      .put(valadtoinobjectid,verifytoken,uplodephoto.single("image"),updatepostimagectrl)


// /api/posts/like/:id

router.route("/like/:id")
      .put(valadtoinobjectid,verifytoken,togglelikedpost)
      

module.exports = router