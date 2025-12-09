import express from "express";
import multer from "multer";
import FormData from "form-data";
import fetch from "node-fetch";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "沒有收到音檔" });
    }

    console.log("✔ 收到音檔:", req.file.mimetype, req.file.size, "bytes");

    // ⭐ 手動建立 multipart form（唯一 100% 可用的方式）
    const form = new FormData();
    form.append("model", "gpt-4o-mini-transcribe");
    form.append("language", "zh-TW");

    // ⭐ 非常重要：必須傳 buffer + 檔名 + MIME
    form.append("file", req.file.buffer, {
      filename: "audio.webm",
      contentType: req.file.mimetype,
    });

    // ⭐ 直接送 HTTP request（不要用 openai SDK）
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        ...form.getHeaders(), // 重要：multipart header
      },
      body: form,
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ OpenAI API 錯誤:", result);
      return res.status(500).json({ error: result });
    }

    console.log("✔ STT OK:", result.text);
    res.json({ text: result.text });
  } catch (err) {
    console.error("❌ STT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
