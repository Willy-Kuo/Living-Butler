import express from "express";
import cors from "cors";

import sttRouter from "./routes/stt.js";
import chatRouter from "./routes/chat.js";
import ttsRouter from "./routes/tts.js";
import careRoute from "./routes/care.js";
import healthAnalysis from "./routes/health-analysis.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/stt", sttRouter);
app.use("/api/chat", chatRouter);
app.use("/api/tts", ttsRouter);
app.use("/api/care", careRoute);
app.use("/api/health-analysis", healthAnalysis);

export default app;
