import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import volunteerRoutes from "./src/routes/volunteerRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import elderRoutes from "./src/routes/elderRoutes.js";
import ngoRoutes from "./src/routes/ngoRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/elder", elderRoutes);
app.use("/volunteer", volunteerRoutes);
app.use("/ngo", ngoRoutes);
app.use("/admin", adminRoutes);
app.use("/profile", profileRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
