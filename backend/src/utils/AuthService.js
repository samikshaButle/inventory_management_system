import jwt from "jsonwebtoken";
import { JWT_SECRETE } from "../constant.js";

const secretkey = JWT_SECRETE;

const setSessionToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
    },
    secretkey
  );
};

const getUserFromToken = (token) => {
  if (!token) {
    return null;
  }

  return jwt.verify(token, secretkey);
};

export { setSessionToken, getUserFromToken };
