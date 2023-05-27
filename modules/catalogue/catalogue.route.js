const express = require("express");
const router = express.Router();
const catalogueController = require("./catalogue.controller");

router.post("/addcatalogue", catalogueController.addcatalogue);
router.get("/getcatalogue", catalogueController.getcatalogue);

module.exports = router;
