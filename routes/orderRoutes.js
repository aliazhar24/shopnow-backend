import express from "express";
import protect from "../middleware/authMiddleware.js";
import isAdmin from  "../middleware/adminMiddleware.js"
import {
  placeOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
  cancelOrder
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/my", protect, getMyOrders);
router.get("/", protect, isAdmin, getAllOrders);
router.put("/:id", protect, isAdmin, updateOrderStatus);
router.put("/cancel/:id", protect, cancelOrder);

export default router;


