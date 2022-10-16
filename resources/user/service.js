const User = require("../../models/User");
const { createToken } = require("../../utils/token");

class UserService {
  // Create a new post
  register = async (username, password) => {
    try {
      const role = "user";
      const user = await User.create({ username, password, role });

      const accessToken = createToken(user);
      return accessToken;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  login = async (username, password) => {
    try {
      //   check if user exists
      const user = await User.findOne({ username });
      if (!user) throw new Error("wrong username/password combination");

      //   validate the encrypted password again the textual password enter by the user
      if (await user.isValidPassword(password)) return {token: createToken(user), user};
      throw new Error("wrong username/password combination");
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

module.exports = UserService;
