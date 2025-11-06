import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import { stripe } from "../lib/stripe.js";

// ---------------- CREATE CHECKOUT SESSION ----------------
export const createCheckoutSession = async (req, res) => {
	try {
		const { products, couponCode } = req.body;

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		let totalAmount = 0;

		const lineItems = products.map((product) => {
			const amount = Math.round(product.price * 100); // stripe wants cents
			totalAmount += amount * product.quantity;

			return {
				price_data: {
					currency: "usd",
					product_data: {
						name: product.productName || "Unnamed Product",
						images: [product.image],
					},
					unit_amount: amount,
				},
				quantity: product.quantity || 1,
			};
		});

		let coupon = null;
		if (couponCode) {
			coupon = await Coupon.findOne({
				code: couponCode,
				userId: req.user._id,
				isActive: true,
			});
			if (coupon) {
				totalAmount -= Math.round(
					(totalAmount * coupon.discountPercentage) / 100
				);
			}
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
			discounts: coupon
				? [
						{
							coupon: await createStripeCoupon(coupon.discountPercentage),
						},
				  ]
				: [],
			metadata: {
				userId: req.user._id.toString(),
				couponCode: couponCode || "",
				products: JSON.stringify(
					products.map((p) => ({
						id: p._id,
						quantity: p.quantity,
						price: p.price,
					}))
				),
			},
		});

		if (totalAmount >= 20000) {
			await createNewCoupon(req.user._id);
		}

		res.status(200).json({
			url: session.url,
			totalAmount: totalAmount / 100,
		});
	} catch (error) {
		console.error("Error processing checkout:", error);
		res.status(500).json({
			message: "Error processing checkout",
			error: error.message,
		});
	}
};

// ---------------- CHECKOUT SUCCESS (FIXED) ----------------
export const checkoutSuccess = async (req, res) => {
	try {
		const { sessionId } = req.body;
		if (!sessionId) {
			return res.status(400).json({ error: "Missing sessionId" });
		}

		console.log("✅ Checkout Success hit:", sessionId);

		const session = await stripe.checkout.sessions.retrieve(sessionId, {
			expand: ["line_items.data.price.product"],
		});
		const metadata = session.metadata || {};
		console.log("🧾 Session metadata:", metadata);

		const products = JSON.parse(metadata.products || "[]");

		// ✅ Atomically upsert order to prevent duplicates
		const order = await Order.findOneAndUpdate(
			{ stripeSessionId: session.id },
			{
				$setOnInsert: {
					user: metadata.userId,
					products: products.map((p) => ({
						product: p.id,
						quantity: p.quantity,
						price: p.price,
					})),
					stripeSessionId: session.id,
					totalAmount: session.amount_total / 100,
					paymentStatus: session.payment_status,
					couponCode: metadata.couponCode || null,
				},
			},
			{ new: true, upsert: true }
		);

		console.log("✅ Order processed:", order._id);

		res.status(200).json({
			success: true,
			message: "Order processed successfully",
			order,
		});
	} catch (error) {
		console.error("❌ Error in checkoutSuccess:", error);
		res.status(500).json({
			success: false,
			message: "Error processing order",
			error: error.message,
		});
	}
};

// ---------------- HELPERS ----------------
async function createStripeCoupon(discountPercentage) {
	const coupon = await stripe.coupons.create({
		percent_off: discountPercentage,
		duration: "once",
	});
	return coupon.id;
}

async function createNewCoupon(userId) {
	await Coupon.findOneAndDelete({ userId });

	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 10,
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
		userId,
	});

	await newCoupon.save();
	return newCoupon;
}
