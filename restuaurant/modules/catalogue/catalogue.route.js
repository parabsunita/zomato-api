const express = require("express");
const router = express.Router();
const catalogueController = require("./catalogue.controller");

router.post("/addcatalogue", catalogueController.addCatalogue);
router.get("/getcatalogue", catalogueController.getCatalogue);
router.post("/addcategory", catalogueController.addCategory);
router.get("/getcategory", catalogueController.getCategory);
router.post("/additem", catalogueController.addItem);
router.get("/details", catalogueController.details);
router.get("/edititem", catalogueController.editItem);
module.exports = router;
