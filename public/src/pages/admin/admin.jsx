import { useState, useEffect } from 'react';
import axios from 'axios';

import './admin.css';

import { CurrentURL } from '../../api/url.js';

function Admin() {
  // Estado para el formulario de productos
  const [formData, setFormData] = useState({
    category_id: '',
    name: '',
    description: '',
    price: '',
    stock: '',
    status: 'active',
    images: [''],
    videos: [''],
  });
  // Estado para el formulario de categorías
  const [categoryForm, setCategoryForm] = useState({ name: '' });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Obtener categorías al cargar el componente
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${CurrentURL}categories`);
        setCategories(response.data);
        console.log(categories)
      } catch (err) {
        setError('Error al obtener las categorías: ' + (err.response?.data?.message || err.message));
      }
    };
    fetchCategories();
  }, []);

  // Manejar cambios en los inputs del formulario de productos
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejar cambios en el formulario de categorías
  const handleCategoryInputChange = (e) => {
    setCategoryForm({ ...categoryForm, name: e.target.value });
  };

  // Manejar cambios en los inputs de URLs (imágenes y videos)
  const handleUrlChange = (index, type, value) => {
    const updatedArray = [...formData[type]];
    updatedArray[index] = value;
    setFormData({ ...formData, [type]: updatedArray });
  };

  // Agregar un nuevo campo de URL
  const addUrlField = (type) => {
    setFormData({ ...formData, [type]: [...formData[type], ''] });
  };

  // Eliminar un campo de URL
  const removeUrlField = (index, type) => {
    const updatedArray = formData[type].filter((_, i) => i !== index);
    setFormData({ ...formData, [type]: updatedArray });
  };

  // Manejar el envío del formulario de productos
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.category_id || !formData.name || !formData.price || !formData.stock) {
      setError('Por favor, completa todos los campos obligatorios');
      return;
    }

    try {
      const data = {
        category_id: parseInt(formData.category_id),
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        status: formData.status,
        images: formData.images
          .map((url, index) => ({ url, position: index, alt_text: `Imagen ${index + 1}` }))
          .filter((img) => img.url),
        videos: formData.videos
          .map((url, index) => ({ url, position: index }))
          .filter((vid) => vid.url),
      };

      const response = await axios.post(`${CurrentURL}products`, data, {
        headers: { 'Content-Type': 'application/json' },
      });

      setSuccess('¡Producto agregado exitosamente!');
      setFormData({
        category_id: '',
        name: '',
        description: '',
        price: '',
        stock: '',
        status: 'active',
        images: [''],
        videos: [''],
      });
    } catch (err) {
      setError('Error al agregar el producto: ' + (err.response?.data?.message || err.message));
    }
  };

  // Manejar el envío del formulario de categorías
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!categoryForm.name) {
      setError('Por favor, ingresa el nombre de la categoría');
      return;
    }

    try {
      const response = await axios.post(`${CurrentURL}categories`, { name: categoryForm.name }, {
        headers: { 'Content-Type': 'application/json' },
      });

      setSuccess('¡Categoría creada exitosamente!');
      setCategoryForm({ name: '' });
      // Actualizar la lista de categorías
      setCategories([...categories, response.data.category]);
    } catch (err) {
      setError('Error al crear la categoría: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="wrapperAdmin">
      <h2 className="panelAdmin">Admin Panel</h2>

      {/* Formulario para crear categorías */}
      <div className="formCategories">
        <h3>Nueva Categoría</h3>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form onSubmit={handleCategorySubmit}>
          <div>
            <label>Nombre de la Categoría</label>
            <input
              type="text"
              name="name"
              value={categoryForm.name}
              onChange={handleCategoryInputChange}
              placeholder="Nombre de la categoría"
            />
          </div>
          <button type="submit">Crear Categoría</button>
        </form>
      </div>

      {/* Formulario para crear productos */}
      <div className="formProducts">
        <h3>Productos</h3>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Categoría</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
            >
              <option value="">Seleccionar</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nombre del producto"
            />
          </div>
          <div>
            <label>Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descripción del producto"
              rows="4"
            ></textarea>
          </div>
          <div>
            <label>Precio</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Precio del producto"
              step="0.01"
            />
          </div>
          <div>
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="Stock del producto"
            />
          </div>
          <div>
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="out_of_stock">Out of stock</option>
            </select>
          </div>
          <div>
            <label>Imágenes (URLs)</label>
            {formData.images.map((url, index) => (
              <div key={index} className="url-input">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => handleUrlChange(index, 'images', e.target.value)}
                  placeholder={`URL de imagen ${index + 1}`}
                />
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeUrlField(index, 'images')}
                    className="remove-url"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addUrlField('images')}
              className="add-url"
            >
              Agregar otra imagen
            </button>
          </div>
          <div>
            <label>Videos (URLs)</label>
            {formData.videos.map((url, index) => (
              <div key={index} className="url-input">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => handleUrlChange(index, 'videos', e.target.value)}
                  placeholder={`URL de video ${index + 1}`}
                />
                {formData.videos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeUrlField(index, 'videos')}
                    className="remove-url"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addUrlField('videos')}
              className="add-url"
            >
              Agregar otro video
            </button>
          </div>
          <button type="submit">Guardar</button>
        </form>
      </div>
    </div>
  );
}

export default Admin;