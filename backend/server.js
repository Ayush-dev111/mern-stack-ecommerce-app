import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth.routes.js';
import {connectDb} from './src/lib/database.js';
import cookieParser from 'cookie-parser';
import productRoutes from './src/routes/product.route.js';
import cartRoutes from './src/routes/cart.routes.js';
import couponRoutes from './src/routes/coupon.route.js';
import paymentRoutes from './src/routes/payment.route.js';

const app = express();
const PORT = process.env.PORT || 3500;
connectDb();
dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payments', paymentRoutes);



app.get('/', (req, res)=>{
 res.send("Api is working.");
});

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});

