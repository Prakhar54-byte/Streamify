import express from 'express';
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';

import { connectDB } from './lib/db.js';
import { connectRedis, subscribeToChannel } from './lib/redis.js';
import { setUserOnline, setUserOffline } from './lib/presence.js';

const app = express();

// ── Security ────────────────────────────────────────────
app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: false, // Allow Stream SDK to load external resources
  crossOriginEmbedderPolicy: false,
}));

// ── CORS ────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:80",
  "http://localhost",
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // In dev, allow all origins
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// ── Middleware ───────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());

// ── Health Check (for load balancer) ────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ── SSE: Server-Sent Events for real-time updates ───────
const sseClients = new Map(); // userId -> Set of response objects

app.get('/api/events', (req, res) => {
  // SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no', // Disable Nginx buffering for SSE
  });
  res.write('\n');

  // Extract userId from query (set by frontend after auth)
  const userId = req.query.userId;
  if (userId) {
    if (!sseClients.has(userId)) {
      sseClients.set(userId, new Set());
    }
    sseClients.get(userId).add(res);

    // Mark user online
    setUserOnline(userId);

    req.on('close', () => {
      sseClients.get(userId)?.delete(res);
      if (sseClients.get(userId)?.size === 0) {
        sseClients.delete(userId);
      }
      setUserOffline(userId);
    });
  }
});

// Broadcast event to a specific user via SSE
export const sendSSEEvent = (userId, event, data) => {
  const clients = sseClients.get(userId);
  if (clients) {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    clients.forEach(res => res.write(payload));
  }
};

// ── Routes ──────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);

// ── Error Handler ───────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// ── Start Server ────────────────────────────────────────
const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  await connectDB();
  await connectRedis();

  // Subscribe to Redis presence events and broadcast via SSE
  await subscribeToChannel('presence_events', (data) => {
    // Broadcast to all connected SSE clients
    sseClients.forEach((clients, userId) => {
      const payload = `event: presence\ndata: ${JSON.stringify(data)}\n\n`;
      clients.forEach(res => res.write(payload));
    });
  });

  // Subscribe to friend request events
  await subscribeToChannel('friend_request_events', (data) => {
    const { targetUserId, ...eventData } = data;
    if (targetUserId) {
      sendSSEEvent(targetUserId, 'friend_request', eventData);
    }
  });
});

export default app;