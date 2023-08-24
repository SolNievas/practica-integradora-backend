import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import ProductManager from "./dao/ProductManager.js";
import ChatManager from "./dao/ChatManager.js";
import mongoose from "mongoose";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log("Servidor Activo en el puerto: http://localhost:" + PORT);
});

const socketServer = new Server(httpServer);
const productManager = new ProductManager();
const chatManager = new ChatManager();

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartsRouter);
app.use("/", viewsRouter);

mongoose.connect(
  "mongodb+srv://SolNievas:solnievas70@codecluster.zri7lyk.mongodb.net/ecommerce?retryWrites=true&w=majority"
);

socketServer.on("connection", (socket) => {
  console.log("Nueva Conexión!");

  const products = productManager.getProducts();
  socket.emit("realTimeProducts", products);

  socket.on("nuevoProducto", (data) => {
    const product = {
      title: data.title,
      description: "",
      code: "",
      price: data.price,
      status: "",
      stock: 10,
      category: "",
      thumbnails: data.thumbnails,
    };
    productManager.addProduct(product);
    const products = productManager.getProducts();
    socket.emit("realTimeProducts", products);
  });

  socket.on("eliminarProducto", (data) => {
    productManager.deleteProduct(parseInt(data));
    const products = productManager.getProducts();
    socket.emit("realTimeProducts", products);
  });

  socket.on("newMessage", async (data) => {
    chatManager.createMessage(data);
    const messages = await chatManager.getMessages();
    socket.emit("messages", messages);
  });
});
