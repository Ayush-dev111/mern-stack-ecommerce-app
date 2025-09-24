import { generateToken, setCookies, storeRefreshToken } from "../lib/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';

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
        },
        message : "user signup successful"});
        
    } catch (error) {
        console.log("error in signing up:", error);
        res.status(500).json({ message: "Internal server error" });
    };

};



export const login = async () => {

};
export const logout = async () => {

};
