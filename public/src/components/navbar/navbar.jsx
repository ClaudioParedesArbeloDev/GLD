import { useState } from 'react';
import { Link } from 'react-router-dom'

import logo from '/logoGLD.png';
import './navbar.css';



const Navbar = () => {
  
  const [isOpen, setIsOpen] = useState(false);

  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="headerNav">
      <div className="logoNav">
        <img src= {logo} alt="logo LGD" />
        <p>importaciones</p>
      </div>
      <nav>
        <div className={`hamburger ${isOpen ? 'toggle' : ''}`} onClick={toggleMenu} role="button" aria-label="Toggle menu">
          <div className="line1"></div>
          <div className="line2"></div>
          <div className="line3"></div>
        </div>
        <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
          <li className={isOpen ? 'fade' : ''}>
            <Link to="/" onClick={toggleMenu}>Inicio</Link>
          </li>
          <li className={isOpen ? 'fade' : ''}>
            <Link to="/products" onClick={toggleMenu}>
              Productos
            </Link>
          </li>
          <li className={isOpen ? 'fade' : ''}>
            <Link to="/services" onClick={toggleMenu}>
              Servicios
            </Link>
          </li>
          <li className={isOpen ? 'fade' : ''}>
            <Link to="/contact" onClick={toggleMenu}>
              Contacto
            </Link>
          </li>
        </ul>
      </nav>
      <div>
        <span className="material-symbols-outlined cart" role="button" aria-label="Carrito de compras">
          shopping_cart
        </span>
      </div>
    </header>
  );
};

export default Navbar;