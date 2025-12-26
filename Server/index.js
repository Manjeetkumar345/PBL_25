const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const PORT = 8001;
const app = express();

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/PBL')
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.error("MongoDB Connection Failed:", error));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST'],
  credentials: true
}));

// REST API Routes
const authRoutes = require("./router/authRoutes");
app.use("/api/auth", authRoutes);

const negotiateRoutes = require("./router/negotiateRoutes")
app.use('/api/negotiate',negotiateRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
