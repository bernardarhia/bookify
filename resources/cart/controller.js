const httpException = require("../../utils/exceptions/httpException");
const CartService = require("./service");
const authenticatedMiddleware = require("../../middleware/authenticatedMiddleware");
const {cartSchema, cartValidationMiddleware} = require("./validation")
const { Router } = require("express");

class CartController {
  constructor() {
    this.subRoute = "cart";
    this.paths = {
      CREATE: "/add",
      GET:"/all",
      DELETE:"/delete/item",
      CLEAR:"/delete/all"
    };

    this.router = new Router();
    this.initializeRoutes();
    this.CartService = new CartService();
  }

  initializeRoutes() {
    this.router.post(`${this.paths.CREATE}`,authenticatedMiddleware, cartValidationMiddleware(cartSchema), this.addItemToCart);
    this.router.get(`${this.paths.GET}`,authenticatedMiddleware, this.getCartItems);
    this.router.delete(`${this.paths.DELETE}`,authenticatedMiddleware, this.removeItemFromCart);
    this.router.delete(`${this.paths.CLEAR}`,authenticatedMiddleware, this.clearCart);
  }

  /*
   TODO Create cart addition route method
   TODO Create route to fetch cart items
   TODO Create route to delete item in the cart
   TODO Create route to delete all items in a cart */
  addItemToCart = async (req, res, next) => {
    try {
      const { _id: userId } = req.user;
      const cart = await this.CartService.addItemToCart(req.body, userId);

      res.status(201).json({ cart });
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };
  getCartItems = async(req, res, next) =>{
    try {
      const { _id: userId } = req.user;
      const cart = await this.CartService.getCartItems(userId);

      res.status(200).json({ cart });
    } catch (error) {
      next(new httpException(400, error.message));
    }
  }
  removeItemFromCart = async (req, res, next) => {
    try {
      const { cartId } = req.body;
      const { _id: userId } = req.user;

      const cart = await this.CartService.removeItemFromCart(cartId, userId);
      res.status(200).json({ cart });
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };
  clearCart = async (req, res, next) => {
    try {
      const { _id: userId } = req.user;
      const cart = await this.CartService.clearCart(userId);

      res.status(200).json({ cart });
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };
  checkOutCart = async (req, res, next) => {
    try {
      // return { body };
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };
}

module.exports = CartController;
