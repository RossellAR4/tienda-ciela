// PATRÓN ADAPTER para diferentes fuentes de datos
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Adapter para manejar diferentes respuestas de API
class ApiAdapter {
  constructor(baseURL) {
    this.client = axios.create({ baseURL });
    this.setupInterceptors();
  }

  setupInterceptors() {
    this.client.interceptors.response.use(
      response => response.data,
      error => {
        console.error('API Error:', error.response?.data || error.message);
        throw error.response?.data || error.message;
      }
    );
  }

  async get(endpoint, params = {}) {
    return this.client.get(endpoint, { params });
  }

  async post(endpoint, data) {
    return this.client.post(endpoint, data);
  }

  async put(endpoint, data) {
    return this.client.put(endpoint, data);
  }

  async patch(endpoint, data) {
    return this.client.patch(endpoint, data);
  }

  async delete(endpoint) {
    return this.client.delete(endpoint);
  }
}

// Factory Method para crear servicios específicos
class ServiceFactory {
  static createProductService(adapter) {
    return {
      getAll: (filters) => adapter.get('/products', filters),
      getById: (id) => adapter.get(`/products/${id}`),
      create: (data) => adapter.post('/products', data),
      update: (id, data) => adapter.put(`/products/${id}`, data),
      delete: (id) => adapter.delete(`/products/${id}`),
      updateStock: (id, quantity) => adapter.patch(`/products/${id}/stock`, { quantity })
    };
  }

  static createOrderService(adapter) {
    return {
      create: (data) => adapter.post('/orders', data),
      getById: (id) => adapter.get(`/orders/${id}`),
      getByCustomer: (customerId) => adapter.get(`/orders/customer/${customerId}`),
      updateStatus: (id, status) => adapter.patch(`/orders/${id}/status`, { status })
    };
  }

  static createReportService(adapter) {
    return {
      getSalesReport: (params) => adapter.get('/reports/sales', params),
      getInventoryReport: () => adapter.get('/reports/inventory')
    };
  }
}

// Crear adapter y servicios
const apiAdapter = new ApiAdapter(API_URL);

export const productService = ServiceFactory.createProductService(apiAdapter);
export const orderService = ServiceFactory.createOrderService(apiAdapter);
export const reportService = ServiceFactory.createReportService(apiAdapter);

// Servicio de ejemplo para demostrar Strategy Pattern
export const paymentService = {
  processPayment: (amount, method) => {
    // Strategy Pattern implementado
    const strategies = {
      cash: () => ({ method: 'cash', amount, status: 'paid', transactionId: `CASH-${Date.now()}` }),
      credit_card: () => ({ method: 'credit_card', amount, status: 'paid', transactionId: `CC-${Math.random().toString(36).substr(2, 9)}` }),
      transfer: () => ({ method: 'transfer', amount, status: 'pending', transactionId: `TRF-${Date.now()}` })
    };

    const strategy = strategies[method];
    if (!strategy) throw new Error(`Método de pago no soportado: ${method}`);
    return strategy();
  }
};
