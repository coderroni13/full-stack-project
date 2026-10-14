const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Register
router.post("/register", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
});

// Login
router.post("/login", async (req, res) => {
  const user = await User.findOne(req.body);
  res.json(user);
});

// Deposit
router.post("/deposit", async (req, res) => {
  const { userId, amount } = req.body;
  const user = await User.findById(userId);
  user.balance += amount;
  await user.save();
  res.json(user);
});

// Withdraw
router.post("/withdraw", async (req, res) => {
  const { userId, amount } = req.body;
  const user = await User.findById(userId);

  if (user.balance < amount) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  user.balance -= amount;
  await user.save();
  res.json(user);
});

module.exports = router;