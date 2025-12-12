const express = require("express");
const router = express.Router();

// Datos de ejemplo en memoria
let products = [
  { id: 1, name: "Cartera Elegante", price: 25, category: "Accesorios", stock: 10 },
  { id: 2, name: "Juego de Joyas", price: 30, category: "Bisutería", stock: 15 },
  { id: 3, name: "Crema Corporal", price: 20, category: "Cuidado Personal", stock: 8 }
];

// GET /api/products - Listar todos
router.get("/", (req, res) => {
  res.json(products);
});

// GET /api/products/:id - Obtener uno
router.get("/:id", (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(product);
});

// POST /api/products - Crear nuevo
router.post("/", (req, res) => {
  const newProduct = {
    id: products.length + 1,
    ...req.body,
    createdAt: new Date()
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT /api/products/:id - Actualizar
router.put("/:id", (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Producto no encontrado" });
  
  products[index] = { ...products[index], ...req.body, updatedAt: new Date() };
  res.json(products[index]);
});

// DELETE /api/products/:id - Eliminar
router.delete("/:id", (req, res) => {
  const initialLength = products.length;
  products = products.filter(p => p.id !== parseInt(req.params.id));
  
  if (products.length === initialLength) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  
  res.status(204).send();
});

module.exports = router;