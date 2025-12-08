import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// 註冊 Chart.js 元件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function HealthChart({ history }) {
  // 如果沒有歷史數據，顯示提示
  if (!history || history.length === 0) {
    return (
      <div className="chart-card" style={{ textAlign: "center", padding: "30px" }}>
        <p style={{ color: "#888" }}>尚無歷史數據，請先輸入或語音記錄健康數值</p>
      </div>
    );
  }

  // 處理 X 軸標籤
  const labels = history.map((h, i) => {
    if (h.date) {
      const d = new Date(h.date);
      // 格式化日期：月/日 時:分
      return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }
    return `紀錄 ${i + 1}`;
  });

  // 處理血壓數據 (將 "120/80" 字串拆解為兩個數值)
  const bpHigh = history.map((h) => {
    if (!h.bloodPressure) return null;
    // 支援 "/" 或空格分隔
    const parts = h.bloodPressure.toString().split(/[\/| ]+/); 
    return parts[0] ? Number(parts[0]) : null;
  });

  const bpLow = history.map((h) => {
    if (!h.bloodPressure) return null;
    const parts = h.bloodPressure.toString().split(/[\/| ]+/);
    return parts[1] ? Number(parts[1]) : null;
  });

  const data = {
    labels,
    datasets: [
      {
        label: "❤️ 心跳 (bpm)",
        data: history.map((h) => h.heartRate),
        borderColor: "#ff6384",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        tension: 0.3,
      },
      {
        label: "⬆ 收縮壓 (mmHg)",
        data: bpHigh,
        borderColor: "#ff9f40",
        backgroundColor: "rgba(255, 159, 64, 0.5)",
        tension: 0.3,
      },
      {
        label: "⬇ 舒張壓 (mmHg)",
        data: bpLow,
        borderColor: "#ffcd56",
        backgroundColor: "rgba(255, 205, 86, 0.5)",
        tension: 0.3,
      },
      {
        label: "🍬 血糖 (mg/dL)",
        data: history.map((h) => h.glucose),
        borderColor: "#36a2eb",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        tension: 0.3,
      },
      {
        label: "💤 睡眠 (hr)",
        data: history.map((h) => h.sleep),
        borderColor: "#9966ff",
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        tension: 0.3,
      },
      {
        label: "👣 步數",
        data: history.map((h) => h.steps),
        borderColor: "#4bc0c0",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        labels: { font: { size: 13 } },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: '數值'
        }
      }
    },
  };

  return (
    <div className="chart-card">
      <h3>📈 健康折線圖趨勢</h3>
      <Line data={data} options={options} />
    </div>
  );
}