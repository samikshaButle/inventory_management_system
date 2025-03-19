import { Router } from "express";
import {
  HandleUserRegister,
  HandleUserLogin,
  HandleUserLogout,
} from "../controller/UserControl.js";
import { VerifyCookie } from "../middlewares/UserAuth.js";

const UserRoute = Router();

UserRoute.post("/register", HandleUserRegister);
UserRoute.post("/login", HandleUserLogin);
UserRoute.post("/logout", VerifyCookie, HandleUserLogout);

export { UserRoute };
