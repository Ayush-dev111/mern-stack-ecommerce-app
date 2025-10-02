import { generateToken, setCookies, storeRefreshToken } from "../lib/generateToken.js";
import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "all the fields are required" });
        }

        const ifUserExists = await User.findOne({ email });

        if (ifUserExists) {
            return res.status(400).json({ message: "User already exists" });
        };

        const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailValidation.test(email)){
            return res.status(400).json({ message: "Please enter a valid email address" });
        };


        if (password.length < 6) {
            return res.status(400).json({ message: "Password should be at least 6 characters long" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword
        });

        const {accessToken, refreshToken} = generateToken(newUser._id);

        await storeRefreshToken(newUser._id, refreshToken);

        setCookies(res, accessToken, refreshToken);

        res.status(201).json({user:{
            id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            role: newUser.role
        },
        message : "user signup successful"});
        
    } catch (error) {
        console.log("error in signing up:", error);
        res.status(500).json({ message: "Internal server error" });
    };

};

export const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        if(!email || !password){
            return res.status(400).json({message: "All the fields are required"})
        };

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: "Invalid credentials"})
        };

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if(!isPasswordMatched){
            return res.status(400).json({message: "Invalid credentials"});
        }

        const {accessToken, refreshToken} = generateToken(user._id);

        await storeRefreshToken(user._id, refreshToken);

        setCookies(res, accessToken, refreshToken);

        res.json({
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role
        })
    } catch (error) {
        console.log("error in login controller:", error);
        res.status(500).json({message: "Internal server error"})
    }
};

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(refreshToken){
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
            await redis.del(`refresh_token:${decoded.userId}`);
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        res.json({message: "Logged Out successfully"});
    } catch (error) {
        console.log("Error in logout controller:", error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const refreshAccessToken = async  (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(401).json({message: "No refresh token found"});
        };

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
        const storedRefreshToken = await redis.get(`refresh_token:${decoded.userId}`);

        if(storedRefreshToken !== refreshToken){
            return res.status(401).json({message: "Invalid refresh token"});
        };

        const accessToken = jwt.sign({userId: decoded.userId}, process.env.JWT_ACCESS_TOKEN, {expiresIn: '15m'});
        res.cookie("accessToken", accessToken,{
            httpOnly: true,
            secure: process.env.Node_env === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
        });

        res.json({message: "Access token refreshed successfully"});

    } catch (error) {
        console.log("Error in refreshAccessToken controller:", error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const getProfile = async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};  