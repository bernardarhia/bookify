const User = require("../../models/User");
const httpException = require("../../utils/exceptions/httpException");
const validationMiddleware = require("../../middleware/validationMiddleware");
const { authenticationSchema } = require("./validation");
const UserService = require("./service");
const { Router } = require("express");

class UserController {
  constructor() {
    this.subRoute = "users";
    this.paths = {
      CREATE: "/register",
      LOGIN: "/login",
    };
    this.router = new Router();
    this.initializeRoutes();
    this.UserService = new UserService();
  }
  initializeRoutes() {
    this.router.post(
      `${this.paths.CREATE}`,
      validationMiddleware(authenticationSchema),
      this.register
    );
    this.router.post(
      `${this.paths.LOGIN}`,
      validationMiddleware(authenticationSchema),
      this.login
    );
  }

  // register user method
  register = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const token = await this.UserService.register(username, password);

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
       expire:36000 * Date.now()
      } ).status(200).json({ token });
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };

  // Login user method
  login = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const token = await this.UserService.login(username, password);

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: "1d"
      } ).status(200).json({ token });
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };
  logout = async(req, res, next) =>{
      
  }
}

module.exports = UserController;
