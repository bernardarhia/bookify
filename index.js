const { App } = require("./app");
const UserController = require("./resources/user/controller");
const BookController = require("./resources/book/controller");
const app = new App(
  [new UserController(), new BookController()],
  Number(process.env.PORT) || 5000
);
app.listen();
