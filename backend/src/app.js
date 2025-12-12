const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// RUTAS SIMPLIFICADAS - Sin dependencias externas
const products = [
  { id: 1, name: 'Cartera Elegante', price: 25, category: 'Accesorios', stock: 10 },
  { id: 2, name: 'Juego de Joyas', price: 30, category: 'Bisutería', stock: 15 },
  { id: 3, name: 'Crema Corporal', price: 20, category: 'Cuidado Personal', stock: 8 }
];

// GET /api/products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(product);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: 'API de La Tienda de la Ciela - Versión Simplificada',
    version: '1.0.0',
    endpoints: [
      'GET /api/products',
      'GET /api/products/:id',
      'GET /api/health'
    ]
  });
});

app.listen(PORT, () => {
  console.log(` Servidor backend corriendo en: http://localhost:${PORT}`);
});