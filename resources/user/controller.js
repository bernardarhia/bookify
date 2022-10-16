import httpException from "../../utils/exceptions/httpException.js";
import {
  userValidationMiddleware,
  authenticationSchema,
} from "./validation.js";
import UserService from "./service.js";
import { Router } from "express";
import User from "../../models/User.js";

class UserController {
  constructor() {
    this.subRoute = "users";
    this.paths = {
      CREATE: "/register",
      LOGIN: "/login",
      REFRESH: "/refresh",
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
    this.router.post(`${this.paths.REFRESH}`, this.refreshToken);
  }

  // register user method
  register = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const token = await this.UserService.register(username, password);

      res
        .cookie("auth_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          expire: 36000 * Date.now(),
        })
        .status(200)
        .json({ role, token });
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };

  // Login user method
  login = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const { accessToken, refreshToken, role } = await this.UserService.login(
        username,
        password
      );

      res
        .cookie("auth_token", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          expire: 36000 * Date.now(),
        })
        .status(200)
        .json({ role, accessToken });
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };
  logout = async (req, res, next) => {};

  refreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.auth_token) return res.status(401);
    const refreshToken = cookies.auth_token;

    const user = await User.findOne({ refreshToken });

    if (!user) return res.status(403);

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, payload) => {
      if (err || user.username != payload.username) return res.status(403);

      const accessToken = jwt.sign(
        {
          id: user._id,
          username: payload.username,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "100s" }
      );
      res.json({ role: user.role, accessToken });
    });
  };
}

export default UserController;
