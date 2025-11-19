import { useState } from "react";

export default function VoiceRecorder({ onTranscript }) {
  const [rec, setRec] = useState(null);
  const [recording, setRecording] = useState(false);

  const startRecord = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

    let chunks = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);

    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      const fd = new FormData();
      fd.append("audio", blob, "voice.webm");

      const res = await fetch("https://living-butler.onrender.com/api/stt", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();

      // 👉 只把文字傳到 App，不新增訊息、不 call AI
      onTranscript(data.text);
    };

    recorder.start();
    setRec(recorder);
    setRecording(true);
  };

  const stopRecord = () => {
    if (rec) rec.stop();
    setRecording(false);
  };

  return (
    <div className="voice-area">
      <button
        className={`voice-btn start ${recording ? "disabled" : ""}`}
        onClick={startRecord}
        disabled={recording}
      >
        🎤 開始錄音
      </button>

      <button
        className={`voice-btn stop ${!recording ? "disabled" : ""}`}
        onClick={stopRecord}
        disabled={!recording}
      >
        ⏹ 停止錄音
      </button>
    </div>
  );
}
