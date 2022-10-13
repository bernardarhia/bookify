const express =  require("express")
const mongoose =  require("mongoose")
const compression =  require("compression")
const cors =  require("cors")
const morgan =  require("morgan")
// import ErrorMiddleware from "./middleware/errorMiddleware"
const ErrorMiddleware  = require("./middleware/errorMiddleware")
const helmet = require("helmet")
class App{

    constructor(controllers, port){
        this.express = express()
        this.port = port

        this.initializeDatabaseConnection();
        this.initializeMiddleware();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }
    
    initializeMiddleware(){
            this.express.use(helmet())
            this.express.use(cors())
            this.express.use(morgan("dev"))
            this.express.use(express.json())
            this.express.use(express.urlencoded({extended:false}))
            this.express.use(compression())
    }

    initializeControllers(controllers){
        controllers.forEach((controller)=>{
            this.express.use("/api", controller.router);
        })
    }
    initializeErrorHandling(){
        this.express.use(ErrorMiddleware)
    }

    initializeDatabaseConnection(){
        // const {MONGO_USER, MONGO_PASSWORD,MONGO_PATH} = process.env
        // mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`)
        mongoose.connect(`mongodb://localhost:27017`)
    }

    listen(){
        this.express.listen(this.port, ()=> console.log(`App listening on port ${this.port}`))
    }
}

module.exports = {App};