import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  healthHistory: { type: Array, default: [] },
  currentHealth: {
    heartRate: { type: Number, default: 72 },
    bloodPressure: { type: String, default: "120/80" },
    glucose: { type: Number, default: 95 },
    steps: { type: Number, default: 0 },
    sleep: { type: Number, default: 7 },
    mood: { type: String, default: "🙂 普通" }
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);