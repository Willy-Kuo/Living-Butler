
# 🎙️ AI Voice Butler — 長者語音照護 & 健康監測系統  
AI 語音助理 + 健康儀表板 + 自動趨勢分析 + 長者友善 UI

（以下內容與你要求的 README 完整一致。請直接下載使用。）

---

## 🧩 功能總覽

### 🎤 1. 長者語音聊天  
- 使用 GPT-4o-mini  
- 長者友善語氣  
- 可語音輸入與語音回覆（TTS / STT）

### ❤️‍🩹 2. 健康語音辨識（自動偵測關鍵字）  
- 血壓（130/80、130 over 80 皆可）  
- 心跳  
- 血糖  
- 睡眠  
- 步數  
- 心情（🙂😢😡😪 ...）

語音一講 → 自動更新健康儀表板。

---

## 📊 3. 健康折線圖（Trend Chart）
- 使用 Chart.js  
- 自動記錄每一筆健康數據  
- AI 可講解趨勢（例如：第二次血糖偏高）

---

## ✍️ 4. 手動輸入（可選第幾筆紀錄）
- 可自由更新：第 1~N 次紀錄  
- 血壓、血糖、心跳、步數、睡眠  
- 更新後即時反映於儀表板＋折線圖

---

## 🎨 5. UI 特點
- 超大字體（長者友善）  
- 卡片式設計  
- 日夜主題切換  
- 清楚顯示 AI 與使用者聊天  
- 健康異常紅色警示  
  - 血壓 > 140/90  
  - 血糖 > 140  
  - 心跳 > 110 或 < 45  

---

## 📁 專案目錄結構

```
ai-voice-butler-openai/
│── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── chat.js
│   │   │   ├── stt.js
│   │   │   ├── tts.js
│   │   │   ├── health-analysis.js
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
│── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── VoiceRecorder.jsx
│   │   │   ├── HealthDashboard.jsx
│   │   │   ├── HealthChart.jsx
│   │   │   ├── HealthInputPanel.jsx
│   │   │   └── CareCard.jsx
│   └── package.json
└── README.md
```

---

## 🚀 安裝與啟動方式

### 1. 安裝後端
```
cd backend
npm install
npm run dev
```

後端會啟動在：  
➡ http://localhost:3000

---

### 2. 安裝前端
```
cd frontend
npm install
npm run dev
```

前端會啟動在：  
➡ http://localhost:5173

---

## 🔧 系統需求
- Node.js 18+  
- 支援 HTTPS 的瀏覽器  
- OpenAI API KEY（放在 backend/.env）

```
OPENAI_API_KEY=你的key
```

---

## 🧪 範例語音指令（健康更新）
> 我的心跳是 85  
> 今天走了 3200 步  
> 我血糖 140  
> 我睡了 7.5 小時  
> 我的血壓 150 over 95  
> 我今天心情不太好  

---

## 📡 API 說明

### `/api/stt`  
- 語音轉文字  
- 接收 multipart/form-data(`audio`)

### `/api/tts`  
- 文字轉語音  
- 回傳 mp3 blob

### `/api/chat`  
- GPT-4o-mini 長者聊天

### `/api/health-analysis`  
- 給 AI 分析健康趨勢  
- 前端折線圖會配合使用

---

## 🤝 開發者筆記
- 本專案已完整模組化  
- 所有功能皆已與前端整合  
- 支援多筆健康紀錄與修改  
- 可擴充至藍牙量測設備（血壓計、血糖機、智慧手環）

---

## ⭐ 推薦未來可擴充功能
- 雲端健康資料同步（FireStore / Supabase）  
- 家屬通知中心  
- 跌倒偵測（設備搭配）  
- 認知測試（AI 問答）  
