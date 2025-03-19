import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connect } from "./connection.js";
import { UserRoute } from "./routes/UserRoutes.js";
import { SecureUserroutes } from "./routes/SecureUserRoutes.js";
import { InventortRoutes } from "./routes/InventoryRoutes.js";
import { DATABASE_URL, PORT } from "./constant.js";

const app = express();
const port = PORT || 3030;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

// Routes
app.use("/api/v1/auth", SecureUserroutes);
app.use("/api/v1/user", UserRoute);
app.use("/api/v1/inventory", InventortRoutes);

connect(DATABASE_URL).then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch((e) => {
  console.log(`DATABASE Connection error: ${e}`)
});