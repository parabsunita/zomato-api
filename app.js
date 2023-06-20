const express = require("express");
const app = express();
const authRouter = require("./auth/route");
const resturantRouter = require("./restuaurant/route");
// const adminRouter = require("./admin/route");
const clientRouter = require("./restuaurant/route");
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRouter);
app.use("/api/resturant", resturantRouter);
// app.use("/api/admin", adminRouter);
app.use("/api/client", clientRouter);

module.exports = app;
