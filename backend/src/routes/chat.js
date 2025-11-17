import express from "express";
import { openai } from "../openai.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { text } = req.body;

    console.log("🧓 使用者:", text);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "你是一位溫柔親切、適合長者的語音照護助理。" },
        { role: "user", content: text },
      ],
    });

    const reply =
      completion.choices?.[0]?.message?.content || "我在這裡陪著您 😊";

    console.log("🤖 AI 回覆:", reply);

    res.json({ reply });

  } catch (err) {
    console.error("❌ Chat API Error:", err);
    res.status(500).json({ error: "AI 無法回覆" });
  }
});

export default router;
