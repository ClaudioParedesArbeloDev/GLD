import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productsRoutes from "./routes/products.routes.js"
import categoriesRoutes from "./routes/categories.routes.js"

dotenv.config();
const app = express();

// Middlewares
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());


// Rutas
app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);

// Servidor
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
