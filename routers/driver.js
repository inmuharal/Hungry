const router = require("express").Router();
const Controller = require("../controllers/controller");
const { isLoggedIn } = require("../middlewares/auth");

router.get("/", isLoggedIn, Controller.drivers);

module.exports = router;
