import express from "express";
import dbConnect from "./utils/dbConnection.js";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import ErrorMiddleware from "./middleware/errorMiddleware.js";
import helmet from "helmet";
import credentials from "./config/credentials.js"
import corsOptions from "./config/corsOptions.js"
import dotenv from "dotenv"
dotenv.config()

export class App {
  constructor(controllers, port) {
    this.express = express();
    this.port = port;

    this.initializeDatabaseConnection();
    this.initializeMiddleware();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();

        // Handle options credentials check - before CORS!
    // and fetch cookies credentials requirement
    
    this.express.use(credentials);
    // Cross Origin Resource Sharing
    this.express.use(cors(corsOptions));
  }

  initializeMiddleware = () => {
    this.express.use(helmet());
    this.express.use(cors());
    this.express.use(morgan("dev"));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(compression());
    this.express.use(cookieParser());


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
