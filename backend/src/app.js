const express = require('express'); 
const cors = require('cors'); 
require('dotenv').config(); 
 
const productRoutes = require('./routes/productRoutes'); 
 
const app = express(); 
const PORT = process.env.PORT || 5000; 
 
app.use(cors()); 
app.use(express.json()); 
 
app.use('/api/products', productRoutes); 
 
app.get('/', (req, res) => { 
  res.json({ message: 'API de La Tienda de la Ciela' }); 
}); 
 
app.listen(PORT, () => { 
  console.log(`Servidor corriendo en http://localhost:${PORT}`); 
}); 
