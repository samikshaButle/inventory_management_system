import { InventoryDb } from "../models/InventoryModel.js";

const HandleGetInventory = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        message: "User is Unauthorized ",
      });
    }
    const AllInventory = await InventoryDb.find({ createdBy: user._id });
    return res.status(200).json({
      message: "Data fetched Successfully",
      data: AllInventory,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong, please try again later.",
      error: error.message,
    });
  }
};

const HandleAddInventory = async (req, res) => {
  const { productName, category, quantity, cost } = req.body;
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        message: "User is Unauthorized",
      });
    }

    if (
      !productName ||
      !category ||
      !quantity ||
      isNaN(quantity) ||
      !cost ||
      isNaN(cost)
    ) {
      return res.status(400).json({
        message: "Invalid Data",
      });
    }

    await InventoryDb.create({
      productName: productName,
      category: category,
      quantity: quantity,
      cost: cost,
      createdBy: user._id,
    });

    return res.status(200).json({
      message: "Inventory Added Successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
      error: error.message,
    });
  }
};

const HandleUpdateInventory = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        message: "User is Unauthorized",
      });
    }
    const { id } = req.params;
    const { productName, category, quantity, cost } = req.body;

    if (
      !productName ||
      !category ||
      !quantity ||
      isNaN(quantity) ||
      !cost ||
      isNaN(cost)
    ) {
      return res.status(400).json({
        message: "Invalid Data",
      });
    }

    const inventoryItem = await InventoryDb.findOne({
      _id: id,
      createdBy: user._id,
    });

    if (!inventoryItem) {
      return res.status(404).json({
        message:
          "Inventory item not found or you don't have permission to update it",
      });
    }

    const updatedItem = await InventoryDb.findByIdAndUpdate(id, {
      productName,
      category,
      quantity,
      cost,
    });

    return res.status(200).json({
      message: "Inventory updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};

const HandleDeleteInventory = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        message: "User is Unauthorized",
      });
    }
    const { id } = req.params;

    const inventoryItem = await InventoryDb.findOne({
      _id: id,
      createdBy: user._id,
    });

    if (!inventoryItem) {
      return res.status(404).json({
        message:
          "Inventory item not found or you don't have permission to delete itt",
      });
    }

    await InventoryDb.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Inventory item deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
};

export {
  HandleAddInventory,
  HandleDeleteInventory,
  HandleGetInventory,
  HandleUpdateInventory,
};
