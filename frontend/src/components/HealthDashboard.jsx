// src/components/HealthDashboard.jsx
export default function HealthDashboard({ health }) {
  const warn = {
    bp: (() => {
      const [sys, dia] = health.bloodPressure.split("/").map((v) => Number(v));
      return sys > 140 || dia > 90;
    })(),

    heart: health.heartRate > 100 || health.heartRate < 50,

    glucose: health.glucose > 130 || health.glucose < 70,
  };

  return (
    <div className="health-dashboard">
      <h2 className="health-title">🩺 健康狀態儀表板</h2>

      <div className="health-grid">

        {/* 血壓 */}
        <div className={`health-card ${warn.bp ? "alert" : ""}`}>
          <div className="health-label">血壓</div>
          <div className="health-value">{health.bloodPressure}</div>
          {warn.bp && <div className="health-alert">⚠ 血壓偏高，請注意休息</div>}
        </div>

        {/* 心跳 */}
        <div className={`health-card ${warn.heart ? "alert" : ""}`}>
          <div className="health-label">心跳</div>
          <div className="health-value">{health.heartRate} / 分</div>
          {warn.heart && <div className="health-alert">⚠ 心跳異常，請注意</div>}
        </div>

        {/* 血糖 */}
        <div className={`health-card ${warn.glucose ? "alert" : ""}`}>
          <div className="health-label">血糖</div>
          <div className="health-value">{health.glucose} mg/dL</div>
          {warn.glucose && <div className="health-alert">⚠ 血糖偏高，請注意飲食</div>}
        </div>

        {/* 步數 */}
        <div className="health-card">
          <div className="health-label">今日步數</div>
          <div className="health-value">{health.steps}</div>
        </div>

        {/* 睡眠 */}
        <div className="health-card">
          <div className="health-label">睡眠時數</div>
          <div className="health-value">{health.sleep} 小時</div>
        </div>

        {/* 心情 */}
        <div className="health-card">
          <div className="health-label">今日心情</div>
          <div className="health-value">{health.mood}</div>
        </div>
      </div>
    </div>
  );
}
