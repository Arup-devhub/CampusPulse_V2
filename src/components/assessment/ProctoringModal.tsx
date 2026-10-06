import React, { useEffect } from "react";
import { ShieldCheck, AlertTriangle, Eye, Video, Mic, X } from "lucide-react";
import { proctoringAuditLog } from "../../data/mockData";

interface ProctoringModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName?: string;
  sessionId?: string;
}

export const ProctoringModal: React.FC<ProctoringModalProps> = ({
  isOpen,
  onClose,
  candidateName = "Priyanshu Dash (2101297042)",
  sessionId = "ASM-9842"
}) => {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop-layer" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card-box modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-bar">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--cp-radius-sm)",
                backgroundColor: "var(--cp-grey-100)",
                color: "var(--cp-black)",
                display: "grid",
                placeItems: "center"
              }}
            >
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2>AI Proctoring Signal Inspector</h2>
              <span style={{ fontSize: 12, color: "var(--cp-grey-500)" }}>
                Probabilistic decision-support signals for Session {sessionId}
              </span>
            </div>
          </div>
          <button className="btn-ghost" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body-scroll">
          {/* Signal sensors banner */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              padding: "16px",
              background: "var(--cp-grey-50)",
              border: "1px solid var(--cp-grey-200)",
              borderRadius: "var(--cp-radius-md)",
              marginBottom: 20
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Video size={16} style={{ color: "var(--cp-success)" }} />
              <div>
                <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>Camera Status</span>
                <b style={{ fontSize: 13, color: "var(--cp-black)" }}>Connected & Streaming</b>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Mic size={16} style={{ color: "var(--cp-success)" }} />
              <div>
                <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>Audio Signal</span>
                <b style={{ fontSize: 13, color: "var(--cp-black)" }}>Connected (44.1 kHz)</b>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Eye size={16} style={{ color: "var(--cp-black)" }} />
              <div>
                <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>Gaze / Presence</span>
                <b style={{ fontSize: 13, color: "var(--cp-black)" }}>Candidate Detected</b>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <span className="eyebrow-tag">Session Audit Trail</span>
            <p style={{ fontSize: 12, color: "var(--cp-grey-600)" }}>
              Signals are probabilistic model observations intended for placement cell review, not definitive proof of misconduct.
            </p>
          </div>

          <table className="cp-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Observed Signal Event</th>
                <th>Model Confidence</th>
                <th>Risk Classification</th>
                <th>Review Action</th>
              </tr>
            </thead>
            <tbody>
              {proctoringAuditLog.map((ev, i) => (
                <tr key={i}>
                  <td>
                    <code style={{ fontSize: 12, color: "var(--cp-grey-800)" }}>{ev.timestamp}</code>
                  </td>
                  <td>
                    <b>{ev.eventType}</b>
                  </td>
                  <td>
                    <span>{(ev.confidence * 100).toFixed(0)}%</span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        ev.riskLevel === "Low"
                          ? "badge-ready"
                          : ev.riskLevel === "Medium"
                          ? "badge-developing"
                          : "badge-risk"
                      }`}
                    >
                      {ev.riskLevel}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-ghost"
                      style={{ fontSize: 12, padding: "2px 6px" }}
                      onClick={() => alert(`Reviewing recording snippet for event at ${ev.timestamp}`)}
                    >
                      Inspect Frame
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="modal-footer-bar">
          <button className="btn btn-secondary" onClick={onClose}>
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
