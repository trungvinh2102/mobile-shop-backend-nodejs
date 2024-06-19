const express = require("express");
const router = express.Router();
const ProductController = require("../../apps/controllers/apis/product.controller");


router.get("", ProductController.index);
router.get("/:id", ProductController.show);
router.get("/:id/comments", ProductController.comments);
router.post("/:id/comments", ProductController.storeComments);


module.exports = router;