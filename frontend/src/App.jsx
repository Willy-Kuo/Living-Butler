import { useState, useEffect } from "react";
import ChatWindow from "./components/ChatWindow";
import VoiceRecorder from "./components/VoiceRecorder";
import CareCard from "./components/CareCard";
import Header from "./components/Header";
import HealthDashboard from "./components/HealthDashboard";
import HealthInputPanel from "./components/HealthInputPanel";
import HealthChart from "./components/HealthChart";
import AuthPage from "./components/AuthPage";
import API from "./services/api";
import "./index.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");
  const [messages, setMessages] = useState([]);
  const [careMessage, setCareMessage] = useState("");
  const [inputMode, setInputMode] = useState("voice");


  const [health, setHealth] = useState({
    heartRate: 72,
    bloodPressure: "118 / 75",
    glucose: 95,
    steps: 4123,
    sleep: 7.1,
    mood: "🙂 放鬆",
  });


  const [healthHistory, setHealthHistory] = useState([]);

// 檢查是否已登入
useEffect(() => {
    const initData = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);

        // 呼叫後端 API 獲取「最新」的健康數據
        try {
          const res = await API.get("/health");
          
          if (res.data.currentHealth) setHealth(res.data.currentHealth);
          if (res.data.healthHistory) setHealthHistory(res.data.healthHistory);
          
          console.log("健康數據同步完成");
        } catch (err) {
          console.error("無法同步健康數據 (可能 Token 過期)", err);
          handleLogout(); 
        }
      }
    };
    initData();
  }, []);

  // 登入成功處理
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    if (userData.currentHealth) setHealth(userData.currentHealth);
    if (userData.healthHistory) setHealthHistory(userData.healthHistory);
  };

  // 登出處理
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setMessages([]);
  };
  
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
      const res = await API.post("/tts", { text }, { responseType: "arraybuffer" });

      const audioBuffer = res.data
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
  const onTranscript = async (text) => {
    addMessage("user", text);

    const updates = parseHealthData(text);
    if (Object.keys(updates).length > 0) {
      const newHealth = { ...health, ...updates };

    try {
        const res = await API.post("/health/manual", newHealth);
        setHealth(res.data.currentHealth);
        setHealthHistory(res.data.healthHistory);

        const notify = "👌 已更新健康數據並存檔！我也可以幫您分析趨勢喔。";
        addMessage("assistant", notify);
        playVoice(notify);
      } catch (err) {
        console.error("存檔失敗", err);
        addMessage("assistant", "⚠ 數據更新失敗，請檢查網路");
      }
      return;
    }

    requestAI(text);
  };

  // ------------- AI 聊天回覆 -------------
  const requestAI = async (text) => {
    try {
      const res = await API.post("/chat", { text });

      const data = await res.data;
      addMessage("assistant", data.reply);
      playVoice(data.reply);
    } catch {
      addMessage("assistant", "⚠ AI 回覆失敗");
    }
  };

  // ------------- AI 健康趨勢分析 -------------
  const analyzeHealth = async () => {
    try {
      const res = await API.post("/health-analysis", { history: healthHistory });

      const data = await res.data;
      addMessage("assistant", data.reply);
      playVoice(data.reply);
    } catch {
      addMessage("assistant", "⚠ 趨勢分析失敗");
    }
  };

  // ------------- 手動健康輸入 -------------
  const handleManualHealth = async (data) => {
    const newHealth = { ...health, ...data };
    try{
      const res = await API.post("/health/manual", newHealth);
      setHealth(res.data.currentHealth);
      setHealthHistory(res.data.healthHistory);

      const msg = "👌 已更新手動輸入的健康數據！";
      addMessage("assistant", msg);
      playVoice(msg);
    } catch (err) {
      console.error("❌ 儲存手動輸入數據失敗:", err);
      const errorMsg = err.response?.data?.error || "⚠ 數據儲存失敗，請檢查登入狀態。";
      addMessage("assistant", errorMsg);
      playVoice(errorMsg);
    }
  };

  // ------------- 每日關懷語 -------------
  const generateCareMessage = async () => {
    try {
      const res = await API.get("/care");
      const data = await res.data;
      setCareMessage(data.message);
    } catch {
      setCareMessage("今天也要記得吃飯喔！");
    }
  };


  if (!user) {
    return (
      <div className={`app-root ${theme}`}>
        <Header theme={theme} toggleTheme={toggleTheme} />
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className={`app-root ${theme}`}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Header theme={theme} toggleTheme={toggleTheme} />
        <button onClick={handleLogout} style={{padding:'8px 16px', borderRadius:'20px', border:'1px solid #ccc', cursor:'pointer'}}>
          登出 {user.username}
        </button>
      </div>

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
