const router = require("express").Router();

const main = require("./main");
const auth = require("./auth");
const menu = require("./menu");
const order = require("./order");
const driver = require("./driver");

router.use("/", main);
router.use("/", auth);
router.use("/menus", menu);
router.use("/orders", order);
router.use("/drivers", driver);

module.exports = router;
