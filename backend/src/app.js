import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";
import cors from "cors";
import userRoutes from "./routes/users.routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = createServer(app);

// Connect socket.io
const io = connectToSocket(server);

// MONGO CONNECT (ONLY ONCE)
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    // Start server only after DB connection
    const PORT = process.env.PORT || 8000;
    server.listen(PORT, () => {
      console.log(`LISTENING ON PORT ${PORT}`);
    });

  })
  .catch((err) => console.log("Mongo Error:", err));

// Middlewares
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

// Routes
app.use("/api/v1/users", userRoutes);
