// Order.js
class Order {
  constructor(id, customerId, items = [], total = 0, paymentMethod = 'cash', status = 'pending') {
    this.id = id;
    this.customerId = customerId;
    this.items = items; // Array de {productId, quantity, price}
    this.total = total;
    this.paymentMethod = paymentMethod;
    this.status = status; // pending, paid, delivered, cancelled
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  addItem(productId, quantity, price) {
    this.items.push({ productId, quantity, price });
    this.total += quantity * price;
    this.updatedAt = new Date();
  }

  calculateTotal() {
    return this.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  }
}

module.exports = Order;
