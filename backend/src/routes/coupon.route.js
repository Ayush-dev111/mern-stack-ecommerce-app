import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getCoupon,
  validateCoupon,
  generateAutoCoupon,
  deleteCoupon,
} from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/", protectRoute, getCoupon);
router.post("/validate", protectRoute, validateCoupon);
router.post("/auto-generate", protectRoute, generateAutoCoupon);
router.delete("/", protectRoute, deleteCoupon);

export default router;
