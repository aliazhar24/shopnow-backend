import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  changeItemSize
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.put("/size", protect, changeItemSize);
router.put("/", protect, updateCartItem);
router.delete("/:productId/:size", protect, removeFromCart);

export default router;
