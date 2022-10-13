const { App } = require("./app");
const UserController = require("./resources/user/controller");
const app = new App([new UserController()], Number(process.env.PORT) || 5000);
app.listen();
