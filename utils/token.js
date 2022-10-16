import jwt from "jsonwebtoken"

const createToken = (user) => {
  return jwt.sign({ id: user._id, name:user.username}, process.env.JWT_SECRET, {
    expiresIn: "100s",
  });
};
const createRefreshToken = (user) => {
  return jwt.sign({ id: user._id, name:user.username}, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "1d",
  });
};

const verifyToken = (token) => {

  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) return reject(err);

      resolve(payload);

    });
  });
};

export {createToken, verifyToken, createRefreshToken}