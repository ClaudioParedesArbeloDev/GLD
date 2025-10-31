//Modules
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import  { CartProvider } from './context/CartContext.jsx'

//Components

import Navbar from './components/navbar/navbar.jsx'
import Footer from './components/footer/footer.jsx'
import Home from './pages/home/home.jsx'
import Admin from './pages/admin/admin.jsx' 
import ProductDetail from './pages/product/productDetail.jsx'
import Cart from './pages/cart/cart.jsx'

//Styles
import './style.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </CartProvider>
  </StrictMode>,
)
