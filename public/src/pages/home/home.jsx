import { useState, useEffect } from 'react';
import axios from 'axios';

import './home.css';
import Card from '../../components/card/card';

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
        <div className='main'>
            <div className="products-container">
                <h1>Productos</h1>
                   <ul className="products-grid">
      {products.map((product) => (
        <Card key={product.id} product={product} />
      ))}
    </ul>
            </div>
        </div>
    )
}

export default Home