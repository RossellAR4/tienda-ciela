const products = [ 
  { id: 1, name: 'Cartera Elegante', price: 25, category: 'Accesorios', stock: 10 }, 
  { id: 2, name: 'Juego de Joyas', price: 30, category: 'Bisuter¡a', stock: 15 }, 
  { id: 3, name: 'Crema Corporal', price: 20, category: 'Cuidado Personal', stock: 8 }, 
  { id: 4, name: 'Vestido Floral', price: 45, category: 'Ropa', stock: 5 }, 
  { id: 5, name: 'Kit de Maquillaje', price: 35, category: 'Belleza', stock: 12 } 
]; 
 
const findAll = async () => { 
  return products; 
}; 
 
module.exports = { findAll }; 
