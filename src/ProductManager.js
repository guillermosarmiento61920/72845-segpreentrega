import fs from "fs";

class ProductManager {
  constructor(pathFile) {
    // arreglo vacio de productos
    this.pathFile = pathFile;
    this.productos = [];
  }

  // Guardar productos en el archivo
  saveProductos = async () => {
    try {
      await fs.promises.writeFile(
        this.pathFile,
        JSON.stringify(this.productos, null, 2)
      );
    } catch (error) {
      throw new Error(
        `Error al guardar el archivo de productos: ${error.message}`
      );
    }
  };

  // metodo para obtener productos. empieza vacio y luego se cargan
  getProducts = async () => {
    try {
      const fileData = await fs.promises.readFile(this.pathFile, "utf-8");
      return JSON.parse(fileData);
    } catch (error) {
      return [];
    }
  };

  // metodo para agregar. tiene los parametros y verifica si el codigo existe
  addProduct = async (product) => {
    const { title, description, price, thumbnail, code, stock } = product;
    if (!title || !description || !price || !code || !stock) {
      throw new Error("Todos los campos son obligatorios");
    }

    const productos = await this.getProducts();

    const codigoExiste = productos.some((producto) => producto.code === code);
    if (codigoExiste) {
      throw new Error(`El codigo ${code} ya existe`);
    }

    const newId = productos.length
      ? Math.max(...productos.map((producto) => producto.id)) + 1
      : 1;

    const newProduct = {
      id: newId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    productos.push(newProduct);
    this.productos = productos;
    await this.saveProductos();
    return newProduct;
  };

  // metodo para obtener producto por id. si no existe devuelve mensaje de error
  getProductById = async (id) => {
    const productos = await this.getProducts();
    const producto = productos.find((producto) => producto.id === id);
    if (!producto) {
      throw new Error(`Producto con id ${id} no encontrado`);
    }
    return producto;
  };

  // Actualizar producto por ID
  updateProductById = async (id, updatedProduct) => {
    const productos = await this.getProducts();
    const index = productos.findIndex((producto) => producto.id === id);
    if (index === -1) {
      throw new Error(`Producto con id ${id} no encontrado`);
    }

    delete updatedProduct.id;

    productos[index] = { ...productos[index], ...updatedProduct };
    this.productos = productos;
    await this.saveProducts();
    return productos[index];
  };

  deleteProductById = async (id) => {
    const productos = await this.getProducts();
    const index = productos.findIndex((producto) => producto.id === id);
    if (index === -1) {
      throw new Error(`Producto con id ${id} no encontrado`);
    }

    const deletedProduct = productos.splice(index, 1);
    this.productos = productos; // Actualizamos la propiedad interna
    await this.saveProductos();
    return deletedProduct;
  };

  // setProductById = async (id, updatedProduct) => {
  //   const productos = await this.getProducts();
  //   const index = productos.findIndex((producto) => producto.id === id);
  //   if (index === -1) {
  //     throw new Error(`Producto con id ${id} no encontrado`);
  //   }

  //   productos[index] = {
  //     ...productos[index],
  //     ...updatedProduct,
  //     id: productos[index].id,
  //   };
  //   this.productos = productos;
  //   await this.saveProducts();
  //   return productos[index];
  // };
}
export default ProductManager;
