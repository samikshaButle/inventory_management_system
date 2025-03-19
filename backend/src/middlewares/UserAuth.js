import { getUserFromToken } from "../utils/AuthService.js";

const VerifyCookie = (req, res, next) => {
  try {
    const sessionID = req.cookies.SessionID;

    if (!sessionID) {
      return res.status(401).json({
        message: "No USer Exist",
      });
    }

    const user = getUserFromToken(sessionID);

    if (!user) {
      return res.status(401).json({
        message: "No User Exist",
      });
    }
    req.user = user;
  } catch (error) {
    console.log(error);
  }

  next();
};

export { VerifyCookie };
