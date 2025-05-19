import express from 'express';
import "dotenv/config";
import cookieParser from "cookie-parser"

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';

import { connectDB } from './lib/db.js';

import cors from 'cors';

const app = express()
const PORT=process.env.PORT || 5001


app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    methods:["GET","POST","PUT","DELETE"]
}))

app.use(express.json())
app.use(cookieParser())


app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/chats",chatRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB()
})