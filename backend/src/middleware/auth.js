import jwt from "jsonwebtoken";

// 確保此 SECRET 與 auth.js 中使用的相同
const JWT_SECRET = process.env.JWT_SECRET; 

const auth = (req, res, next) => {
  // 格式: Bearer <token>
  const authHeader = req.header("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "沒有驗證令牌 (Token)，拒絕存取" });
  }

  try {
    // 驗證 token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 將用戶資訊存入 request 物件
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT 驗證失敗:", err.message);
    res.status(401).json({ error: "無效的令牌" });
  }
};

export default auth;