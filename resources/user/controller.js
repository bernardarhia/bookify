import httpException from "../../utils/exceptions/httpException.js";
import { userValidationMiddleware, authenticationSchema } from "./validation.js";
import UserService from "./service.js";
import { Router } from "express";

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
      userValidationMiddleware(authenticationSchema),
      this.register
    );
    this.router.post(
      `${this.paths.LOGIN}`,
      userValidationMiddleware(authenticationSchema),
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

      res.header("Access-Control-Allow-Origin","http://localhost:3000");

      res.cookie("auth_token", "12234", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expire:36000 * Date.now()
      } ).status(200).json(token);
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };
  logout = async(req, res, next) =>{
      
  }
}

export default UserController;
