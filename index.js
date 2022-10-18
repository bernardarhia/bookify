import { App } from "./app.js";
import UserController from "./resources/user/controller.js";
import BookController from "./resources/book/controller.js";
import CartController from "./resources/cart/controller.js";

const app = new App(
  [new UserController(), new BookController(), new CartController()],
  Number(process.env.PORT) || 5000
);
app.listen();
