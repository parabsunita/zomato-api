const express = require("express");
const app = express();
const authRouter = require("./auth/route");
const restaurantRouter = require("./restuaurant/route");
const adminRouter = require("./admin/route");
const clientRouter = require("./client/route");
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRouter);
app.use("/api/restaurant", restaurantRouter);
app.use("/api/admin", adminRouter);
app.use("/api/client", clientRouter);

module.exports = app;
