import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function HealthChart({ history }) {
  if (!history || history.length === 0) {
    return <div className="chart-box">尚無圖表資料</div>;
  }

  const labels = history.map((h, i) => `#${i + 1}`);

  const data = {
    labels,
    datasets: [
      {
        label: "🌡 心跳",
        data: history.map((h) => h.heartRate),
        borderColor: "#ff6384",
        tension: 0.3,
      },
      {
        label: "🩸 血糖",
        data: history.map((h) => h.glucose),
        borderColor: "#36a2eb",
        tension: 0.3,
      },
      {
        label: "👣 步數",
        data: history.map((h) => h.steps),
        borderColor: "#4bc0c0",
        tension: 0.3,
      },
      {
        label: "💤 睡眠",
        data: history.map((h) => h.sleep),
        borderColor: "#9966ff",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="chart-card">
      <h3>📈 健康折線圖趨勢</h3>
      <Line data={data} />
    </div>
  );
}
