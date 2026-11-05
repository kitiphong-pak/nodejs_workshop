var express = require("express");
var router = express.Router();
var auth = require("../../middleware/token.middleware");

router.use("/login", require("./login"));
router.use("/register", require("./register"));

router.use("/user", auth, require("./users"));
router.use("/order",auth, require("./order"));
router.use("/product",auth, require("./product"));

router.get("/", auth, (req, res) => res.redirect("/product"));

module.exports = router;