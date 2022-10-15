const httpException = require("../../utils/exceptions/httpException");
const BookService = require("./service");
const { Router } = require("express");
const isAdminMiddleware = require("../../middleware/isAdminMiddleware");
const authenticatedMiddleware = require("../../middleware/authenticatedMiddleware");
const { bookValidationMiddleware, bookSchema } = require("./validation");
class BookController {
  constructor() {
    this.subRoute = "books";
    this.paths = {
      CREATE: "/create",
      GET: "/:id",
      GET_ALL: "",
      DELETE: "/delete/:id",
      DELETE_ALL: "/all",
      UPDATE: "/update/:id",
    };
    this.router = new Router();
    this.initializeRoutes();
    this.BookService = new BookService();
  }
  initializeRoutes() {
    this.router.post(
      `${this.paths.CREATE}`,
      authenticatedMiddleware,
      isAdminMiddleware,
      bookValidationMiddleware(bookSchema),
      this.createBook
    );
    this.router.get(
      `${this.paths.GET_ALL}`,
      authenticatedMiddleware,
      this.getAllBooks
    );
    this.router.get(
      `${this.paths.GET}`,
      authenticatedMiddleware,
      this.getSingleBook
    );
    this.router.delete(
      `${this.paths.DELETE}`,
      authenticatedMiddleware,
      isAdminMiddleware,
      this.deleteSingleBook
    );
    this.router.delete(
      `${this.paths.DELETE_ALL}`,
      authenticatedMiddleware,
      isAdminMiddleware,
      this.deleteAllBooks
    );
    this.router.put(
      `${this.paths.UPDATE}`,
      authenticatedMiddleware,
      isAdminMiddleware,
      bookValidationMiddleware(bookSchema),
      this.editBook
    );
  }

  // Create edit method
  createBook = async (req, res, next) => {
    try {
      const { _id: author } = req.user;
      const book = await this.BookService.createBook(req.body, author);

      res.status(200).json(book);
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };
// GET REQUESTS
  getAllBooks = async (req, res, next) => {
    try {
      const { role: userRole, _id: userId } = req.user;
      const books = await this.BookService.getAllBooks(userRole, userId);

      res.status(201).json({ books });
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };

  getSingleBook = async (req, res, next) => {
    try {
      const { id: bookId } = req.params;
      const { role: userRole, _id: userId } = req.user;
      const book = await this.BookService.getSingleBook(
        bookId,
        userRole,
        userId
      );

      res.status(201).json(book);
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };

  // DELETE REQUEST
  deleteSingleBook = async (req, res, next) => {
    try {
      const { id: bookId } = req.params;
      const {  _id: userId } = req.user;
      const books = await this.BookService.deleteSingleBook(bookId, userId);

      res.status(201).json({ books });
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };
  deleteAllBooks = async (req, res, next) => {
    try {
     
      const { _id: userId } = req.user;
      const books = await this.BookService.deleteAllBooks(userId);

      res.status(201).json({ books });
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };

  // EDIT REQUESTS
   // edit book method
   editBook = async (req, res, next) => {
    try {
      const { _id: author } = req.user;
      const {id: bookId} = req.params
      const book = await this.BookService.editBook(req.body, bookId,author);

      res.status(200).json(book);
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };
}

module.exports = BookController;
