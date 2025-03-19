import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
    enum: [
      "Electronics",
      "Furniture",
      "Clothing",
      "Groceries",
      "Toys",
      "Appliances",
      "Office Supplies",
      "Other"
    ],
  },

  quantity: {
    type: Number,
    required: true,
  },

  cost: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

const InventoryDb = mongoose.model("Inventory", InventorySchema);

export { InventoryDb };
