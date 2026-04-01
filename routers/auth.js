const router = require("express").Router();
const Controller = require("../controllers/controller");
const { isLoggedIn, isGuest } = require("../middlewares/auth");

router.get("/register", isGuest, Controller.showRegister);
router.post("/register", isGuest, Controller.register);
router.get("/login", isGuest, Controller.showLogin);
router.post("/login", isGuest, Controller.login);
router.get("/logout", isLoggedIn, Controller.logout);

module.exports = router;
