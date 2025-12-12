import React, { createContext, useState, useContext, useEffect } from 'react';

// PATRÓN OBSERVER para notificaciones del carrito
class CartObserver {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notify(event, data) {
    this.observers.forEach(observer => observer(event, data));
  }
}

const CartContext = createContext();
const cartObserver = new CartObserver();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : { items: [], total: 0 };
  });

  const [notifications, setNotifications] = useState([]);

  // Suscribirse a observador
  useEffect(() => {
    const handleCartUpdate = (event, data) => {
      setNotifications(prev => [...prev, { event, data, timestamp: new Date() }]);
    };

    cartObserver.subscribe(handleCartUpdate);
    return () => cartObserver.unsubscribe(handleCartUpdate);
  }, []);

  // Persistir carrito
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.items.find(item => item.id === product.id);
      
      let newItems;
      if (existingItem) {
        newItems = prevCart.items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...prevCart.items, { ...product, quantity }];
      }

      const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Notificar a los observadores
      cartObserver.notify('item_added', { product, quantity });
      
      return { items: newItems, total: newTotal };
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.id !== productId);
      const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      cartObserver.notify('item_removed', { productId });
      
      return { items: newItems, total: newTotal };
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      
      const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      cartObserver.notify('quantity_updated', { productId, quantity });
      
      return { items: newItems, total: newTotal };
    });
  };

  const clearCart = () => {
    setCart({ items: [], total: 0 });
    cartObserver.notify('cart_cleared', {});
  };

  const getCartCount = () => {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartCount,
      notifications
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};
