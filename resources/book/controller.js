const httpException = require("../../utils/exceptions/httpException");
const BookService = require("./service");
const { Router } = require("express");

class BookController {
  constructor() {
      this.subRoute = "books";
      this.paths ={
        CREATE:"/create"
      }
    this.router = new Router();
    this.initializeRoutes();
    this.BookService = new BookService();
  }
  initializeRoutes() {
    this.router.post(
      `${this.paths.CREATE}`,
      this.create
    );
  }

  // Create user method
  create = async (req, res, next) => {
    try {
      const book = await this.BookService.create(req.body);

      res.status(201).json({ book });
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };

}

module.exports = BookController;
