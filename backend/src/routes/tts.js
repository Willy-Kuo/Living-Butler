import express from "express";
import { openai } from "../openai.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "缺少文字內容 text" });
    }

    // ⭐ v4 TTS 正確寫法
    const result = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: text,
      format: "wav",
    });

    const audioBuffer = Buffer.from(await result.arrayBuffer());

    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Content-Length", audioBuffer.length);

    res.send(audioBuffer);
  } catch (err) {
    console.error("❌ TTS ERROR (FULL):", err);
    return res.status(500).json({
      error: err.message,
      detail: err.response?.data || err,   // ⭐ 印出 openai 的真正錯誤
    });
  }
});

export default router;
