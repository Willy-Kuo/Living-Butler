import { useState } from "react";
import API from "../services/api";

export default function AuthPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true); // 切換登入/註冊
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        // 登入請求
        const res = await API.post("/auth/login", formData);
        localStorage.setItem("token", res.data.token); // 存 Token
        localStorage.setItem("user", JSON.stringify(res.data.user)); // 存使用者資料
        onLoginSuccess(res.data.user);
      } else {
        // 註冊請求
        await API.post("/auth/register", formData);
        alert("註冊成功！請登入");
        setIsLogin(true); // 切換回登入模式
      }
    } catch (err) {
      setError(err.response?.data?.error || "發生錯誤");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? "🔐 使用者登入" : "📝 註冊帳號"}</h2>
        {error && <p className="auth-error">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>帳號</label>
            <input name="username" onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>密碼</label>
            <input type="password" name="password" onChange={handleChange} required />
          </div>
          
          <button type="submit" className="auth-btn">
            {isLogin ? "登入" : "註冊"}
          </button>
        </form>

        <p className="auth-switch" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "還沒有帳號？點此註冊" : "已有帳號？點此登入"}
        </p>
      </div>
    </div>
  );
}