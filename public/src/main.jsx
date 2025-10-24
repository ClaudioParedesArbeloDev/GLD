//Modules
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

//Components
import Navbar from './components/navbar/navbar.jsx'
import Footer from './components/footer/footer.jsx'
import Home from './pages/home/home.jsx'
import Products from './pages/products/products.jsx'
import Services from './pages/services/services.jsx'
import Contact from './pages/contact/contact.jsx'
import Admin from './pages/admin/admin.jsx' 

//Styles
import './style.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </StrictMode>,
)
