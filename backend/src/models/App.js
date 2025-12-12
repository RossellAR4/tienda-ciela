import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Components
import Layout from './components/Layout';
import ProductList from './components/products/ProductList';
import ProductForm from './components/products/ProductForm';
import CheckoutPage from './components/checkout/CheckoutPage';
import OrderHistory from './components/orders/OrderHistory';
import InventoryManager from './components/inventory/InventoryManager';
import SalesReport from './components/reports/SalesReport';
import PromotionsManager from './components/promotions/PromotionsManager';

// Context Providers
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <Router>
      <NotificationProvider>
        <CartProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/products" />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/new" element={<ProductForm />} />
              <Route path="/products/edit/:id" element={<ProductForm />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/inventory" element={<InventoryManager />} />
              <Route path="/reports" element={<SalesReport />} />
              <Route path="/promotions" element={<PromotionsManager />} />
            </Routes>
            <ToastContainer position="bottom-right" autoClose={3000} />
          </Layout>
        </CartProvider>
      </NotificationProvider>
    </Router>
  );
}

export default App;
