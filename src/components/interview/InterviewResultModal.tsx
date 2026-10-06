import React, { useEffect } from "react";
import { CheckCircle2, AlertTriangle, TrendingUp, X, Award, ArrowRight } from "lucide-react";
import { AIInterviewSession } from "../../types";

interface InterviewResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: AIInterviewSession;
}

export const InterviewResultModal: React.FC<InterviewResultModalProps> = ({
  isOpen,
  onClose,
  session
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
          <div>
            <h2>AI Technical Interview Evaluation</h2>
            <span style={{ fontSize: 12, color: "var(--cp-grey-500)" }}>
              {session.company} · {session.role} ({session.type} Stage)
            </span>
          </div>
          <button className="btn-ghost" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body-scroll">
          {/* Top score banner */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "180px 1fr",
              gap: 24,
              padding: "24px",
              background: "var(--cp-grey-50)",
              borderRadius: "var(--cp-radius-md)",
              border: "1px solid var(--cp-grey-200)",
              marginBottom: 24,
              alignItems: "center"
            }}
          >
            <div style={{ textAlign: "center", borderRight: "1px solid var(--cp-grey-200)", paddingRight: 20 }}>
              <span style={{ fontSize: 11, color: "var(--cp-grey-600)", textTransform: "uppercase", fontWeight: 700 }}>
                Overall Score
              </span>
              <div style={{ fontSize: 44, fontWeight: 800, color: "var(--cp-black)", margin: "4px 0" }}>
                {session.score || 78}
                <span style={{ fontSize: 16, color: "var(--cp-grey-500)", fontWeight: 400 }}>/100</span>
              </div>
              <span className="badge badge-ready">Ready for Stage 3</span>
            </div>

            <div>
              <b style={{ fontSize: 14, color: "var(--cp-black)", display: "block", marginBottom: 6 }}>
                Evaluation Synthesis
              </b>
              <p style={{ fontSize: 13, color: "var(--cp-grey-700)", lineHeight: 1.5 }}>
                {session.feedbackSummary ||
                  "Strong conceptual grasp of database deadlocks and graph traversals. Articulated algorithms clearly with structured step-by-step reasoning. Code complexity bounds were addressed accurately."}
              </p>
              <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block", marginTop: 8 }}>
                * Note: Model scores reflect structured technical rubrics and communication clarity, not psychometric or personal traits.
              </span>
            </div>
          </div>

          {/* Sub-scores breakdown */}
          <div style={{ marginBottom: 24 }}>
            <span className="eyebrow-tag">Component Rubric Breakdown</span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginTop: 10 }}>
              <div style={{ padding: 14, border: "1px solid var(--cp-grey-200)", borderRadius: "var(--cp-radius-sm)" }}>
                <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>Technical Rigor</span>
                <b style={{ fontSize: 20, color: "var(--cp-black)" }}>{session.technicalScore || 76}%</b>
                <div className="progress-track" style={{ marginTop: 6 }}>
                  <div className="progress-bar" style={{ width: `${session.technicalScore || 76}%` }} />
                </div>
              </div>

              <div style={{ padding: 14, border: "1px solid var(--cp-grey-200)", borderRadius: "var(--cp-radius-sm)" }}>
                <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>Answer Relevance</span>
                <b style={{ fontSize: 20, color: "var(--cp-black)" }}>{session.relevanceScore || 82}%</b>
                <div className="progress-track" style={{ marginTop: 6 }}>
                  <div className="progress-bar" style={{ width: `${session.relevanceScore || 82}%` }} />
                </div>
              </div>

              <div style={{ padding: 14, border: "1px solid var(--cp-grey-200)", borderRadius: "var(--cp-radius-sm)" }}>
                <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>Problem Solving</span>
                <b style={{ fontSize: 20, color: "var(--cp-black)" }}>{session.problemSolvingScore || 74}%</b>
                <div className="progress-track" style={{ marginTop: 6 }}>
                  <div className="progress-bar" style={{ width: `${session.problemSolvingScore || 74}%` }} />
                </div>
              </div>

              <div style={{ padding: 14, border: "1px solid var(--cp-grey-200)", borderRadius: "var(--cp-radius-sm)" }}>
                <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>Articulation</span>
                <b style={{ fontSize: 20, color: "var(--cp-black)" }}>{session.communicationScore || 80}%</b>
                <div className="progress-track" style={{ marginTop: 6 }}>
                  <div className="progress-bar" style={{ width: `${session.communicationScore || 80}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Actionable improvement areas */}
          <div>
            <span className="eyebrow-tag">Targeted Areas for Improvement</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
              {(session.areasToImprove || [
                "Clarify worst-case space complexity tradeoffs before writing recursive routines",
                "Structure technical answers with context, constraint, implementation, and verification steps",
                "Practice concurrency and thread-safety explanations for backend enterprise microservices"
              ]).map((area, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 14px",
                    background: "var(--cp-white)",
                    border: "1px solid var(--cp-grey-200)",
                    borderRadius: "var(--cp-radius-sm)"
                  }}
                >
                  <AlertTriangle size={15} style={{ color: "var(--cp-warning)", flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "var(--cp-grey-800)" }}>{area}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer-bar">
          <button className="btn btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
