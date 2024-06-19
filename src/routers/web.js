const express = require("express");
const router = express.Router();

router.use('/customer', require('./auth'))
router.use('/categories', require('./category'))
router.use('/products', require('./product'))
router.use('/order', require('./order'))
router.use('/ads', require('./ads'))


module.exports = router;