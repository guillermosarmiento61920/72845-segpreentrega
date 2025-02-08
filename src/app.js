import express from "express";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js";
import { engine } from "express-handlebars";
import ProductManager from "./ProductManager.js";
import cartRouter from "./routes/cart.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const productManager = new ProductManager("./data/products.json")

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// Configuración Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware para pasar io a las rutas
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rutas
app.use("/products", productsRouter);
app.use("/", viewsRouter);
app.use("/cart", cartRouter);

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on('nuevoProducto', producto => {
    productManager.agregarProducto(producto);
    io.emit('actualizarProductos', productManager.getProductos());
});

socket.on('eliminarProducto', id => {
    productManager.eliminarProducto(id);
    io.emit('actualizarProductos', productManager.getProductos());
});
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
