import pool from '../config/db.js';
import { validationResult } from 'express-validator';

export const getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name FROM categories ORDER BY name');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ message: 'Error al obtener categorías' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;
    const [result] = await pool.query('INSERT INTO categories (name) VALUES (?)', [name]);
    const newCategory = { id: result.insertId, name };

    res.status(201).json({ message: 'Categoría creada exitosamente', category: newCategory });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ message: 'Error al crear categoría' });
  }
};