import React, { useEffect, useState } from 'react'; 
import { getProducts } from '../services/productService'; 
 
const ProductList = () => { 
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true); 
 
  useEffect(() => { 
    getProducts() 
      .then(data => { 
        setProducts(data); 
        setLoading(false); 
      }) 
      .catch(error => { 
        console.error('Error fetching products:', error); 
        setLoading(false); 
      }); 
  }, []); 
 
  if (loading) return <p>Cargando productos...</p>; 
 
  return ( 
    <div className="product-list"> 
      <h2>Cat logo de Productos</h2> 
      <ul> 
        {products.map(product => ( 
          <li key={product.id}> 
            <strong>{product.name}</strong> - ${product.price} (Stock: {product.stock}) 
          </li> 
        ))} 
      </ul> 
    </div> 
  ); 
}; 
 
export default ProductList; 
