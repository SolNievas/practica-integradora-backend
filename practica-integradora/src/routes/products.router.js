import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";

const productsRouter = Router();
const productManager = new ProductManager();

productsRouter.get("/", async (req, res) => {
  let { limit } = req.query;
  const products = await productManager.getProducts(limit);

  res.send({ products });
});

productsRouter.get("/:pid", async (req, res) => {
  let pid = req.params.pid;
  const products = await productManager.getProductById(pid);

  res.send({ products });
});

productsRouter.post("/", async (req, res) => {
  let { title, description, code, price, status, stock, category, thumbnails } =
    req.body;

  if (!title) {
    res
      .status(400)
      .send({ status: "error", message: "Error! No se cargó el campo Title!" });
    return false;
  }

  if (!description) {
    res.status(400).send({
      status: "error",
      message: "Error! No se cargó el campo Description!",
    });
    return false;
  }

  if (!code) {
    res
      .status(400)
      .send({ status: "error", message: "Error! No se cargó el campo Code!" });
    return false;
  }

  if (!price) {
    res
      .status(400)
      .send({ status: "error", message: "Error! No se cargó el campo Price!" });
    return false;
  }

  status = !status && true;

  if (!stock) {
    res
      .status(400)
      .send({ status: "error", message: "Error! No se cargó el campo Stock!" });
    return false;
  }

  if (!category) {
    res.status(400).send({
      status: "error",
      message: "Error! No se cargó el campo Category!",
    });
    return false;
  }

  if (!thumbnails) {
    res.status(400).send({
      status: "error",
      message: "Error! No se cargó el campo Thumbnails!",
    });
    return false;
  } else if (!Array.isArray(thumbnails) || thumbnails.length == 0) {
    res.status(400).send({
      status: "error",
      message:
        "Error! Debe ingresar al menos una imagen en el Array Thumbnails!",
    });
    return false;
  }

  const result = await productManager.addProduct({
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  });

  if (result) {
    res.send({ status: "ok", message: "El Producto se agregó correctamente!" });
  } else {
    res.status(500).send({
      status: "error",
      message: "Error! No se pudo agregar el Producto!",
    });
  }
});

productsRouter.put("/:pid", async (req, res) => {
  let pid = req.params.pid;
  const existProduct = await productManager.getProductById(pid);

  if (!existProduct) {
    return res
      .status(404)
      .send({ status: "error", message: "Product not found!" });
  }

  if (req.body.title) {
    existProduct.title = req.body.title;
  }

  if (req.body.description) {
    existProduct.description = req.body.description;
  }

  if (req.body.code) {
    existProduct.code = req.body.code;
  }

  if (req.body.price) {
    existProduct.price = req.body.price;
  }

  if (req.body.stock) {
    existProduct.stock = req.body.stock;
  }

  if (req.body.category) {
    existProduct.category = req.body.category;
  }

  if (req.body.thumbnails) {
    existProduct.thumbnails = req.body.thumbnails;
  }

  const result = await productManager.updateProduct(pid, existProduct);

  if (result) {
    res.send({
      status: "ok",
      message: "El Producto se actualizó correctamente!",
    });
  } else {
    res.status(500).send({
      status: "error",
      message: "Error! No se pudo actualizar el Producto!",
    });
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  let pid = req.params.pid;
  const result = await productManager.deleteProduct(pid);

  if (result) {
    res.send({
      status: "ok",
      message: "El Producto se eliminó correctamente!",
    });
  } else {
    res.status(500).send({
      status: "error",
      message: "Error! No se pudo eliminar el Producto!",
    });
  }
});

export default productsRouter;
