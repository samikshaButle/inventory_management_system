import { Router } from "express";
import { VerifyCookie } from "../middlewares/UserAuth.js";

const SecureUserroutes = Router();

SecureUserroutes.get("/secure/user", VerifyCookie, (req, res) => {
  const user = req.user;

  if (user) {
    res.status(202).json({
      message: "User is authenticated",
      user: user,
    });
  } else {
    res.status(401).json({
      error: "User not authenticated",
    });
  }
});

export { SecureUserroutes };
