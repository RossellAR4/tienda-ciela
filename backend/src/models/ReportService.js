// ReportService.js
const orderRepository = require('../repositories/OrderRepository');
const productRepository = require('../repositories/ProductRepository');

class ReportService {
  async generateSalesReport(startDate, endDate) {
    const orders = await orderRepository.findAll();
    
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
    });

    const totalSales = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = filteredOrders.length;
    
    // Productos más vendidos
    const productSales = {};
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = { quantity: 0, revenue: 0 };
        }
        productSales[item.productId].quantity += item.quantity;
        productSales[item.productId].revenue += item.quantity * item.price;
      });
    });

    // Clientes frecuentes
    const customerOrders = {};
    filteredOrders.forEach(order => {
      if (!customerOrders[order.customerId]) {
        customerOrders[order.customerId] = { orders: 0, totalSpent: 0 };
      }
      customerOrders[order.customerId].orders++;
      customerOrders[order.customerId].totalSpent += order.total;
    });

    return {
      period: { startDate, endDate },
      summary: {
        totalSales,
        totalOrders,
        averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0
      },
      topProducts: Object.entries(productSales)
        .sort((a, b) => b[1].quantity - a[1].quantity)
        .slice(0, 5),
      topCustomers: Object.entries(customerOrders)
        .sort((a, b) => b[1].totalSpent - a[1].totalSpent)
        .slice(0, 5),
      ordersByStatus: this.groupOrdersByStatus(filteredOrders)
    };
  }

  groupOrdersByStatus(orders) {
    const statusCount = {};
    orders.forEach(order => {
      statusCount[order.status] = (statusCount[order.status] || 0) + 1;
    });
    return statusCount;
  }

  async generateInventoryReport() {
    const products = await productRepository.findAll();
    
    const lowStock = products.filter(p => p.stock < 5);
    const outOfStock = products.filter(p => p.stock === 0);
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

    return {
      totalProducts: products.length,
      totalInventoryValue,
      lowStockProducts: lowStock.map(p => ({ id: p.id, name: p.name, stock: p.stock })),
      outOfStockProducts: outOfStock.map(p => ({ id: p.id, name: p.name })),
      productsByCategory: this.groupProductsByCategory(products)
    };
  }

  groupProductsByCategory(products) {
    const categories = {};
    products.forEach(product => {
      if (!categories[product.category]) {
        categories[product.category] = { count: 0, totalValue: 0 };
      }
      categories[product.category].count++;
      categories[product.category].totalValue += product.price * product.stock;
    });
    return categories;
  }
}

module.exports = new ReportService();
