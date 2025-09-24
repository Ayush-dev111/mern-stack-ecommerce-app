import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },

    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer',
    },

    cartItems: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
            quantity: { type: Number, default: 1 },
        }
    ]

}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;