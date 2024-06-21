const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/orders', orderController.createOrder);
router.get('/orders', orderController.getAllOrders);
router.post('/send', orderController.sendCSVToInventory);

module.exports = router;
