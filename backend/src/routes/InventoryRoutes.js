import { Router } from "express";
import { VerifyCookie } from "../middlewares/UserAuth.js";
import {
  HandleGetInventory,
  HandleAddInventory,
  HandleUpdateInventory,
  HandleDeleteInventory,
} from "../controller/InventoryControl.js";

const InventortRoutes = Router();

InventortRoutes.get("/getInventory", VerifyCookie, HandleGetInventory);
InventortRoutes.post("/postInventory", VerifyCookie, HandleAddInventory);
InventortRoutes.put(
  "/updateInventory/:id",
  VerifyCookie,
  HandleUpdateInventory
);
InventortRoutes.delete(
  "/deleteInventory/:id",
  VerifyCookie,
  HandleDeleteInventory
);

export { InventortRoutes };
