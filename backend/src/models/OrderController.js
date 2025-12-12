// OrderController.js
const orderService = require('../services/OrderService');

class OrderController {
  async createOrder(req, res) {
    try {
      const { customerId, items, paymentMethod } = req.body;
      
      // Validar items
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Items are required' });
      }

      const order = await orderService.createOrder(customerId, items, paymentMethod);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getOrder(req, res) {
    try {
      const order = await orderService.getOrderById(parseInt(req.params.id));
      res.json(order);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async getCustomerOrders(req, res) {
    try {
      const orders = await orderService.getOrdersByCustomer(req.params.customerId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { status } = req.body;
      const order = await orderService.updateOrderStatus(parseInt(req.params.id), status);
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new OrderController();
