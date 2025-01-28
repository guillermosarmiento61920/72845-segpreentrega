import express from "express";
import ProductManager from "../ProductManager.js";

//instanciamos express y el archivo de productos
const productsRouter = express.Router();
const productManager = new ProductManager("./src/data/products.json");

//GET "/"
productsRouter.get("/", async (req, res) => {
  try {
    const datoProducto = await productManager.getProducts();
    res.status(200).send(datoProducto);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//GET "/:pid"
productsRouter.get("/:pid", async (req, res) => {
  try {
    const product = await productManager.getProductById(
      parseInt(req.params.pid)
    );
    res.status(200).send(product);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

//POST "/"
productsRouter.post("/", async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).send(newProduct);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

//PUT "/:pid"
productsRouter.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = await productManager.updateProductById(
      parseInt(req.params.pid),
      req.body
    );
    res.status(200).send(updatedProduct);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

//DELETE "/:pid"
productsRouter.delete("/:pid", async (req, res) => {
  try {
    const deletedProduct = await productManager.deleteProductById(
      parseInt(req.params.pid)
    );
    res.status(200).send(deletedProduct);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

export default productsRouter;
