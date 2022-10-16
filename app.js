const express = require("express");
const dbConnect = require("./utils/dbConnection");
const compression = require("compression");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const ErrorMiddleware = require("./middleware/errorMiddleware");
const helmet = require("helmet");
const credentials = require("./config/credentials")
const corsOptions = require("./config/corsOptions")
require("dotenv").config();

class App {
  constructor(controllers, port) {
    this.express = express();
    this.port = port;

    this.initializeDatabaseConnection();
    this.initializeMiddleware();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  initializeMiddleware = () => {
    this.express.use(helmet());
    this.express.use(cors());
    this.express.use(morgan("dev"));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(compression());
    this.express.use(cookieParser());

    // Handle options credentials check - before CORS!
    // and fetch cookies credentials requirement
    this.express.use(credentials);

    // Cross Origin Resource Sharing
    this.express.use(cors(corsOptions));
  };

  initializeControllers = (controllers) => {
    controllers.forEach((controller) => {
      this.express.use(`/api/${controller?.subRoute}`, controller.router);
    });
  };
  initializeErrorHandling = () => {
    this.express.use(ErrorMiddleware);
  };

  initializeDatabaseConnection = async () => {
    dbConnect();
  };

  listen() {
    this.express.listen(this.port, () =>
      console.log(`App listening on port ${this.port}`)
    );
  }
}

module.exports = { App };
