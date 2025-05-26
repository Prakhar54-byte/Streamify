import express from 'express';
import "dotenv/config";
import cookieParser from "cookie-parser"
import session from 'express-session';
import csurf from 'csurf';
import lusca from 'lusca';

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';

import { connectDB } from './lib/db.js';

import cors from 'cors';

const app = express()

app.use(lusca.csrf())

app.disable('x-powered-by');// Disable the 'X-Powered-By' header for security reasons

import helmet from 'helmet';
app.use(helmet()); // Use Helmet to set various HTTP headers for security   
const PORT=process.env.PORT || 5001


app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
        sameSite: 'strict', // Prevent CSRF attacks
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}))

app.use(csurf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict', // Prevent CSRF attacks
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}))

app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  // CSRF token errors
  res.status(403).json({ error: 'Invalid CSRF token' });
});



app.use(cors({
    origin:"http://localhost:5173" || "http://localhost:5174",
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