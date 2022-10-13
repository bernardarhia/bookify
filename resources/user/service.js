const User = require("../../models/User");

class UserService{
    // Create a new post
    create = async (username, password)=>{
        try {
            const role = "user";
            // const user = await User.create({username, password, role})
            return {username, password}
        } catch (error) {
            throw new Error("Unable to create user")
        }
    }
    login = async (username, password)=>{
        try {
            // const user = await User.findOne({username})
            return {username, password}
        } catch (error) {
            throw new Error("Unable to log in user")
        }
    }
}

module.exports = UserService;