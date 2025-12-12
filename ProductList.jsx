import React, { useEffect, useState } from "react";
import { getProducts } from "../services/productService";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("No se pudieron cargar los productos. Intenta de nuevo más tarde.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <i className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "#ff69b4", marginBottom: "1rem" }}></i>
        <p>Cargando catálogo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <i className="fas fa-exclamation-triangle" style={{ fontSize: "2rem", marginBottom: "1rem" }}></i>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            background: "#4169e1",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "20px",
            cursor: "pointer",
            marginTop: "1rem"
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h3 style={{ color: "#333" }}>Productos Disponibles ({products.length})</h3>
        <span style={{ color: "#666", fontSize: "0.9rem" }}>
          <i className="fas fa-sync-alt" style={{ marginRight: "0.5rem" }}></i>
          Actualizado en tiempo real
        </span>
      </div>
      
      {products.map((product) => (
        <div key={product.id} className="product-item">
          <div style={{ flex: 1 }}>
            <div className="product-name">{product.name}</div>
            <div style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.2rem" }}>
              <i className="fas fa-tag"></i> {product.category}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="product-price">${product.price.toFixed(2)}</div>
            <div className="product-stock">
              <i className="fas fa-box"></i> Stock: {product.stock}
            </div>
          </div>
          <button
            style={{
              background: "#ff69b4",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              cursor: "pointer",
              marginLeft: "1rem",
              transition: "all 0.3s ease"
            }}
            onMouseOver={(e) => e.target.style.background = "#ff1493"}
            onMouseOut={(e) => e.target.style.background = "#ff69b4"}
            onClick={() => alert(`¡${product.name} añadido al carrito!`)}
          >
            <i className="fas fa-cart-plus"></i> Añadir
          </button>
        </div>
      ))}
      
      <div style={{ marginTop: "2rem", textAlign: "center", color: "#666", fontSize: "0.9rem" }}>
        <p>
          <i className="fas fa-info-circle"></i> Los productos se cargan desde la API del backend
        </p>
      </div>
    </div>
  );
};

export default ProductList;
