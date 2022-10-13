const User = require("../../models/User");
const httpException = require("../../utils/exceptions/httpException");
const validationMiddleware = require("../../middleware/validationMiddleware");
const {authenticationSchema} = require("./validation");
const UserService = require("./service");
const { Router } = require("express");

class UserController {
  constructor() {
      this.subRoute = "users";
      this.paths ={
        CREATE:"/create",
        LOGIN:"/login"
      }
    this.router = new Router();
    this.initializeRoutes();
    this.UserService = new UserService();
  }
  initializeRoutes() {
    this.router.post(
      `${this.paths.CREATE}`,
      validationMiddleware(authenticationSchema),
      this.create
    );
    this.router.post(
      `${this.paths.LOGIN}`,
      validationMiddleware(authenticationSchema),
      this.login
    );
  }

  // Create user method
  create = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await this.UserService.create(username, password);

      res.status(201).json({ user });
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };

  // Login user method
  login = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await this.UserService.login(username);

      res.status(201).json({ user });
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };
}

module.exports = UserController;
