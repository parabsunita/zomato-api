const express = require("express");
const router = express.Router();
const restaurantController = require("./notification.controller");

router.post("/push_notification", restaurantController.addNotifiction);
router.get("/push_notification", restaurantController.getNotification);

module.exports = router;
