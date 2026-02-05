import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.UPSTASH_URL) {
  console.error("UPSTASH_URL is not defined in environment variables");
}

export const redis = new Redis(process.env.UPSTASH_URL);

redis.on("error", (err) => {
  console.error("Redis connection error:", err.message);
});

redis.on("connect", () => {
  console.log("Redis connected successfully");
});
