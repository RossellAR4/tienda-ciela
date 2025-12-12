// Product.js
class Product {
  constructor(id, name, price, category, stock, imageUrl = '') {
    this.id = id;
    this.name = name;
    this.price = price;
    this.category = category;
    this.stock = stock;
    this.imageUrl = imageUrl;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  updateStock(quantity) {
    if (this.stock + quantity < 0) {
      throw new Error('Stock cannot be negative');
    }
    this.stock += quantity;
    this.updatedAt = new Date();
  }

  validate() {
    const errors = [];
    if (!this.name || this.name.length < 3) errors.push('Name must be at least 3 characters');
    if (this.price <= 0) errors.push('Price must be positive');
    if (this.stock < 0) errors.push('Stock cannot be negative');
    return errors;
  }
}

module.exports = Product;
