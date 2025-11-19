import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import VoiceRecorder from "./components/VoiceRecorder";
import CareCard from "./components/CareCard";
import Header from "./components/Header";
import HealthDashboard from "./components/HealthDashboard";
import HealthInputPanel from "./components/HealthInputPanel";
import HealthChart from "./components/HealthChart";
import "./index.css";

export default function App() {
  const [theme, setTheme] = useState("light");
  const [messages, setMessages] = useState([]);
  const [careMessage, setCareMessage] = useState("");
  const [inputMode, setInputMode] = useState("voice");

  // ⭐ 健康最新數據
  const [health, setHealth] = useState({
    heartRate: 72,
    bloodPressure: "118 / 75",
    glucose: 95,
    steps: 4123,
    sleep: 7.1,
    mood: "🙂 放鬆",
  });

  // ⭐ 健康歷史，用於折線圖 & 趨勢分析
  const [healthHistory, setHealthHistory] = useState([]);

  // ------------- 主題切換 ----------------
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // ------------- 聊天訊息管理 -------------
  const addMessage = (role, text) =>
    setMessages((prev) => [...prev, { role, text }]);

  // ------------- AI 語音播放 (TTS) -------------
  const playVoice = async (text) => {
    try {
      const res = await fetch("https://living-butler.onrender.com/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const audioBuffer = await res.arrayBuffer();
      const blob = new Blob([audioBuffer], { type: "audio/mp3" });
      const url = URL.createObjectURL(blob);
      new Audio(url).play();
    } catch (err) {
      console.error("❌ 播放語音錯誤：", err);
    }
  };

  // ------------- 健康語音解析 -------------
  const parseHealthData = (text) => {
    let updated = {};

    // 血壓
    const bp =
      text.match(/血壓\D*(\d{2,3})\D+(\d{2,3})/) ||
      text.match(/(\d{2,3})\s*(?:\/|over|比)\s*(\d{2,3})/i);
    if (bp) updated.bloodPressure = `${bp[1]} / ${bp[2]}`;

    // 心跳
    const hr =
      text.match(/心(?:跳|率)\D*(\d{2,3})/) ||
      text.match(/脈搏\D*(\d{2,3})/);
    if (hr) updated.heartRate = Number(hr[1]);

    // 血糖
    const glu =
      text.match(/血糖\D*(\d{2,3})/) ||
      text.match(/糖值\D*(\d{2,3})/);
    if (glu) updated.glucose = Number(glu[1]);

    // 步數
    const steps =
      text.match(/(\d{3,6})\s*步/) ||
      text.match(/走(?:了)?\s*(\d{3,6})/) ||
      text.match(/步數\D*(\d{3,6})/);
    if (steps) updated.steps = Number(steps[1]);

    // 睡眠
    const sleep = text.match(/睡(?:了)?\D*(\d+(?:\.\d+)?)\D*小時/);
    if (sleep) updated.sleep = Number(sleep[1]);

    // 心情
    const moodMap = [
      { keywords: ["開心", "高興", "愉快"], mood: "😄 開心" },
      { keywords: ["放鬆", "舒服"], mood: "😊 放鬆" },
      { keywords: ["普通"], mood: "🙂 普通" },
      { keywords: ["難過", "悲傷"], mood: "😢 難過" },
      { keywords: ["生氣"], mood: "😡 生氣" },
      { keywords: ["疲倦", "累"], mood: "😪 疲倦" },
      { keywords: ["不舒服", "頭痛"], mood: "😣 不舒服" },
    ];
    const moodHit = moodMap.find((m) =>
      m.keywords.some((kw) => text.includes(kw))
    );
    if (moodHit) updated.mood = moodHit.mood;

    return updated;
  };

  // ------------- 語音輸入處理 -------------
  const onTranscript = (text) => {
    addMessage("user", text);

    const updates = parseHealthData(text);
    if (Object.keys(updates).length > 0) {
      const newHealth = { ...health, ...updates };

      setHealth(newHealth);
      setHealthHistory((prev) => [...prev, newHealth]);

      const notify = "👌 已更新健康數據！我也可以幫您分析趨勢喔。";
      addMessage("assistant", notify);
      playVoice(notify);
      return;
    }

    requestAI(text);
  };

  // ------------- AI 聊天回覆 -------------
  const requestAI = async (text) => {
    try {
      const res = await fetch("https://living-butler.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      addMessage("assistant", data.reply);
      playVoice(data.reply);
    } catch {
      addMessage("assistant", "⚠ AI 回覆失敗");
    }
  };

  // ------------- AI 健康趨勢分析 -------------
  const analyzeHealth = async () => {
    try {
      const res = await fetch("https://living-butler.onrender.com/api/health-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: healthHistory }),
      });

      const data = await res.json();
      addMessage("assistant", data.reply);
      playVoice(data.reply);
    } catch {
      addMessage("assistant", "⚠ 趨勢分析失敗");
    }
  };

  // ------------- 手動健康輸入 -------------
  const handleManualHealth = (data) => {
    const newHealth = { ...health, ...data };
    setHealth(newHealth);
    setHealthHistory((prev) => [...prev, newHealth]);

    const msg = "👌 已更新手動輸入的健康數據！";
    addMessage("assistant", msg);
    playVoice(msg);
  };

  // ------------- 每日關懷語 -------------
  const generateCareMessage = async () => {
    try {
      const res = await fetch("https://living-butler.onrender.com/api/care");
      const data = await res.json();
      setCareMessage(data.message);
    } catch {
      setCareMessage("今天也要記得吃飯喔！");
    }
  };

  return (
    <div className={`app-root ${theme}`}>
      <Header theme={theme} toggleTheme={toggleTheme} />

      <CareCard careMessage={careMessage} onGenerate={generateCareMessage} />

      {/* ⭐ AI 健康趨勢分析按鈕 */}
      <button class="ai-health-btn arrow">
        📊 AI 健康趨勢分析
        <span class="arrow-icon">➜</span>
      </button>

      <HealthDashboard health={health} />

      {/* ⭐ 健康折線圖 */}
      <HealthChart history={healthHistory} />

      <div className="input-mode-switch">
        <button
          className={inputMode === "voice" ? "active" : ""}
          onClick={() => setInputMode("voice")}
        >
          🎤 語音輸入
        </button>

        <button
          className={inputMode === "manual" ? "active" : ""}
          onClick={() => setInputMode("manual")}
        >
          ✍️ 手動輸入
        </button>
      </div>

      <HealthInputPanel mode={inputMode} onUpdate={handleManualHealth} />

      <ChatWindow messages={messages} />

      {/* 如果是語音模式才顯示錄音按鈕 */}
      {inputMode === "voice" && (
        <div className="voice-zone">
          <VoiceRecorder onTranscript={onTranscript} />
        </div>
      )}
    </div>
  );
}
