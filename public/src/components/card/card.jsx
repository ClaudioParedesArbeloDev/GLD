import './card.css'; // Opcional: estilos específicos del card

function Card({ product }) {
  // Validación básica: si no hay producto, no renderiza nada
  if (!product) return null;

  return (
    <li className="product-card">
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
        <p className="product-description">{product.description}</p>
        
        {product.stock > 0 ? (
          <span className="stock in-stock">En stock ({product.stock})</span>
        ) : (
          <span className="stock out-of-stock">Sin stock</span>
        )}
      </div>

      <div className="card-actions">
        <button className="btn-add">Agregar al carrito</button>
      </div>
    </li>
  );
}

export default Card;