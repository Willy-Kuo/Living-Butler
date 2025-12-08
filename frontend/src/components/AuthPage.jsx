import { useState } from "react";
import API from "../services/api";

export default function AuthPage({ onLoginSuccess }) {
  // === State 管理 (採用新介面的個別欄位方式，較易於驗證) ===
  const [mode, setMode] = useState("login"); // 'login' 或 'register'
  const [name, setName] = useState("");    // 對應後端的 username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // === 介面文字設定 ===
  const title = mode === "login" ? "登入健康管家" : "建立新帳號";
  const switchText = mode === "login" ? "還沒有帳號嗎？" : "已經有帳號了嗎？";
  const switchBtnText = mode === "login" ? "註冊一個" : "改為登入";

  // === 切換模式 ===
  const handleSwitchMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
    setError("");
    setPassword(""); // 切換時清空密碼較安全
  };

  // === 送出表單 (整合 API 邏輯) ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 1. 前端基本驗證
    if (!name || !password) {
      setError("請把資料填寫完整唷。");
      return;
    }

    try {
      setLoading(true);

      if (mode === "login") {
        // === 登入請求 ===
        // 注意：這裡將 UI 的 email 對應到 API 的 username 欄位
        const res = await API.post("/auth/login", { 
          username: name, 
          password: password 
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        
        // 登入成功，回傳使用者資料
        onLoginSuccess(res.data.user);

      } else {
        // === 註冊請求 ===
        // 將 name, email(作為username), password 傳給後端
        await API.post("/auth/register", { 
          username: name, 
          password: password
        });

        alert("註冊成功！歡迎加入，請重新登入。");
        handleSwitchMode(); // 切換回登入畫面
      }
    } catch (err) {
      console.error(err);
      // 顯示後端回傳的錯誤，若無則顯示預設訊息
      setError(err.response?.data?.error || "發生連線錯誤，請稍後再試。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card">
        <h2>{title}</h2>
        <p className="auth-subtitle">
          歡迎使用 AI 健康小管家，我會幫你一起記錄與關心每天的身體狀況 🌿
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>

          <div className="input-row">
            <label>帳號</label>
            <input
              type="text"
              name="username"
              placeholder="請輸入帳號"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="input-row">
            <label>密碼</label>
            <input
              type="password"
              placeholder="請輸入密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading
              ? mode === "login" ? "登入中..." : "建立中..."
              : mode === "login" ? "立即登入" : "建立帳號"}
          </button>
        </form>

        <div className="auth-switch">
          {switchText}
          <button type="button" onClick={handleSwitchMode}>
            {switchBtnText}
          </button>
        </div>
      </div>
    </div>
  );
}