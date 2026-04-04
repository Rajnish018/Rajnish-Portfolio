import mongoose from 'mongoose';
import { ENV } from './env';

const { MONGO_URI } = ENV;  

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
