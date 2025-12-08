import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET


router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 檢查用戶是否存在
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: "使用者名稱已存在" });

    // 密碼加密
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 建立新用戶
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "註冊成功！請登入" });
  } catch (err) {
    res.status(500).json({ error: "註冊失敗", details: err.message });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 找用戶
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "找不到此使用者" });

    // 比對密碼
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "密碼錯誤" });

    // 發放 Token
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ 
      token, 
      user: { 
        username: user.username, 
        currentHealth: user.currentHealth,
        healthHistory: user.healthHistory
      } 
    });
  } catch (err) {
    res.status(500).json({ error: "登入失敗", details: err.message });
  }
});

export default router;