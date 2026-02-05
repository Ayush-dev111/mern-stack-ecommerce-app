# 🚀 Deployment Guide - MERN E-commerce App

This guide will help you deploy your MERN e-commerce application using free hosting services.

---

## 📋 Prerequisites

Before deploying, make sure you have:

- A GitHub account (to push your code)
- Your project pushed to a GitHub repository

---

## 🗄️ Step 1: Set Up MongoDB Atlas (Free Database)

1. **Go to** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Sign up** for a free account
3. **Create a new cluster**:
   - Choose "FREE" tier (M0 Sandbox)
   - Select a region close to you
   - Click "Create Cluster"
4. **Set up database access**:
   - Go to "Database Access" → "Add New Database User"
   - Create a username and password (save these!)
   - Give "Read and write to any database" permission
5. **Set up network access**:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
6. **Get your connection string**:
   - Go to "Clusters" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `myFirstDatabase` with `ecommerce`

Example:

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
```

---

## 🔴 Step 2: Set Up Upstash Redis (Free Redis)

1. **Go to** [Upstash](https://upstash.com/)
2. **Sign up** for a free account
3. **Create a new Redis database**:
   - Click "Create Database"
   - Choose a name (e.g., "ecommerce-redis")
   - Select a region close to you
   - Choose "Free" tier
4. **Get your Redis URL**:
   - Go to your database details
   - Copy the "UPSTASH_REDIS_REST_URL" or the connection string
   - It should look like: `rediss://default:xxxxx@xxxxx.upstash.io:6379`

---

## 🖥️ Step 3: Deploy Backend on Render

1. **Go to** [Render](https://render.com/)
2. **Sign up** with your GitHub account
3. **Create a new Web Service**:
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select your repository
4. **Configure the service**:
   - **Name**: `mern-ecommerce-api` (or any name)
   - **Region**: Choose closest to you
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. **Add Environment Variables**:
   Click "Environment" and add these variables:

   | Key                     | Value                                             |
   | ----------------------- | ------------------------------------------------- |
   | `NODE_ENV`              | `production`                                      |
   | `PORT`                  | `3500`                                            |
   | `MONGO_URI`             | Your MongoDB Atlas connection string              |
   | `UPSTASH_URL`           | Your Upstash Redis URL                            |
   | `JWT_ACCESS_TOKEN`      | A random secret string (use a password generator) |
   | `JWT_REFRESH_TOKEN`     | Another random secret string                      |
   | `CLIENT_URL`            | Your frontend URL (add after deploying frontend)  |
   | `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name                        |
   | `CLOUDINARY_API_KEY`    | Your Cloudinary API key                           |
   | `CLOUDINARY_API_SECRET` | Your Cloudinary API secret                        |
   | `STRIPE_SECRET_KEY`     | Your Stripe secret key                            |

6. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment (takes 2-5 minutes)
   - Copy your backend URL (e.g., `https://mern-ecommerce-api.onrender.com`)

---

## 🌐 Step 4: Deploy Frontend on Vercel

1. **Go to** [Vercel](https://vercel.com/)
2. **Sign up** with your GitHub account
3. **Import your project**:
   - Click "Add New" → "Project"
   - Import your GitHub repository
4. **Configure the project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Add Environment Variables**:
   Click "Environment Variables" and add:

   | Key                           | Value                                                                         |
   | ----------------------------- | ----------------------------------------------------------------------------- |
   | `VITE_API_URL`                | Your Render backend URL (e.g., `https://mern-ecommerce-api.onrender.com/api`) |
   | `VITE_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key                                                   |

6. **Deploy**:
   - Click "Deploy"
   - Wait for deployment (takes 1-2 minutes)
   - Copy your frontend URL (e.g., `https://mern-ecommerce.vercel.app`)

---

## 🔄 Step 5: Update Backend with Frontend URL

1. Go back to **Render Dashboard**
2. Open your backend service
3. Go to "Environment" → Edit `CLIENT_URL`
4. Set it to your Vercel frontend URL (e.g., `https://mern-ecommerce.vercel.app`)
5. Click "Save Changes" (this will redeploy automatically)

---

## ✅ Step 6: Test Your Deployment

1. Visit your frontend URL
2. Try to sign up a new account
3. Browse products, add to cart, etc.
4. Test the checkout process (use Stripe test cards)

### Stripe Test Card:

- **Card Number**: `4242 4242 4242 4242`
- **Expiry**: Any future date
- **CVC**: Any 3 digits

---

## 🔧 Troubleshooting

### Backend not starting?

- Check Render logs for errors
- Verify all environment variables are set correctly
- Make sure MongoDB Atlas allows access from anywhere (0.0.0.0/0)

### CORS errors?

- Ensure `CLIENT_URL` in backend matches your Vercel URL exactly
- Don't include trailing slash in URLs

### Database connection failed?

- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0)
- Verify connection string format
- Make sure password doesn't contain special characters that need encoding

### Redis connection failed?

- Verify Upstash URL is correct
- Check if using `rediss://` (with double s) for TLS

---

## 📱 Free Tier Limitations

| Service           | Limitation                                              |
| ----------------- | ------------------------------------------------------- |
| **Render**        | Spins down after 15min of inactivity (slow cold starts) |
| **Vercel**        | 100GB bandwidth/month                                   |
| **MongoDB Atlas** | 512MB storage                                           |
| **Upstash**       | 10,000 commands/day                                     |

---

## 🎉 Done!

Your MERN e-commerce app is now live! Share your Vercel URL with others.

### Your URLs:

- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-api.onrender.com`
