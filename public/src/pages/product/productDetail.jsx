// src/pages/product/productDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CurrentURL } from '../../api/url.js';
import { useCart } from '../../context/CartContext'; // ← IMPORTADO
import './productDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart(); // ← OBTENER FUNCIÓN
  const [product, setProduct] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaType, setMediaType] = useState('image');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null); // ← TOAST DE ÉXITO

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${CurrentURL}products/${id}`);
        const data = response.data;

        // === NORMALIZAR MEDIOS (IMÁGENES + VIDEOS) ===
        const media = [];

        // Imágenes
        if (data.images) {
          const images = Array.isArray(data.images) ? data.images : [data.images];
          images.forEach(img => {
            const url = typeof img === 'string' ? img : img.url;
            const alt = img.alt_text || data.name;
            if (url) {
              media.push({ type: 'image', url, alt });
            }
          });
        }

        // Videos
        if (data.videos) {
          const videos = Array.isArray(data.videos) ? data.videos : [data.videos];
          videos.forEach(video => {
            const url = typeof video === 'string' ? video : video.url;
            const thumbnail = video.thumbnail || null;
            if (url) {
              media.push({ type: 'video', url, thumbnail });
            }
          });
        }

        const normalizedProduct = { ...data, media };
        setProduct(normalizedProduct);

        // Seleccionar primer medio
        if (media.length > 0) {
          setSelectedMedia(media[0].url);
          setMediaType(media[0].type);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // === HANDLER PARA AGREGAR AL CARRITO CON TOAST ===
  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.media[0]?.url || '',
        stock: product.stock
      });

      // Mostrar toast
      setToast('Producto agregado al carrito');
      setTimeout(() => setToast(null), 3000); // 3 segundos
    }
  };

  const handleMediaClick = (item) => {
    setSelectedMedia(item.url);
    setMediaType(item.type);
  };

  if (loading) return <div className="loading">Cargando producto...</div>;
  if (!product) return <div className="error">Producto no encontrado</div>;

  return (
    <div className="product-detail-container">
      {/* === TOAST DE ÉXITO === */}
      {toast && (
        <div className="toast-notification">
          {toast}
        </div>
      )}

      <Link to="/" className="back-link">
        ← Volver a productos
      </Link>

      <div className="product-detail-grid">
        {/* === MINIATURAS === */}
        <div className="thumbnails">
          {product.media?.map((item, index) => (
            <div
              key={index}
              className={`thumbnail-wrapper ${selectedMedia === item.url ? 'active' : ''}`}
              onClick={() => handleMediaClick(item)}
            >
              {item.type === 'image' ? (
                <img src={item.url} alt={item.alt} />
              ) : (
                <video
                  src={item.url}
                  poster={item.thumbnail || undefined}
                  preload="metadata"
                  className="video-thumb"
                />
              )}
              {item.type === 'video' && (
                <div className="play-overlay">Play</div>
              )}
            </div>
          ))}
        </div>

        {/* === IMAGEN O VIDEO GRANDE === */}
        <div className="main-media">
          {mediaType === 'image' ? (
            <img
              src={selectedMedia}
              alt={product.name}
              className="large-img"
            />
          ) : (
            <video
              src={selectedMedia}
              controls
              autoPlay
              className="large-video"
            >
              Tu navegador no soporta video.
            </video>
          )}
        </div>

        {/* === INFO DEL PRODUCTO === */}
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="price">
            ${parseFloat(product.price).toFixed(2)}
          </p>

          <div className="stock-info">
            {product.stock > 0 ? (
              <span className="in-stock">
                En stock ({product.stock})
              </span>
            ) : (
              <span className="out-of-stock">Sin stock</span>
            )}
          </div>

          <p className="description">{product.description}</p>

          {/* === BOTÓN CONECTADO AL CARRITO === */}
          <button
            className="btn-add-cart"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;