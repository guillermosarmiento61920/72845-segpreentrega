import express from "express";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";

// app express y puerto
const app = express();
const PORT = 8080;

//habilitamos poder recibir json y urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//endpoints
app.use("/products", productsRouter);
app.use("/cart", cartRouter);

app.get("/", (req, res) => {
  res.send("Bienvenidos");
});

//inicio del servidor en puerto 8080
app.listen(PORT, () =>
  console.log(`Servidor iniciado en: http://localhost:${PORT}`)
);
