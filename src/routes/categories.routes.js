import express from 'express';
import { body } from 'express-validator';
import { getCategories, createCategory } from '../controllers/categories.controller.js';

const router = express.Router();


router.get('/', getCategories);

router.post('/',
[
    body('name')
      .notEmpty()
      .withMessage('El nombre de la categoría es obligatorio')
      .isString()
      .withMessage('El nombre debe ser un texto')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('El nombre debe tener entre 1 y 100 caracteres'),
  ],
  createCategory
);

export default router;