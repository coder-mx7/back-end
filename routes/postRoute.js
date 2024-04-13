const router = require("express").Router();
const {
  createnewpost,
  getposts,
  singelpost,
  getcountposts,
  deletedpost,
  updatepostctrl,
  updatepostimagectrl,
  togglelikedpost,
  getpostsbycategory,
} = require("../controllers/postscontrollers");
const {
  verifytoken,
  verifytokenauthrztionandadmin,
  verifytokenandadmin,
} = require("../middleware/verifytoken");
const uplodephoto = require("../middleware/uploldphoto");
const valadtoinobjectid = require("../middleware/validteobjectid");

router
  .route("/")
  .post(verifytokenandadmin, uplodephoto.single("image"), createnewpost)
  .get(getposts);

//get count post
router.route("/count").get(verifytokenandadmin,getcountposts);

//get post by id
router
  .route("/:id")
  .get(valadtoinobjectid, singelpost)
  .delete(valadtoinobjectid, verifytokenandadmin, deletedpost)
  .put(valadtoinobjectid, verifytokenandadmin, updatepostctrl);

// /api/post/update-image
router
  .route("/update-image/:id")
  .put(
    valadtoinobjectid,
    verifytokenandadmin,
    uplodephoto.single("image"),
    updatepostimagectrl
  );

// /api/posts/like/id

router.route("/like/:id").put(valadtoinobjectid, verifytoken, togglelikedpost);

// /api/posts/category

router.route("/category/:category").get(getpostsbycategory);
module.exports = router;
