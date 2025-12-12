import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FaHome, FaShoppingCart, FaBox, FaChartBar, FaTags, FaUser } from 'react-icons/fa';

const Layout = ({ children }) => {
  const location = useLocation();
  const { getCartCount } = useCart();

  const menuItems = [
    { path: '/products', label: 'Productos', icon: <FaBox /> },
    { path: '/checkout', label: 'Carrito', icon: <FaShoppingCart />, badge: getCartCount() },
    { path: '/orders', label: 'Órdenes', icon: <FaUser /> },
    { path: '/inventory', label: 'Inventario', icon: <FaBox /> },
    { path: '/reports', label: 'Reportes', icon: <FaChartBar /> },
    { path: '/promotions', label: 'Promociones', icon: <FaTags /> }
  ];

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>La Tienda de la Ciela</h2>
          <small>Sistema de Gestión</small>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.badge > 0 && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </Link>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <FaUser className="user-avatar" />
            <div>
              <strong>Administrador</strong>
              <small>Vendedor</small>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="main-header">
          <div className="breadcrumb">
            {location.pathname.split('/').filter(Boolean).map((segment, index, array) => (
              <React.Fragment key={segment}>
                <Link to={`/${array.slice(0, index + 1).join('/')}`}>
                  {segment.charAt(0).toUpperCase() + segment.slice(1)}
                </Link>
                {index < array.length - 1 && ' / '}
              </React.Fragment>
            ))}
          </div>
          <div className="header-actions">
            <button className="btn btn-notification">
              <FaShoppingCart /> Carrito ({getCartCount()})
            </button>
          </div>
        </header>

        <div className="content-container">
          {children}
        </div>

        <footer className="main-footer">
          <p>© 2025 La Tienda de la Ciela - Proyecto de Ingeniería de Software</p>
          <p>CEUTEC - Sección 1370</p>
        </footer>
      </main>
    </div>
  );
};

export default Layout;
