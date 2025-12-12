// orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController');

router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrder);
router.get('/customer/:customerId', orderController.getCustomerOrders);
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;
