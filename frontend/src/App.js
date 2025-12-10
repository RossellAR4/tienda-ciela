import React from 'react'; 
import ProductList from './components/ProductList'; 
import './App.css'; 
 
function App() { 
  return ( 
    <div className="App"> 
      <header className="App-header"> 
        <h1>La Tienda de la Ciela</h1> 
        <ProductList /> 
      </header> 
    </div> 
  ); 
} 
 
export default App; 
