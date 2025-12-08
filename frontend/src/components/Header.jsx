export default function HealthInputPanel({ mode, onUpdate }) {

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const newData = {
      heartRate: Number(form.get("heartRate")),
      bloodPressure: `${form.get("bpHigh")} / ${form.get("bpLow")}`,
      glucose: Number(form.get("glucose")),
      steps: Number(form.get("steps")),
      sleep: Number(form.get("sleep")),
      mood: "🙂 良好"
    };

    onUpdate(newData);
  };

  if (mode !== "manual") return null;

  return (
    <form className="health-input-panel" onSubmit={handleSubmit}>
      <h3>✍️ 手動輸入健康數據</h3>

      <div className="input-row">
        <label>心跳（bpm）</label>
        <input name="heartRate" type="number" placeholder="例如 75" required />
      </div>

      <div className="input-row">
        <label>血壓（mmHg）</label>
        <div className="bp-group">
          <input name="bpHigh" type="number" placeholder="收縮壓" required />
          <span>/</span>
          <input name="bpLow" type="number" placeholder="舒張壓" required />
        </div>
      </div>

      <div className="input-row">
        <label>血糖（mg/dL）</label>
        <input name="glucose" type="number" placeholder="例如 110" required />
      </div>

      <div className="input-row">
        <label>今日步數</label>
        <input name="steps" type="number" placeholder="例如 3500" required />
      </div>

      <div className="input-row">
        <label>睡眠（小時）</label>
        <input name="sleep" type="number" step="0.1" placeholder="例如 7.5" required />
      </div>

      <button className="health-submit">✔ 更新健康狀態</button>
    </form>
  );
}
