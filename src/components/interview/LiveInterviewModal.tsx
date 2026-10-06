import React, { useState, useEffect } from "react";
import {
  Video, VideoOff, Mic, MicOff, Square, Play, Send, ChevronRight,
  Clock, X, AlertCircle, Sparkles
} from "lucide-react";

interface LiveInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  company?: string;
  roleTitle?: string;
  onFinishInterview: () => void;
}

const interviewQuestions = [
  "How would you detect and resolve a dead-lock condition in an enterprise distributed database?",
  "Explain how you select between an iterative DFS approach and BFS for finding shortest paths in unweighted graphs.",
  "Describe how you design a rate limiter using Redis token-bucket algorithms to protect an authentication API.",
  "Walk us through a technical challenge you encountered during a past project and how you profiled its root cause.",
  "How do you maintain schema consistency and handle eventual consistency across microservice events?"
];

export const LiveInterviewModal: React.FC<LiveInterviewModalProps> = ({
  isOpen,
  onClose,
  company = "TCS",
  roleTitle = "Digital Software Engineer",
  onFinishInterview
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(18 * 60 + 42); // 18:42
  const [userSpokenAnswer, setUserSpokenAnswer] = useState("");

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentQuestionText = interviewQuestions[currentQIndex] || interviewQuestions[0];

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setUserSpokenAnswer("Transcribing response... [Speech detection active]");
    } else {
      setIsRecording(false);
      setUserSpokenAnswer("Transcribed: 'I would analyze lock acquisition dependencies using resource wait-for graphs and configure strict transaction timeouts.'");
    }
  };

  const handleNextQuestion = () => {
    setIsRecording(false);
    setUserSpokenAnswer("");
    if (currentQIndex < interviewQuestions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      onFinishInterview();
    }
  };

  return (
    <div className="modal-backdrop-layer" role="dialog" aria-modal="true">
      <div className="modal-card-box modal-lg" style={{ height: "90vh" }}>
        {/* Top header */}
        <div className="modal-header-bar" style={{ background: "var(--cp-near-black)", color: "var(--cp-white)", borderBottom: "1px solid var(--cp-grey-800)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "var(--cp-grey-400)", textTransform: "uppercase", letterSpacing: 0.5 }}>
              CampusPulse AI Technical Interview
            </span>
            <span style={{ color: "var(--cp-grey-600)" }}>|</span>
            <b style={{ color: "var(--cp-white)", fontSize: 14 }}>{company} · {roleTitle}</b>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--cp-grey-300)" }}>
              <Clock size={15} />
              <span style={{ fontFamily: "monospace", fontWeight: 700 }}>{formatTimer(secondsRemaining)} remaining</span>
            </div>

            <button className="btn-ghost" onClick={onClose} style={{ color: "var(--cp-white)" }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Split interface */}
        <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 20 }}>
          {/* Candidate camera & video area */}
          <div className="candidate-video-box">
            <div className={`recording-indicator-tag ${isRecording ? "active" : ""}`}>
              <i />
              <span>{isRecording ? "Recording Answer" : "Mic Idle"}</span>
            </div>

            <div className="mock-video-stream">
              <div className="mock-avatar-camera">
                {cameraActive ? "PD" : <VideoOff size={32} style={{ color: "var(--cp-grey-500)" }} />}
              </div>
              <span style={{ fontSize: 13, color: "var(--cp-grey-300)", fontWeight: 600 }}>
                Priyanshu Dash (Candidate)
              </span>
              <span style={{ fontSize: 11, color: "var(--cp-grey-500)" }}>
                {cameraActive ? "HD Stream Active · 1080p" : "Camera Muted"}
              </span>
            </div>

            {/* Video Controls */}
            <div className="video-bottom-controls">
              <button
                className={`control-circle-btn ${!cameraActive ? "off" : ""}`}
                onClick={() => setCameraActive((v) => !v)}
                title={cameraActive ? "Mute Camera" : "Turn on Camera"}
              >
                {cameraActive ? <Video size={18} /> : <VideoOff size={18} />}
              </button>

              <button
                className={`control-circle-btn ${!micActive ? "off" : ""}`}
                onClick={() => setMicActive((v) => !v)}
                title={micActive ? "Mute Microphone" : "Turn on Microphone"}
              >
                {micActive ? <Mic size={18} /> : <MicOff size={18} />}
              </button>

              <button
                className="btn btn-sm"
                style={{
                  borderRadius: 99,
                  padding: "0 18px",
                  background: isRecording ? "var(--cp-error)" : "var(--cp-white)",
                  color: isRecording ? "var(--cp-white)" : "var(--cp-black)",
                  fontWeight: 600
                }}
                onClick={handleToggleRecord}
              >
                {isRecording ? <Square size={14} /> : <Play size={14} />}
                <span>{isRecording ? "Stop Recording" : "Record Answer"}</span>
              </button>
            </div>
          </div>

          {/* AI Interviewer prompt & progression panel */}
          <div className="interviewer-chat-box">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span className="eyebrow-tag">
                Question {currentQIndex + 1} of {interviewQuestions.length}
              </span>
              <span className="badge badge-neutral">Stage 3: Technical Defense</span>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, color: "var(--cp-black)", lineHeight: 1.4, fontWeight: 600 }}>
                "{currentQuestionText}"
              </h3>
              <p style={{ fontSize: 12, color: "var(--cp-grey-500)", marginTop: 8 }}>
                Rubric focus: Technical rigor, algorithm complexity justification, and structured communication.
              </p>
            </div>

            {/* Live speech transcription / preview */}
            <div
              style={{
                flex: 1,
                padding: "16px",
                borderRadius: "var(--cp-radius-sm)",
                background: "var(--cp-grey-50)",
                border: "1px solid var(--cp-grey-200)",
                display: "flex",
                flexDirection: "column",
                marginBottom: 20
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Sparkles size={14} style={{ color: "var(--cp-black)" }} />
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--cp-grey-600)" }}>
                  Live Speech Audio Transcriber
                </span>
              </div>
              <p style={{ fontSize: 13, color: "var(--cp-grey-700)", fontStyle: userSpokenAnswer ? "normal" : "italic" }}>
                {userSpokenAnswer || "Click 'Record Answer' when you are ready to speak your solution into the microphone."}
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                className="btn btn-secondary"
                onClick={onClose}
              >
                Exit Interview
              </button>

              <button
                className="btn btn-primary"
                onClick={handleNextQuestion}
              >
                <span>{currentQIndex < interviewQuestions.length - 1 ? "Submit & Next Question" : "Complete & View Feedback"}</span>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
