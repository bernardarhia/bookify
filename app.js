const express = require("express");
const dbConnect = require("./utils/dbConnection");
const compression = require("compression");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser")
// import ErrorMiddleware from "./middleware/errorMiddleware"
const ErrorMiddleware = require("./middleware/errorMiddleware");
const helmet = require("helmet");
require('dotenv').config()
class App {
  constructor(controllers, port) {
    this.express = express();
    this.port = port;

    this.initializeDatabaseConnection();
    this.initializeMiddleware();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  initializeMiddleware= () =>  {
    this.express.use(helmet());
    this.express.use(cors());
    this.express.use(morgan("dev"));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(compression());
    this.express.use(cookieParser())
  }

  initializeControllers= (controllers) =>  {
    controllers.forEach((controller) => {
      this.express.use(`/api/${controller?.subRoute}`, controller.router);
    });
  }
  initializeErrorHandling= () => {
    this.express.use(ErrorMiddleware);
  }

  initializeDatabaseConnection = async () =>  {
   dbConnect()
  }

  listen() {
    this.express.listen(this.port, () =>
      console.log(`App listening on port ${this.port}`)
    );
  }
}

module.exports = { App };
