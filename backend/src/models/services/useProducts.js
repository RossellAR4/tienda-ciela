import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/api';

// Custom Hook para manejo de productos con memoización
export const useProducts = (initialFilters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAll(filters);
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Error cargando productos');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const refresh = () => {
    loadProducts();
  };

  const getProductById = async (id) => {
    try {
      return await productService.getById(id);
    } catch (error) {
      throw new Error(`Error getting product ${id}: ${error.message}`);
    }
  };

  const createProduct = async (productData) => {
    try {
      const newProduct = await productService.create(productData);
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (error) {
      throw error;
    }
  };

  const updateProduct = async (id, updates) => {
    try {
      const updatedProduct = await productService.update(id, updates);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productService.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      throw error;
    }
  };

  return {
    products,
    loading,
    error,
    filters,
    setFilters,
    refresh,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
  };
};
