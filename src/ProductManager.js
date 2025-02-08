import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProductManager {
  constructor() {
    this.path = path.join(__dirname, "./data/products.json");
    this.products = [];
    this.init();
  }

  async init() {
    await this.getProducts();
  }

  async saveProducts() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), "utf8");
    } catch (error) {
      console.error("Error al guardar el archivo de productos:", error);
    }
  }

  async getProducts() {
    try {
      // Verificar si el archivo existe antes de leerlo
      await fs.access(this.path).catch(async () => {
        await fs.writeFile(this.path, "[]", "utf8"); // Si no existe, lo crea vacío
      });
  
      const data = await fs.readFile(this.path, "utf8");
      this.products = JSON.parse(data);
      return this.products;
    } catch (error) {
      console.error("Error al cargar los productos:", error);
      return [];
    }
  }

  async addProduct(product) {
    try {
      if (!Array.isArray(this.products)) {
        this.products = [];
      }

      if (!product.title || !product.price) {
        throw new Error("Faltan campos obligatorios en el producto.");
      }

      product.id = this.products.length ? this.products[this.products.length - 1].id + 1 : 1;
      this.products.push(product);
      
      await this.saveProducts();
      return product;
    } catch (error) {
      console.error("Error al agregar producto:", error);
      throw error;
    }
  }

  async getProductById(id) {
    const productos = await this.getProducts();
    const producto = productos.find((producto) => producto.id === id);
    if (!producto) {
      throw new Error(`Producto con id ${id} no encontrado`);
    }
    return producto;
  }

  async updateProductById(id, updatedProduct) {
    const productos = await this.getProducts();
    const index = productos.findIndex((producto) => producto.id === id);
    if (index === -1) {
      throw new Error(`Producto con id ${id} no encontrado`);
    }

    delete updatedProduct.id;

    productos[index] = { ...productos[index], ...updatedProduct };
    this.products = productos;
    await this.saveProducts();
    return productos[index];
  }

  async deleteProductById(id) {
    const productos = await this.getProducts();
    const index = productos.findIndex((producto) => producto.id === id);
    if (index === -1) {
      throw new Error(`Producto con id ${id} no encontrado`);
    }

    productos.splice(index, 1);
    this.products = productos;
    await this.saveProducts();
    return { message: `Producto con ID ${id} eliminado.` };
  }
}

export default ProductManager;
