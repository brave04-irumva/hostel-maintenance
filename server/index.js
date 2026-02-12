const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const db = require("./db");
const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const server = http.createServer(app);

// Update: Defined allowed origins for both local and production
const allowedOrigins = [
  "http://localhost:3000",
  "https://hostel-maintenance-rho.vercel.app"
];

// Update: Setup Socket.io with production origins
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  },
});

// Update: Configure Express CORS with production origins
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Middleware to pass 'io' to all routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);

// Socket.io Connection Event
io.on("connection", (socket) => {
  console.log(`⚡: A user connected (ID: ${socket.id})`);
  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
});

const PORT = process.env.PORT || 10000; // Render uses port 10000 by default
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});