import Book  from "../../models/Book.js";

class BookService {
  // Create a new book
  createBook = async (body, author) => {
    const { title, quantity, price, description } = body;
    const bookExists = await Book.findOne({ title: this.title, author });
    
    if(bookExists)throw new Error("Book already exists") 
    const book = await Book.create({
      title,
      quantity,
      price,
      description,
      author,
    });
    try {
      return book;
    } catch (error) {
      throw new Error("Unable to create book");
    }
  };
  getAllBooks = async (userRole, userId) => {
    let books = null;
    if (userRole == "user") {
      books = await Book.find().populate("author", "username -_id").select("-__v");
    } else {
      books = await Book.find({ author: userId }).select("-author").exec();
    }
    try {
      return books;
    } catch (error) {
      throw new Error("Books not found");
    }
  };
  getSingleBook = async (bookId, userRole, userId) => {
    let book = null;
    if (userRole == "user") {
      book = await Book.findById(bookId);
    } else {
      book = await Book.findOne({ _id: bookId, author: userId })
        .select("-author")
        .exec();
    }
    try {
      return book;
    } catch (error) {
      throw new Error("Unable to delete book");
    }
  };
  deleteSingleBook = async (bookId, userId) => {
    try {
      await Book.findOneAndDelete({ _id: bookId, author: userId });
      const books = await Book.find({ author: userId });
      return books;
    } catch (error) {
      throw new Error("Book not found");
    }
  };
  deleteAllBooks = async (userId) => {
    try {
      await Book.deleteMany({ author: userId });
      return await Book.find({author:userId});
    } catch (error) {
      throw new Error("Unable to delete books");
    }
  };


  editBook = async (body,bookId, author) => {
    const { title, quantity, price, description } = body;
    const book = await Book.findOneAndUpdate({
      _id: bookId,
      author
    },{
      title,
      quantity,
      price,
      description,
      author,
    }, {
      new:true
    }).select("-author").exec();
    try {
      return book;
    } catch (error) {
      throw new Error("Unable to edit book");
    }
  };

  searchBook = async (query) => {
    try {
      const queryStrings = query.split(" ")
      let allQueries =[]
      queryStrings.forEach(element => {
          allQueries.push({title : {$regex : String(element), $options : "i"}})
      });
   
      const allBooks = await Book.find({ $or : allQueries})

return allBooks;
    } catch (error) {
      throw new Error(error);
    }
  };
}
export default BookService;
