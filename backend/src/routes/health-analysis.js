// backend/src/routes/healthAnalysis.js
import express from "express";
import { openai } from "../openai.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { history } = req.body;

    if (!history) {
      return res.status(400).json({ error: "缺少健康數據 history" });
    }

    const prompt = `
你是一位專業醫療 AI，請分析以下使用者的健康數據趨勢並給出：

1. 心跳趨勢
2. 血壓趨勢
3. 血糖趨勢
4. 睡眠趨勢
5. 步數變化
6. 風險提醒（若有）
7. 簡短建議（適合長者）

請使用溫柔、安心的語氣。

健康數據如下（時間序列）：
${JSON.stringify(history, null, 2)}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const answer = completion.choices?.[0]?.message?.content || "分析結果無法生成。";

    res.json({ analysis: answer });

  } catch (error) {
    console.error("AI analysis error:", error);
    res.status(500).json({ error: "無法生成 AI 健康分析" });
  }
});

export default router;
