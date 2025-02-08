import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import ProductManager from "../ProductManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const productManager = new ProductManager(path.join(__dirname, "../data/products.json"));

// Agregar producto
router.post("/", async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    req.io.emit("actualizarProductos", await productManager.getProducts());
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar producto por ID
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await productManager.deleteProductById(id);
    req.io.emit("actualizarProductos", await productManager.getProducts());
    res.json({ message: `Producto con ID ${id} eliminado.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; // ✅ Asegurar la exportación
