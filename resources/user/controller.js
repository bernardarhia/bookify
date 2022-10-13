const User = require("../../models/User");
const httpException = require("../../utils/exceptions/httpException");
const validationMiddleware = "../../middleware/validationMiddleware";
const validate = require("./validation");
const UserService = require("./service");
const { Router } = require("express");

class UserController {
  constructor() {
    this.path = "/users";
    this.router = new Router();
    this.initializeRoutes();
    this.UserService = new UserService();
  }
  initializeRoutes() {
    this.router.post(
      `${this.path}`,
      validationMiddleware(validate.create),
      this.create
    );
  }

  create = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await this.UserService.create(username, password);

      res.status(201).json({ user });
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };
}

module.exports = UserController;
