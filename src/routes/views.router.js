import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import ProductManager from "../ProductManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productManager = new ProductManager(path.join(__dirname, "../data/products.json"));

const router = Router();

router.get("/", async (req, res) => {
  try {
    const productos = await productManager.getProducts();
    res.render("home", { productos });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const productos = await productManager.getProducts();
    res.render("realTimeProducts", { productos });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get("/products", async (req, res) => {
  try {
    const productos = await productManager.getProducts();
    res.render("products", { productos });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default router;
