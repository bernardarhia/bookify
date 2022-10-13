class BookService{
    // Create a new post
    create = async (body)=>{
        try {
         
            return {body}
        } catch (error) {
            throw new Error("Unable to create user")
        }
    }
}

module.exports = BookService;