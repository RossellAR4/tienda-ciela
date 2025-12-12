// ProductService.js
const productRepository = require('../repositories/ProductRepository');
const { validationResult } = require('express-validator');

class ProductService {
  async getAllProducts(filters = {}) {
    let products = await productRepository.findAll();
    
    // Aplicar filtros
    if (filters.category) {
      products = products.filter(p => p.category === filters.category);
    }
    
    if (filters.minPrice) {
      products = products.filter(p => p.price >= filters.minPrice);
    }
    
    if (filters.maxPrice) {
      products = products.filter(p => p.price <= filters.maxPrice);
    }
    
    return products;
  }

  async getProductById(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async createProduct(productData) {
    const errors = this.validateProduct(productData);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
    
    return productRepository.create(productData);
  }

  async updateProduct(id, updateData) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    
    const errors = this.validateProduct({ ...product, ...updateData });
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
    
    return productRepository.update(id, updateData);
  }

  async deleteProduct(id) {
    const deleted = await productRepository.delete(id);
    if (!deleted) {
      throw new Error('Product not found');
    }
    return true;
  }

  async updateStock(productId, quantity) {
    return productRepository.updateStock(productId, quantity);
  }

  validateProduct(product) {
    const errors = [];
    if (!product.name || product.name.trim().length < 3) {
      errors.push('Name must be at least 3 characters');
    }
    if (!product.price || product.price <= 0) {
      errors.push('Price must be positive');
    }
    if (product.stock < 0) {
      errors.push('Stock cannot be negative');
    }
    return errors;
  }
}

module.exports = new ProductService();
