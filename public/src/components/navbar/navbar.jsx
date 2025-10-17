import { useState } from 'react';
import { Link } from 'react-router-dom'

import './navbar.css';



const Navbar = () => {
  // Estado para controlar si el menú hamburguesa está abierto
  const [isOpen, setIsOpen] = useState(false);

  // Función para alternar el estado del menú
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="headerNav">
      <div className="logoNav">
        <h2>GLD</h2>
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