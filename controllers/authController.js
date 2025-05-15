import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper to exclude password
const sanitizeUser = (user) => {
    const { password, ...sanitized } = user.toObject();
    return sanitized;
};

export const signup = async (req, res, next) => {
    try {
        const { name, email, password, role, skills, company } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        const user = new User({ name, email, password, role, skills, company });
        await user.save();

        const token = jwt.sign({ user: user }, process.env.JWT_SECRET);
        res.status(201).json({ token, user: sanitizeUser(user) });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'Internal server error during signup' });
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            console.log(email, password)
            return res.status(401).json({ message: 'No fields are provided' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ user: user }, process.env.JWT_SECRET);
        res.json({ token, user: sanitizeUser(user) });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Internal server error during login' });
    }
};

// Get user profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user: sanitizeUser(user) });
    } catch (error) {
        console.error('GetProfile Error:', error);
        res.status(500).json({ message: 'Internal server error fetching profile' });
    }
};
