var express = require("express");
var router = express.Router();
const authRouter = require("./modules/auth/auth.route");

router.use("/auth", authRouter);

module.exports = router;
