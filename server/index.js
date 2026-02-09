const express = require("express");
const cors = require("cors");
const http = require("http"); // Import HTTP
const { Server } = require("socket.io"); // Import Socket.io
require("dotenv").config();

const db = require("./db");
const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");
const userRoutes = require("./routes/userRoutes"); // Ensure you have this or remove if not

const app = express();
const server = http.createServer(app); // Wrap Express

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow your frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(cors());
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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});