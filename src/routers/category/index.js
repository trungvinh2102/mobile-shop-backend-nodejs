const express = require("express");
const router = express.Router();
const CategoryController = require("../../apps/controllers/apis/category.controller");

router.post("/", CategoryController.createCategory);
router.get("", CategoryController.getAllCategory);
router.get("/:id", CategoryController.getCategoryById);
router.get("/:id/products", CategoryController.getAllProductByCategory);


module.exports = router;