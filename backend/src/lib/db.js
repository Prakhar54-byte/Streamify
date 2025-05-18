import express from 'express';
import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
    const connections =     await mongoose.connect(process.env.MONGODB_URI)
    console.log(    `MongoDB connected : ${connections.connection.host} `);
    } catch (error) {
        console.log(`MongoDB connection error: ${error.message}`);
        process.exit(1);
        
    }
}