const httpException = require("../../utils/exceptions/httpException");
const CartService = require("./service");
const { Router } = require("express");

class CartController {
  constructor() {
    this.subRoute = "cart";
    this.paths = {
      CREATE: "/create",
    };

    this.router = new Router();
    this.initializeRoutes();
    this.CartService = new CartService();
  }

  initializeRoutes() {
    this.router.post(`${this.paths.CREATE}`);
  }

  /*
   TODO Create cart addition route method
   TODO Create route to fetch cart items
   TODO Create route to delete item in the cart
   TODO Create route to delete all items in a cart */
}

module.exports = CartController;
