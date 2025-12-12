import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../../context/CartContext';
import { orderService, paymentService } from '../../services/api';

// Strategy Pattern para métodos de pago
const PaymentStrategies = {
  cash: (amount) => ({
    process: () => ({ method: 'cash', amount, status: 'paid' }),
    getDetails: () => 'Pago en efectivo al recibir'
  }),
  
  credit_card: (amount) => ({
    process: () => ({
      method: 'credit_card',
      amount,
      status: 'paid',
      cardNumber: '**** **** **** 1234'
    }),
    getDetails: () => 'Pago con tarjeta de crédito'
  }),
  
  transfer: (amount) => ({
    process: () => ({
      method: 'transfer',
      amount,
      status: 'pending',
      bank: 'Banco Nacional',
      account: '123-456-789'
    }),
    getDetails: () => 'Transferencia bancaria'
  })
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [processing, setProcessing] = useState(false);

  if (cart.items.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Tu carrito está vacío</h2>
        <button onClick={() => navigate('/products')} className="btn btn-primary">
          Ver Productos
        </button>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Validar información del cliente
      if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
        throw new Error('Por favor completa todos los campos requeridos');
      }

      // Crear items para la orden
      const orderItems = cart.items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      // Usar Strategy Pattern para procesar pago
      const paymentStrategy = PaymentStrategies[paymentMethod];
      if (!paymentStrategy) {
        throw new Error('Método de pago no válido');
      }

      const paymentDetails = paymentStrategy(cart.total).process();

      // Crear orden
      const orderData = {
        customerId: `cust-${Date.now()}`,
        customerInfo,
        items: orderItems,
        paymentMethod,
        total: cart.total,
        paymentDetails
      };

      const order = await orderService.create(orderData);

      // Limpiar carrito
      clearCart();

      toast.success(`¡Orden #${order.id} creada exitosamente!`);
      
      // Redirigir a confirmación
      navigate('/orders', { state: { orderId: order.id } });
      
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="checkout-container">
      <h1>Finalizar Compra</h1>
      
      <div className="checkout-layout">
        {/* Resumen del carrito */}
        <div className="cart-summary">
          <h3>Resumen de tu Pedido</h3>
          <ul className="cart-items">
            {cart.items.map(item => (
              <li key={item.id} className="cart-item">
                <div className="item-info">
                  <strong>{item.name}</strong>
                  <div>Cantidad: {item.quantity}</div>
                </div>
                <div className="item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <strong>Total:</strong>
            <strong>${cart.total.toFixed(2)}</strong>
          </div>
        </div>

        {/* Formulario de checkout */}
        <form onSubmit={handleSubmit} className="checkout-form">
          <h3>Información del Cliente</h3>
          
          <div className="form-group">
            <label>Nombre Completo *</label>
            <input
              type="text"
              name="name"
              value={customerInfo.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={customerInfo.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Teléfono *</label>
            <input
              type="tel"
              name="phone"
              value={customerInfo.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Dirección de Entrega</label>
            <textarea
              name="address"
              value={customerInfo.address}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          <h3>Método de Pago</h3>
          <div className="payment-methods">
            {Object.keys(PaymentStrategies).map(method => (
              <label key={method} className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="payment-label">
                  {method === 'cash' && '💵 Efectivo'}
                  {method === 'credit_card' && '💳 Tarjeta de Crédito'}
                  {method === 'transfer' && '🏦 Transferencia'}
                </span>
                <small>{PaymentStrategies[method](cart.total).getDetails()}</small>
              </label>
            ))}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-lg"
            disabled={processing}
          >
            {processing ? (
              <>
                <span className="spinner"></span> Procesando...
              </>
            ) : (
              `Pagar $${cart.total.toFixed(2)}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
