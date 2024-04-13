const router = require("express").Router();
const {
  createNewcategory,
  getallcategorys,
  deletebyidcategorys,
  updatebyidcategorys,
  getcategorysbycategory,
} = require("../controllers/Categorycontrollers");
const valadtoinobjectid = require("../middleware/validteobjectid");
const {
  verifytoken,
  verifytokenandadmin,
} = require("../middleware/verifytoken");

router
  .route("/")
  .post(verifytokenandadmin, createNewcategory)
  .get(verifytoken, getallcategorys);

router
  .route("/:id")
  .delete(valadtoinobjectid, verifytokenandadmin, deletebyidcategorys)
  .put(valadtoinobjectid, verifytokenandadmin, updatebyidcategorys);


module.exports = router;
