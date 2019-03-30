var express = require("express");
var account = require("./account");
var view = require("./view");
var router = express.Router();
/* GET home page. */
router.use("/account", account);
router.use("/view", view);

module.exports = router;
