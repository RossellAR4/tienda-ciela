const productService = require('../services/productService'); 
 
const getProducts = async (req, res) => { 
  try { 
    const products = await productService.getAllProducts(); 
    res.json(products); 
  } catch (error) { 
    res.status(500).json({ error: 'Error interno del servidor' }); 
  } 
}; 
 
module.exports = { getProducts }; 
