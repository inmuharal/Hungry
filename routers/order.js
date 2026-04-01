const router = require("express").Router();
const Controller = require("../controllers/controller");
const { isLoggedIn, authorizeRole } = require("../middlewares/auth");

router.get("/", isLoggedIn, Controller.orders);
router.get("/add", isLoggedIn, authorizeRole("pembeli"), Controller.showAddOrder);
router.post("/add", isLoggedIn, authorizeRole("pembeli"), Controller.addOrder);
router.get("/:id/invoice", isLoggedIn, Controller.generateInvoice);
router.get("/:id/delete", isLoggedIn, authorizeRole("penjual"), Controller.deleteOrder);

module.exports = router;
