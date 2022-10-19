import multer from "multer"

const upload = multer({
    dest:"images",
    limits:{
        fileSize:100000
    },
    fileFilter(req, file, cb){

        if(file.originalname.match("/\.(jpg|jpeg|png)$/")){
            return cb(new Error("Invalid file uploaded"))
        }
        cb(undefined, true)
    }
})

export default upload;