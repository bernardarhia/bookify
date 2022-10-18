import User from "../../models/User.js";
import { createRefreshToken, createToken } from "../../utils/token.js";

class UserService {
  // Create a new post
  register = async (username, password) => {
    try {
      const role = "user";
      const user = await User.create({ username, password, role });

      const accessToken = createToken(user);
      const refreshToken = createRefreshToken(user)
      
      await User.findOneAndUpdate({username}, {refreshToken})
      
      return {accessToken, refreshToken, role:user.role, username:user.username}
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
      if (await user.isValidPassword(password)) {

        const accessToken = createToken(user);
        const refreshToken = createRefreshToken(user)

        await User.findOneAndUpdate({username}, {refreshToken})

        return {accessToken, refreshToken, role:user.role, username:user.username}
      };
      throw new Error("wrong username/password combination");
    } catch (error) {
      throw new Error(error.message);
    }

  };
}

export default UserService;
