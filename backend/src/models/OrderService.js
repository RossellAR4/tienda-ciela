// OrderService.js - PATRÓN STRATEGY para métodos de pago
const orderRepository = require('../repositories/OrderRepository');
const productRepository = require('../repositories/ProductRepository');
const { v4: uuidv4 } = require('uuid');

// Strategy Pattern para métodos de pago
class PaymentStrategy {
  processPayment(amount) {
    throw new Error('Method not implemented');
  }
}

class CashPayment extends PaymentStrategy {
  processPayment(amount) {
    return { 
      method: 'cash', 
      amount, 
      status: 'paid', 
      transactionId: `CASH-${Date.now()}` 
    };
  }
}

class CreditCardPayment extends PaymentStrategy {
  processPayment(amount) {
    // Simulación de pago con tarjeta
    return { 
      method: 'credit_card', 
      amount, 
      status: 'paid', 
      transactionId: `CC-${uuidv4().slice(0, 8)}` 
    };
  }
}

class TransferPayment extends PaymentStrategy {
  processPayment(amount) {
    return { 
      method: 'transfer', 
      amount, 
      status: 'pending', 
      transactionId: `TRF-${Date.now()}` 
    };
  }
}

// Factory Method para crear estrategias de pago
class PaymentStrategyFactory {
  static createStrategy(method) {
    switch (method.toLowerCase()) {
      case 'cash':
        return new CashPayment();
      case 'credit_card':
        return new CreditCardPayment();
      case 'transfer':
        return new TransferPayment();
      default:
        throw new Error(`Unsupported payment method: ${method}`);
    }
  }
}

class OrderService {
  constructor() {
    this.paymentStrategies = {
      cash: new CashPayment(),
      credit_card: new CreditCardPayment(),
      transfer: new TransferPayment()
    };
  }

  async createOrder(customerId, items, paymentMethod) {
    // Validar stock
    for (const item of items) {
      const product = await productRepository.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.productId}`);
      }
    }

    // Crear orden
    const order = {
      customerId,
      items,
      paymentMethod,
      status: 'pending',
      total: items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
    };

    // Procesar pago usando Strategy Pattern
    const paymentStrategy = PaymentStrategyFactory.createStrategy(paymentMethod);
    const paymentResult = paymentStrategy.processPayment(order.total);

    // Actualizar stock
    for (const item of items) {
      await productRepository.updateStock(item.productId, -item.quantity);
    }

    // Guardar orden
    const savedOrder = await orderRepository.create({
      ...order,
      status: paymentResult.status,
      paymentDetails: paymentResult
    });

    return savedOrder;
  }

  async getOrderById(id) {
    const order = await orderRepository.findById(id);
    if (!order) throw new Error('Order not found');
    return order;
  }

  async getOrdersByCustomer(customerId) {
    return orderRepository.findByCustomer(customerId);
  }

  async updateOrderStatus(id, status) {
    const order = await orderRepository.findById(id);
    if (!order) throw new Error('Order not found');
    
    return orderRepository.update(id, { status });
  }
}

module.exports = new OrderService();
