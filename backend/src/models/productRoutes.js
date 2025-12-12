// productRoutes.js
const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const productController = require('../controllers/ProductController');

// Validaciones
const productValidation = [
  body('name').notEmpty().withMessage('Name is required').isLength({ min: 3 }),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be positive'),
  body('stock').isInt({ min: 0 }).withMessage('Stock cannot be negative'),
  body('category').notEmpty().withMessage('Category is required')
];

// Rutas
router.get('/', 
  query('minPrice').optional().isFloat({ gt: 0 }),
  query('maxPrice').optional().isFloat({ gt: 0 }),
  productController.getProducts
);

router.get('/:id', 
  param('id').isInt({ gt: 0 }),
  productController.getProductById
);

router.post('/', productValidation, productController.createProduct);

router.put('/:id', 
  param('id').isInt({ gt: 0 }),
  productValidation,
  productController.updateProduct
);

router.delete('/:id', 
  param('id').isInt({ gt: 0 }),
  productController.deleteProduct
);

router.patch('/:id/stock',
  param('id').isInt({ gt: 0 }),
  body('quantity').isInt(),
  productController.updateStock
);

module.exports = router;
