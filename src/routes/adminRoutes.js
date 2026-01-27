import express from "express";
import User from "../models/User.js";
import verifyUser from "../middleware/verifyUser.js";
import requireRole from "../middleware/requireRole.js";

const router = express.Router();

// GET ALL USERS
router.get(
  "/users",
  verifyUser,
  requireRole("admin"),
  async (req, res) => {
    const users = await User.find();
    res.json(users);
  }
);

// APPROVE NGO
router.post(
  "/approve-ngo/:id",
  verifyUser,
  requireRole("admin"),
  async (req, res) => {
    const ngo = await User.findById(req.params.id);

    if (!ngo || ngo.role !== "ngo") {
      return res.status(404).json({ message: "NGO not found" });
    }

    ngo.approved = true;
    await ngo.save();

    res.json({ message: "NGO approved", ngo });
  }
);

// BLOCK / UNBLOCK USER
router.post(
  "/toggle-block/:id",
  verifyUser,
  requireRole("admin"),
  async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.approved = !user.approved;
    await user.save();

    res.json({
      message: user.approved ? "User unblocked" : "User blocked",
      user,
    });
  }
);

// DELETE USER
router.delete(
  "/delete/:id",
  verifyUser,
  requireRole("admin"),
  async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  }
);

router.get("/verifications", verifyUser, requireRole("admin"), async (req, res) => {
  const users = await User.find({
    "verification.status": "pending",
  }).select("name email role verification");

  res.json(users);
});

router.put("/verify-user/:id", verifyUser, requireRole("admin"), async (req, res) => {
  const { status, rejectionReason } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  user.verification.status = status;
  user.verification.rejectionReason = rejectionReason || null;
  user.verification.verifiedAt = status === "verified" ? new Date() : null;

  await user.save();

  res.json(user);
});


export default router;
