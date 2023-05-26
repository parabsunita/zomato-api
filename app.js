const express = require("express");
const app = express();
const indexRouter = require("./modules/route");
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use("/api", indexRouter);

module.exports = app;
