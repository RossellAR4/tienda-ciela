// ProductController.js
const productService = require('../services/ProductService');
const { validationResult } = require('express-validator');

class ProductController {
  async getProducts(req, res) {
    try {
      const filters = {
        category: req.query.category,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined
      };
      
      const products = await productService.getAllProducts(filters);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProductById(req, res) {
    try {
      const product = await productService.getProductById(parseInt(req.params.id));
      res.json(product);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async createProduct(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateProduct(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const product = await productService.updateProduct(parseInt(req.params.id), req.body);
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      await productService.deleteProduct(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateStock(req, res) {
    try {
      const { quantity } = req.body;
      const product = await productService.updateStock(parseInt(req.params.id), parseInt(quantity));
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ProductController();
