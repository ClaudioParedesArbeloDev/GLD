import { useState, useEffect } from 'react';
import axios from 'axios';

import './home.css';

function Home() {
    const [products, setProducts] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

  useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/products');
                setProducts(response.data); 
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []); 

  if (loading) {
    return <div>Cargando productos...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

    return (
        <div>
            <div className="products-container">
                <h1>Productos</h1>
                    <ul>
                        {products.map((product) => (
                        <li key={product.id} className="product-item">
                            <h2>{product.name}</h2>
                            <p>Precio: ${product.price}</p>
                            <p>{product.description}</p>
                        </li>
                        ))}
                    </ul>
            </div>
        </div>
    )
}

export default Home