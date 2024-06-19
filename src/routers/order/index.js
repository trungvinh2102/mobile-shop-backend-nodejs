const express = require("express");
const router = express.Router();
const OrderController = require("../../apps/controllers/apis/order.controller");


router.post("", OrderController.order);

module.exports = router;