import express from 'express';
import {protectRoute} from '../middleware/auth.middleware.js';
import { addToCart, getCartProducts, removeAllFromCart, removeFromCart, updateQuantity } from '../controllers/cart.controller.js';


const router = express.Router();

router.get('/', protectRoute, getCartProducts)
router.post('/', protectRoute, addToCart);
router.delete("/", protectRoute, removeFromCart);
router.delete("/all", protectRoute, removeAllFromCart);
router.put('/:id', protectRoute, updateQuantity);

export default router;