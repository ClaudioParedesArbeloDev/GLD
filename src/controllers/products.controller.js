import * as Product from "../models/product.model.js";
import { validationResult } from "express-validator";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json(products);
  } catch (err) {
    console.error('Error en getProducts:', err);
    res.status(500).json({ error: "Error al obtener productos", details: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
  } catch (err) {
    console.error('Error en getProductById:', err);
    res.status(500).json({ error: "Error al obtener producto", details: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { category_id, name, description, price, status, stock, images, videos } = req.body;
    const nuevo = await Product.create(category_id || null, name, description, price, status, stock, images || [], videos || []);
    res.status(201).json(nuevo);
  } catch (err) {
    console.error('Error en createProduct:', err);
    res.status(500).json({ error: "Error al crear producto", details: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { category_id, name, description, price, status, stock, images, videos } = req.body;
    const updated = await Product.update(id, category_id || null, name, description, price, status, stock, images || [], videos || []);
    if (!updated) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto actualizado correctamente" });
  } catch (err) {
    console.error('Error en updateProduct:', err);
    res.status(500).json({ error: "Error al actualizar producto", details: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto eliminado correctamente" });
  } catch (err) {
    console.error('Error en deleteProduct:', err);
    res.status(500).json({ error: "Error al eliminar producto", details: err.message });
  }
};