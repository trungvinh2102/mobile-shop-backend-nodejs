const express = require("express");
const router = express.Router();
const AuthController = require('../../apps/controllers/apis/auth.controller')
const CustomerController = require('../../apps/controllers/apis/customer.controller')
const OrderController = require('../../apps/controllers/apis/order.controller')
const AuthenticationMiddleware = require('../../apps/middlewares/auth.middleware')


router.post('/login', AuthController.loginCustomer)
router.post('/register', AuthController.registerCustomer)
router.post('/update', CustomerController.updateCustomer)
router.get("/:id/order", AuthenticationMiddleware.verifyAuthenticationCustomer, OrderController.orderByCustomer);
router.get("/order/:id", AuthenticationMiddleware.verifyAuthenticationCustomer, OrderController.orderDetails);
router.post("/order/:id", AuthenticationMiddleware.verifyAuthenticationCustomer, OrderController.cancelOrder);



module.exports = router