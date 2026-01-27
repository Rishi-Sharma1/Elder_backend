import express from "express";
import verifyUser from "../middleware/verifyUser.js";
import requireRole from "../middleware/requireRole.js";
import Request from "../models/Request.js";

const router = express.Router();

// CREATE REQUEST
router.post(
  "/request",
  verifyUser,
  requireRole("elder"),
  async (req, res) => {
    try {
      console.log("📥 ELDER REQUEST BODY:", req.body);

      const { type, description } = req.body;

      if (!type || !description) {
        return res.status(400).json({ message: "Missing fields" });
      }

      const request = await Request.create({
        elder: req.user._id,
        type,
        description,
        // status: "pending",
      });

      res.status(201).json(request);
    } catch (err) {
      console.error("❌ CREATE REQUEST ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


router.get(
  "/requests",
  verifyUser,
  requireRole("elder"),
  async (req, res) => {
    try {
      const requests = await Request.find({
        elder: req.user._id,
      }).sort({ createdAt: -1 });

      res.json(requests);
    } catch (err) {
      console.error("❌ FETCH MY REQUESTS ERROR:", err);
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  }
);




export default router;
