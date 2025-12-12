import React from "react";
import ProductList from "./components/ProductList";
import "./App.css";

function App() {
  return (
    <div className="App">
      {/* El contenido principal ya está en index.html */}
      {/* Solo mostramos el componente de React para funcionalidad extra */}
      <div style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1rem" }}>
        <h2 style={{ color: "#ff1493", textAlign: "center", marginBottom: "2rem" }}>
          Catálogo en Tiempo Real
        </h2>
        <ProductList />
      </div>
    </div>
  );
}

export default App;
