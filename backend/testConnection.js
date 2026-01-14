import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing MongoDB connection...');
console.log('URI:', process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 30) + '...' : 'NOT SET');

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB Connected Successfully!');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Connection Failed:', err.message);
        process.exit(1);
    });
