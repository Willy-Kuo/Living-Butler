// src/components/HealthInputPanel.jsx
export default function HealthInputPanel({ mode, onUpdate }) {
  if (mode !== "manual") return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      bloodPressure: e.target.bp.value,
      heartRate: Number(e.target.heart.value),
      glucose: Number(e.target.glucose.value),
      steps: Number(e.target.steps.value),
      sleep: Number(e.target.sleep.value),
      mood: e.target.mood.value,
    };

    onUpdate(data);
  };

  return (
    <form className="health-input-panel" onSubmit={handleSubmit}>
      <h3>✍️ 手動輸入健康數據</h3>

      <label>血壓（例如：120 / 80）</label>
      <input name="bp" placeholder="118 / 75" />

      <label>心跳（次/分）</label>
      <input name="heart" type="number" placeholder="72" />

      <label>血糖（mg/dL）</label>
      <input name="glucose" type="number" placeholder="95" />

      <label>今日步數</label>
      <input name="steps" type="number" placeholder="4000" />

      <label>睡眠時數</label>
      <input name="sleep" type="number" step="0.1" placeholder="7.5" />

      <label>心情</label>
      <select name="mood">
        <option>😄 開心</option>
        <option>🙂 普通</option>
        <option>😊 放鬆</option>
        <option>😢 難過</option>
        <option>😡 生氣</option>
        <option>😣 不舒服</option>
      </select>

      <button type="submit" className="health-submit">✔ 更新健康數據</button>
    </form>
  );
}
