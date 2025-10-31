import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './cart.css';

function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Tu carrito está vacío</h2>
        <Link to="/" className="btn-primary">Seguir comprando</Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Carrito de compras</h1>

      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-img" />
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p className="price">${item.price.toFixed(2)}</p>
            </div>
            <div className="cart-item-actions">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button className="remove" onClick={() => removeFromCart(item.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <p className="total">Total: <strong>${cartTotal.toFixed(2)}</strong></p>
        <button className="btn-checkout">Finalizar compra</button>
        <button className="btn-clear" onClick={clearCart}>Vaciar carrito</button>
      </div>
    </div>
  );
}

export default Cart;