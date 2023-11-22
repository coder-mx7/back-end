const router = require("express").Router();
const { regsterd ,login } = require('../controllers/authcontrollers')

router.post('/regsterd',regsterd)
router.post('/login',login)
module.exports = router 