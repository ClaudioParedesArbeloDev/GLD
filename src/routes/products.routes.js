import express from "express";
import { body, param } from "express-validator";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";

const router = express.Router();

router.get("/", getProducts);

router.get(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  getProductById
);

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("El nombre es obligatorio"),
    body("price").isFloat({ min: 0 }).withMessage("El precio debe ser un número positivo"),
    body("category_id").optional().isInt().withMessage("El ID de categoría debe ser un número entero"),
    body("description").optional().isString().withMessage("La descripción debe ser un texto"),
    body("status").optional().isIn(['active', 'inactive', 'out_of_stock']).withMessage("Estado inválido"),
    body("stock").optional().isInt({ min: 0 }).withMessage("El stock debe ser un número entero no negativo"),
    body("images").optional().isArray().withMessage("Las imágenes deben ser un array"),
    body("images.*.url").optional().isURL().withMessage("La URL de la imagen debe ser válida"),
    body("images.*.alt_text").optional().isString().withMessage("El texto alternativo debe ser un texto"),
    body("images.*.position").optional().isInt({ min: 0 }).withMessage("La posición de la imagen debe ser un número entero no negativo"),
    body("videos").optional().isArray().withMessage("Los videos deben ser un array"),
    body("videos.*.url").optional().isURL().withMessage("La URL del video debe ser válida"),
    body("videos.*.position").optional().isInt({ min: 0 }).withMessage("La posición del video debe ser un número entero no negativo"),
  ],
  createProduct
);

router.put(
  "/:id",
  [
    param("id").isInt().withMessage("El ID debe ser un número entero"),
    body("name").notEmpty().withMessage("El nombre es obligatorio"),
    body("price").isFloat({ min: 0 }).withMessage("El precio debe ser un número positivo"),
    body("category_id").optional().isInt().withMessage("El ID de categoría debe ser un número entero"),
    body("description").optional().isString().withMessage("La descripción debe ser un texto"),
    body("status").optional().isIn(['active', 'inactive', 'out_of_stock']).withMessage("Estado inválido"),
    body("stock").optional().isInt({ min: 0 }).withMessage("El stock debe ser un número entero no negativo"),
    body("images").optional().isArray().withMessage("Las imágenes deben ser un array"),
    body("images.*.url").optional().isURL().withMessage("La URL de la imagen debe ser válida"),
    body("images.*.alt_text").optional().isString().withMessage("El texto alternativo debe ser un texto"),
    body("images.*.position").optional().isInt({ min: 0 }).withMessage("La posición de la imagen debe ser un número entero no negativo"),
    body("videos").optional().isArray().withMessage("Los videos deben ser un array"),
    body("videos.*.url").optional().isURL().withMessage("La URL del video debe ser válida"),
    body("videos.*.position").optional().isInt({ min: 0 }).withMessage("La posición del video debe ser un número entero no negativo"),
  ],
  updateProduct
);

router.delete(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  deleteProduct
);

export default router;