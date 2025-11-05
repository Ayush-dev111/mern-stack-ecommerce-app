import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";

const ProductCard = ({ product }) => {

	const {user} = useAuthStore();
	const {addToCart} = useCartStore();

	const handleAddToCart = () => {
		if(!user){
			toast.error("Please log in to add items to your cart");
			return;
		}else{
			addToCart(product)
		}
		toast.success(`${product.productName} added to cart`);
	};

	return (
		<div className='flex w-full flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg bg-gray-900'>
			<div className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl bg-gray-800'>
				<img
					className='object-cover w-full h-full'
					src={product.image}
					alt={product.productName}
				/>
				{/* Optional subtle overlay */}
				<div className='absolute inset-0 bg-black/10 pointer-events-none' />
			</div>

			<div className='mt-4 px-5 pb-5'>
				<h5 className='text-xl font-semibold tracking-tight text-white'>
					{product.productName}
				</h5>
				<div className='mt-2 mb-5 flex items-center justify-between'>
					<span className='text-3xl font-bold text-blue-400'>
						${product.price}
					</span>
				</div>
				<button
					className='flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium
					 text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300'
					onClick={handleAddToCart}
				>
					<ShoppingCart size={22} className='mr-2' />
					Add to cart
				</button>
			</div>
		</div>
	);
};

export default ProductCard;
