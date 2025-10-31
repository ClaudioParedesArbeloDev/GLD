import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

import logo from '/logoGLD.png';
import cartIcon from '../../assets/cart.svg';

import './navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount } = useCart();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="headerNav">
    
      <Link to="/" className="logoNav">
        <img src={logo} alt="logo LGD" />
        <div className="titleEnterprise">
          <p>division</p>
          <span>importaciones</span>
        </div>
      </Link>

      
      

      
      <Link to="/cart" className="cart-link">
        <img src={cartIcon} alt="carrito" className="cart-icon" />
        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
      </Link>

      
     
    </header>
  );
};

export default Navbar;