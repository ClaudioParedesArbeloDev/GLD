import { useState, useEffect } from 'react';
import axios from 'axios';
import { CurrentURL } from '../../api/url.js';

import search from '../../assets/search.svg';
import './home.css';
import Card from '../../components/card/card';

function Home() {
  
    const [products, setProducts] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

  useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${CurrentURL}products`);
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
      <div className='searchWrapper'>
        <div className="search">
          <img src={search} alt="search" className="searchIcon"/>
          <input type="text" className='inputProduct' placeholder='Ingrese el producto que desea buscar'/>
        </div>
        <select name="categories" id="" className="categories">
          <option value="all">Filtrar por categoría</option>
          <option value="1">Electrónica</option>   
        </select>
      </div>
      <div className="products-container">
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