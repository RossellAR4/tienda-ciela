// ProductRepository.js
const BaseRepository = require('./BaseRepository');
const Product = require('../models/Product');

class ProductRepository extends BaseRepository {
  constructor() {
    super([
      new Product(1, 'Cartera Elegante', 25, 'Accesorios', 10, 'https://picsum.photos/200/300?random=1'),
      new Product(2, 'Juego de Joyas', 30, 'Bisutería', 15, 'https://picsum.photos/200/300?random=2'),
      new Product(3, 'Crema Corporal', 20, 'Cuidado Personal', 8, 'https://picsum.photos/200/300?random=3'),
      new Product(4, 'Vestido Floral', 45, 'Ropa', 5, 'https://picsum.photos/200/300?random=4'),
      new Product(5, 'Kit de Maquillaje', 35, 'Belleza', 12, 'https://picsum.photos/200/300?random=5')
    ]);
  }

  async findByCategory(category) {
    const products = await this.findAll();
    return products.filter(p => p.category === category);
  }

  async updateStock(productId, quantity) {
    const product = await this.findById(productId);
    if (!product) throw new Error('Product not found');
    
    product.updateStock(quantity);
    return this.update(productId, { stock: product.stock });
  }
}

module.exports = new ProductRepository();
