import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './card.css';

function Card({ product }) {
  const { addToCart } = useCart();

  if (!product) return null;

  const handleAddToCart = (e) => {
    e.preventDefault(); 
    e.stopPropagation();

    if (product.stock > 0) {
      addToCart({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.images?.[0]?.url || '',
        stock: product.stock
      });
    }
  };

  return (
    <li className="product-card">
      <Link to={`/product/${product.id}`} className="card-link">
        <div className="card-image">
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0].url} 
              alt={product.images[0].alt_text || product.name} 
            />
          ) : (
            <div className="no-image">Sin imagen</div>
          )}
        </div>

        <div className="card-content">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">${parseFloat(product.price).toFixed(2)}</p>
          
          {product.stock > 0 ? (
            <span className="stock in-stock">En stock ({product.stock})</span>
          ) : (
            <span className="stock out-of-stock">Sin stock</span>
          )}
        </div>
      </Link>

      
    </li>
  );
}

export default Card;