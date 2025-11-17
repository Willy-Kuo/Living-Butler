import app from "./app.js";
import healthAnalysisRouter from "./routes/health-analysis.js";

const PORT = 3000;

app.use("/api/health-analysis.js", healthAnalysisRouter);
app.listen(PORT, () => {
  console.log(`Backend running http://localhost:${PORT}`);
});
