import httpException from "../../utils/exceptions/httpException.js";
import CartService from "./service.js";
import authenticatedMiddleware from "../../middleware/authenticatedMiddleware.js";
import {
  cartSchema,
  cartValidationMiddleware,
  checkoutMiddleware,
  checkoutSchema,
} from "./validation.js";
import { Router } from "express";

class CartController {
  constructor() {
    this.subRoute = "cart";
    this.paths = {
      CREATE: "/add",
      GET: "/all",
      DELETE: "/delete/item",
      CLEAR: "/delete/all",
      CHECKOUT: "/checkout",
      CHECKOUT_ITEMS:"/checkout/all"
    };

    this.router = new Router();
    this.initializeRoutes();
    this.CartService = new CartService();
  }

  initializeRoutes() {
    this.router.post(
      `${this.paths.CREATE}`,
      authenticatedMiddleware,
      cartValidationMiddleware(cartSchema),
      this.addItemToCart
    );
    this.router.get(
      `${this.paths.GET}`,
      authenticatedMiddleware,
      this.getCartItems
    );
    this.router.delete(
      `${this.paths.DELETE}`,
      authenticatedMiddleware,
      this.removeItemFromCart
    );
    this.router.delete(
      `${this.paths.CLEAR}`,
      authenticatedMiddleware,
      this.clearCart
    );
    this.router.post(
      `${this.paths.CHECKOUT}`,
      authenticatedMiddleware,
      this.checkoutCart
    );
    this.router.get(
      `${this.paths.CHECKOUT_ITEMS}`,
      authenticatedMiddleware,
      this.getCheckoutItems
    );
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
  getCartItems = async (req, res, next) => {
    try {
      const { _id: userId } = req.user;
      const cart = await this.CartService.getCartItems(userId);

      res.status(200).json({ cart });
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };
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
  checkoutCart = async (req, res, next) => {
    try {
      const { _id: userId } = req.user;
      const checkout = await this.CartService.checkoutCart(req.body, userId);

      return res.status(200).send();

    } catch (error) {
      next(new httpException(400, error.message));
    }
  };

  getCheckoutItems = async (req, res, next) => {
    try {
      const { _id: userId } = req.user;
      const checkoutItems = await this.CartService.getCheckoutItems(userId)
      res.status(200).json( checkoutItems );
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };
}

export default CartController;
