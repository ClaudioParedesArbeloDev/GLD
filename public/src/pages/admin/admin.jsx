// src/pages/admin/admin.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { CurrentURL } from '../../api/url.js';

import './admin.css';

function Admin() {
  const [activeTab, setActiveTab] = useState('create-category');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  
  const [categoryForm, setCategoryForm] = useState({ name: '' });
  const [productForm, setProductForm] = useState({
    category_id: '',
    name: '',
    description: '',
    price: '',
    stock: '',
    status: 'active',
    images: [''],
    videos: [''],
  });
  const [editingProduct, setEditingProduct] = useState(null);


  useEffect(() => {
    fetchCategories();
    if (activeTab === 'view-products') fetchProducts();
  }, [activeTab]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${CurrentURL}categories`);
      setCategories(res.data);
    } catch (err) {
      setError('Error al cargar categorías');
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${CurrentURL}products`);
      setProducts(res.data);
    } catch (err) {
      setError('Error al cargar productos');
    }
  };

  
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!categoryForm.name) return setError('Nombre requerido');

    try {
      const res = await axios.post(`${CurrentURL}categories`, { name: categoryForm.name });
      setSuccess('Categoría creada');
      setCategoryForm({ name: '' });
      setCategories([...categories, res.data.category]);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

    const data = {
      category_id: parseInt(productForm.category_id),
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      stock: parseInt(productForm.stock),
      status: productForm.status,
      images: productForm.images.filter(url => url).map((url, i) => ({ url, position: i, alt_text: `Imagen ${i+1}` })),
      videos: productForm.videos.filter(url => url).map((url, i) => ({ url, position: i })),
    };

    try {
      let res;
      if (editingProduct) {
        res = await axios.put(`${CurrentURL}products/${editingProduct.id}`, data);
        setSuccess('Producto actualizado');
      } else {
        res = await axios.post(`${CurrentURL}products`, data);
        setSuccess('Producto creado');
      }

      setProductForm({
        category_id: '', name: '', description: '', price: '', stock: '',
        status: 'active', images: [''], videos: ['']
      });
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  
  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      await axios.delete(`${CurrentURL}products/${id}`);
      setSuccess('Producto eliminado');
      fetchProducts();
    } catch (err) {
      setError('Error al eliminar');
    }
  };

  
  const startEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      category_id: product.category_id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      status: product.status,
      images: product.images?.map(i => i.url) || [''],
      videos: product.videos?.map(v => v.url) || [''],
    });
    setActiveTab('create-product');
  };

  
  const handleUrlChange = (index, type, value) => {
    const updated = [...productForm[type]];
    updated[index] = value;
    setProductForm({ ...productForm, [type]: updated });
  };

  const addUrlField = (type) => {
    setProductForm({ ...productForm, [type]: [...productForm[type], ''] });
  };

  const removeUrlField = (index, type) => {
    setProductForm({ ...productForm, [type]: productForm[type].filter((_, i) => i !== index) });
  };

  return (
    <div className="admin-wrapper">
      <h2>Panel de Administración</h2>

      
      <div className="admin-tabs">
        <button
          className={activeTab === 'create-category' ? 'active' : ''}
          onClick={() => setActiveTab('create-category')}
        >
          Categorías
        </button>
        <button
          className={activeTab === 'create-product' ? 'active' : ''}
          onClick={() => setActiveTab('create-product')}
        >
          {editingProduct ? 'Editar' : 'Crear'} Producto
        </button>
        <button
          className={activeTab === 'view-products' ? 'active' : ''}
          onClick={() => setActiveTab('view-products')}
        >
          Ver Productos
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      
      {activeTab === 'create-category' && (
        <div className="form-section">
          <h3>Nueva Categoría</h3>
          <form onSubmit={handleCategorySubmit}>
            <input
              type="text"
              placeholder="Nombre"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ name: e.target.value })}
            />
            <button type="submit">Crear</button>
          </form>
        </div>
      )}

      
      {activeTab === 'create-product' && (
        <div className="form-section">
          <h3>{editingProduct ? 'Editar' : 'Crear'} Producto</h3>
          <form onSubmit={handleProductSubmit}>
            <select
              value={productForm.category_id}
              onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
            >
              <option value="">Seleccionar categoría</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <input type="text" placeholder="Nombre" value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />

            <textarea placeholder="Descripción" value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />

            <input type="number" placeholder="Precio" step="0.01" value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />

            <input type="number" placeholder="Stock" value={productForm.stock}
              onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} />

            <select value={productForm.status}
              onChange={(e) => setProductForm({ ...productForm, status: e.target.value })}>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="out_of_stock">Sin stock</option>
            </select>

            <div>
              <label>Imágenes (URLs)</label>
              {productForm.images.map((url, i) => (
                <div key={i} className="url-input">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => handleUrlChange(i, 'images', e.target.value)}
                    placeholder={`Imagen ${i + 1}`}
                  />
                  {productForm.images.length > 1 && (
                    <button type="button" onClick={() => removeUrlField(i, 'images')}>X</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addUrlField('images')}>+ Imagen</button>
            </div>

            <div>
              <label>Videos (URLs)</label>
              {productForm.videos.map((url, i) => (
                <div key={i} className="url-input">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => handleUrlChange(i, 'videos', e.target.value)}
                    placeholder={`Video ${i + 1}`}
                  />
                  {productForm.videos.length > 1 && (
                    <button type="button" onClick={() => removeUrlField(i, 'videos')}>X</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addUrlField('videos')}>+ Video</button>
            </div>

            <button type="submit">{editingProduct ? 'Actualizar' : 'Crear'}</button>
            {editingProduct && (
              <button type="button" onClick={() => {
                setEditingProduct(null);
                setProductForm({ category_id: '', name: '', description: '', price: '', stock: '', status: 'active', images: [''], videos: [''] });
              }}>
                Cancelar
              </button>
            )}
          </form>
        </div>
      )}

      
      {activeTab === 'view-products' && (
        <div className="products-list">
          <h3>Todos los Productos</h3>
          {products.length === 0 ? (
            <p>No hay productos</p>
          ) : (
            <table className="products-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>
                      {product.images?.[0]?.url ? (
                        <img src={product.images[0].url} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                      ) : '-'}
                    </td>
                    <td>{product.name}</td>
                    <td>${parseFloat(product.price).toFixed(2)}</td>
                    <td>{product.stock}</td>
                    <td>{product.status}</td>
                    <td>
                      <button onClick={() => startEdit(product)}>Editar</button>
                      <button className="delete" onClick={() => handleDelete(product.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default Admin;