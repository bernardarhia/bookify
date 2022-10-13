const User = require("../../models/User");

class UserService{
    // Create a new post
    create = async (username, password)=>{
        try {
            const user = await User.create({username, password})
            return user
        } catch (error) {
            throw new Error("Unable to create user")
        }
    }
}

module.exports = UserService;