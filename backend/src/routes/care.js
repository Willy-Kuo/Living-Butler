import express from "express";
import { openai } from "../openai.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "你是一位親切、溫暖、對長者非常友善的語音照護助理。",
        },
        {
          role: "user",
          content: "請給我一句長者每日關懷語句，25 字內，要溫暖、正向、鼓勵。",
        },
      ],
    });

    const text = completion.choices?.[0]?.message?.content || "祝您平安順心 💖";
    res.json({ message: text });
  } catch (error) {
    console.error("❌ Care API Error:", error);
    res.status(500).json({ error: "無法生成關懷語句" });
  }
});

export default router;
