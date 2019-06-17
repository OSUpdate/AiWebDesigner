var express = require("express");
var account = require("./account");
var view = require("./view");
var router = express.Router();

// /api/account 경로 라우터 연결
router.use("/account", account);

// /api/view 경로 라우터 연결
router.use("/view", view);

module.exports = router;
