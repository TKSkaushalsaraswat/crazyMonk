import express from "express";
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getAllOrders,
  updateOrderToDelivered,
  // checkoutSession,
} from "../controllers/orderController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router
  .route("/")
  .post(protect, addOrderItems)
  .get(protect, admin, getAllOrders);
router.route("/myorders").get(protect, getMyOrders);
// router.route("/checkout").post(checkoutSession);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

export default router;
