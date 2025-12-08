import express from "express";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "找不到使用者" });

    res.json({
      currentHealth: user.currentHealth,
      healthHistory: user.healthHistory,
    });
  } catch (err) {
    console.error("獲取健康數據失敗:", err);
    res.status(500).json({ error: "無法獲取數據" });
  }
});

router.post("/manual", auth, async (req, res) => {
  try {
    const userId = req.user.id; // 從 auth middleware 取得用戶 ID
    const newHealthData = req.body; // 這是前端傳來的最新健康數據

    if (!newHealthData || Object.keys(newHealthData).length === 0) {
      return res.status(400).json({ error: "缺少健康數據" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "找不到使用者" });
    }

    //更新 currentHealth 欄位
    user.currentHealth = {
        ...user.currentHealth.toObject(), // 保留舊數據
        ...newHealthData,
    };

    //將當前數據推入 healthHistory
    const historyEntry = {
        ...user.currentHealth.toObject(),
        date: new Date(),
    };
    user.healthHistory.push(historyEntry);

    await user.save();

    //回傳最新的數據給前端更新狀態
    res.json({ 
        message: "健康數據已成功儲存！",
        currentHealth: user.currentHealth,
        healthHistory: user.healthHistory
    });

  } catch (err) {
    console.error("手動更新健康數據失敗:", err);
    res.status(500).json({ error: "伺服器錯誤，無法儲存數據", details: err.message });
  }
});

export default router;