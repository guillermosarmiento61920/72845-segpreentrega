import fs from "fs";

class CartManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
    this.carts = [];
  }

  // Guardar carritos en el archivo
  saveCarts = async () => {
    try {
      await fs.promises.writeFile(
        this.pathFile,
        JSON.stringify(this.carts, null, 2)
      );
    } catch (error) {
      throw new Error(
        `Error al guardar el archivo de carritos: ${error.message}`
      );
    }
  };

  getCarts = async () => {
    try {
      const fileData = await fs.promises.readFile(this.pathFile, "utf-8");
      return JSON.parse(fileData);
    } catch (error) {
      return [];
    }
  };

  //addCart
  addCart = async () => {
    const carts = await this.getCarts();
    const newCart = {
      cid: carts.length ? Math.max(...carts.map((cart) => cart.cid)) + 1 : 1,
      products: [],
    };
    carts.push(newCart);
    this.carts = carts;
    await this.saveCarts();
    return newCart;
  };

  //getCartById
  getCartById = async (cid) => {
    const carts = await this.getCarts();
    const cart = carts.find((cart) => cart.cid === cid);
    if (!cart) {
      throw new Error(`Carrito con id ${cid} no encontrado`);
    }
    return cart;
  };

  //addProductInCartById
  addProductInCartById = async (cId, pId) => {
    const carts = await this.getCarts();
    const cart = carts.find((cart) => cart.cid === cId);
    if (!cart) {
      throw new Error(`Carrito con id ${cId} no encontrado`);
    }

    const productIndex = cart.products.findIndex((p) => p.id === pId);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ id: pId, quantity: 1 });
    }

    this.carts = carts;
    await this.saveCarts();
    return cart;
  };
}

export default CartManager;
