const productRepository = require('../repositories/productRepository'); 
 
const getAllProducts = async () => { 
  return await productRepository.findAll(); 
}; 
 
module.exports = { getAllProducts }; 
