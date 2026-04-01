const router = require("express").Router();
const Controller = require("../controllers/controller");
const { isLoggedIn, authorizeRole } = require("../middlewares/auth");

router.get("/", isLoggedIn, Controller.menus);
router.get("/add", isLoggedIn, authorizeRole("penjual"), Controller.showAddMenu);
router.post("/add", isLoggedIn, authorizeRole("penjual"), Controller.addMenu);
router.get("/:id/edit", isLoggedIn, authorizeRole("penjual"), Controller.showEditMenu);
router.post("/:id/edit", isLoggedIn, authorizeRole("penjual"), Controller.editMenu);
router.get("/:id/delete", isLoggedIn, authorizeRole("penjual"), Controller.deleteMenu);

module.exports = router;
