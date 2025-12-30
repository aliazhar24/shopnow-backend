import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getAddresses,
  addAddress,
  deleteAddress,
  updateAddress
} from "../controllers/addressController.js";

const router = express.Router();

router.get("/", protect, getAddresses);
router.post("/", protect, addAddress);
router.put("/:id", protect, updateAddress)
router.delete("/:id", protect, deleteAddress);

export default router;

