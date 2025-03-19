import { UserDb } from "../models/Usermodel.js";
import { setSessionToken } from "../utils/AuthService.js";

const HandleUserRegister = async (req, res) => {
  const { name, email, password, address, phoneNo } = req.body;

  if (!name || !email || !password || !address || !phoneNo) {
    return res.status(400).json({
      message: "Invalid Fields. Please Complete All Fields.",
    });
  }

  try {
    const userExist = await UserDb.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        message: "User Already Exists",
      });
    }

    const newUser = await UserDb.create({
      name,
      email,
      password,
      phoneNo,
      address,
    });

    const token = setSessionToken(newUser);

    return res
      .cookie("SessionID", token, {
        httpOnly: true,
      })
      .status(201)
      .json({
        message: "User Registered and Logged In Successfully",
        data: {
          name: newUser.name,
          email: newUser.email,
        },
      });
  } catch (error) {
    console.log("Error while Registering:", error);
    return res.status(500).json({
      message: "Failed to Create User",
    });
  }
};

const HandleUserLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Invalid Credentials",
    });
  }

  try {
    const User = await UserDb.findOne({ email, password });
    if (!User) {
      return res.status(400).json({
        message: "user Dosent Exist",
      });
    }

    const token = setSessionToken(User);

    return res
      .cookie("SessionID", token)
      .status(200)
      .json({
        message: "User Login Successful",
        data: {
          name: User.name,
          email: User.email,
        },
      });
  } catch (error) {
    console.log("Error while Login : ", error);

    return res.status(500).json({
      message: "Failed To Login User ",
    });
  }
};

const HandleUserLogout = async (req, res) => {
  try {
    res.clearCookie("SessionID");
    return res.status(204).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      message: "Failed to logout user",
    });
  }
};

export { HandleUserRegister, HandleUserLogin, HandleUserLogout };
