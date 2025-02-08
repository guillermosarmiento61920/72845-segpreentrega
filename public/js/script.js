const socket = io();

// Ejemplo de agregar un producto
document.getElementById("agregarProducto").addEventListener("click", () => {
  const nuevoProducto = {
    title: "Producto Nuevo",
    description: "Descripción",
    price: 100,
    code: "ABC123",
    stock: 10,
  };
  socket.emit("nuevoProducto", nuevoProducto);
});

// Ejemplo de eliminar un producto
document.getElementById("eliminarProducto").addEventListener("click", () => {
  const idProducto = 1; // Cambiar por el ID real
  socket.emit("eliminarProducto", idProducto);
});
