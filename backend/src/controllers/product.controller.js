import Product from '../models/product.model.js'
import {redis} from '../lib/redis.js';
import cloudinary from '../lib/cloudinary.js'


export const getAllProducts = async (_req, res) =>{
    try {
        const products = await Product.find({}); // find all products
        res.status(200).json({products});
    } catch (error) {
        console.log("error in getAllProducts controller:", error.message);
        res.status(500).json({message: "Internal server error"})
    }
};

export const getFeaturedProducts = async (_req, res) => {
    try {
        let featuredProducts = await redis.get("featured_Products");
        if(featuredProducts){
            return res.json(JSON.parse("featured_products"))
        };

        featuredProducts = await Product.find({isFeatured: true}).lean();

        if(!featuredProducts){
            return res.status(404).json({message: "No featured products found"});
        };

        await redis.set("featured_Products", JSON.stringify(featuredProducts));
    } catch (error) {
        console.log("error in getFeaturedProducts controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createProduct = async (req, res) => {
    try {
        const {productName, description, price, image, category} = req.body;

        if(!productName || !description || !price || !image || !category) {
            return res.status(400).json({message:  "All fields are required"});
        };

        let cloudinaryResponse = await cloudinary.uploader.upload(image, {folder: "products"});

        const product = await Product.create({
            productName,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse?.secure_url : "",
            category,
        })

        res.status(201).json({product,message: "Product created successfully"});

    } catch (error) {
        console.log("Error in createProduct route:", error.message);
        res.status(500).json({message: "Internal server error"});
    }
};

export const deleteProduct  = async (req, res) => {
   try {
     const userId = req.params.id;

    const product = await Product.findById(userId);

    if(!product){
        return res.status(404).json({message: "Product not found"});
    };

    if(product.image){
        const publicId = product.image.split("/").pop().split(".")[0];
        try {
            await cloudinary.uploader.destroy(`products/${publicId}`)
            console.log("deleted image from cloudinary")
        } catch (error) {
            console.log("error in deleting image from cloudinary:", error.message);
        }
    };

    await Product.findByIdAndDelete(userId);

    res.status(200).json({message: "Product deleted successfully"})
   } catch (error) {
     console.log("error in deleteProduct controller:", error.message);
      res.status(500).json({message: "Internal server error"});
   }
};

export const getRecommendedProducts = async (req, res)=> {
    try {
        const products = await Product.aggregate([
            {
                $sample: {size:3}
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: 1,
                    price: 1,
                }
            }
        ])

        res.json(products);
    } catch (error) {
      console.log("error in getRecommendedProducts:", error.message);
      res.status(500).json({message: "Internal server error"});
    }
};

export const getProductsByCategory = async (req, res) => {
    const {category} = req.params;
    try {
        const products = await Product.find({category});
        res.status(200).json(products);
    } catch (error) {
      console.log("error in getProductsByCategory controller:", error.message);
      res.status(500).json({message: "Internal server error"});
    }
};

export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(product){
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await product.save();
            await updateFeaturedProductCache();
            res.status(200).json(updatedProduct);
        }else{
            res.status(404).json({message: "Product not found"});
        }
    } catch (error) {
      console.log("error in toggleFeaturedProduct controller:", error.message);
      res.status(500).json({message: "Internal server error"});
    }
};

async function updateFeaturedProductCache() {
     try {
        const featuredProducts = await Product.find({isFeatured: true}).lean();
        await redis.set("featured_Products", JSON.stringify(featuredProducts));
     } catch (error) {
        console.log("error in updateFeaturedProductCache:", error.message);
     }
};
