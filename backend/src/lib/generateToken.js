import jwt from "jsonwebtoken";
import { redis } from "./redis.js";


export const generateToken = (userId) => {
    try {
        const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_TOKEN, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_TOKEN, { expiresIn: '7d' });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error('Error generating tokens: ' + error.message);
    }
};

export const storeRefreshToken = async (userId, refreshToken) => {
    try {
        await redis.set(`refresh_token:${userId}`, refreshToken, 'EX', 7 * 24 * 60 * 60); //7 days
    } catch (error) {
        throw new Error('Error storing refresh token: ' + error.message);
    }
}

export const setCookies = (res, accessToken, refreshToken) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
};