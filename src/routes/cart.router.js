import express from "express";
import CartManager from "../CartManager.js";

//instanciamos el router de express para manejar las rutas
const cartRouter = express.Router();
//instanciamos el manejador de nuestro archivo de carrito
const cartManager = new CartManager("./src/data/cart.json");

//POST /
cartRouter.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.addCart();
    res.status(201).send(newCart);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//GET /:cid
cartRouter.get("/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(parseInt(req.params.cid));
    res.status(200).send(cart);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

//POST /:cid/product/:pid
cartRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cart = await cartManager.addProductInCartById(
      parseInt(req.params.cid),
      parseInt(req.params.pid)
    );
    res.status(200).send(cart);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default cartRouter;
