// OrderRepository.js
const BaseRepository = require('./BaseRepository');
const Order = require('../models/Order');

class OrderRepository extends BaseRepository {
  constructor() {
    super([]);
  }

  async findByCustomer(customerId) {
    const orders = await this.findAll();
    return orders.filter(order => order.customerId === customerId);
  }

  async findByStatus(status) {
    const orders = await this.findAll();
    return orders.filter(order => order.status === status);
  }
}

module.exports = new OrderRepository();
