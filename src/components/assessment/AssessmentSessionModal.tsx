import React, { useState, useEffect } from "react";
import {
  CheckCircle2, Clock, ShieldCheck, ArrowLeft, ArrowRight,
  Save, AlertTriangle, X
} from "lucide-react";

interface AssessmentSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  company?: string;
  onFinish: (score: number) => void;
}

interface Question {
  id: number;
  text: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
}

const mockQuestions: Question[] = [
  {
    id: 1,
    text: "Given an unsorted array of integers, which algorithm achieves O(N log N) worst-case time complexity while maintaining O(1) auxiliary space?",
    options: ["Merge Sort", "Quick Sort", "Heap Sort", "Insertion Sort"],
    correctIndex: 2
  },
  {
    id: 2,
    text: "In SQL, which clause is executed immediately after the WHERE filtering but prior to the SELECT projection?",
    options: ["ORDER BY", "GROUP BY", "HAVING", "LIMIT"],
    correctIndex: 1
  },
  {
    id: 3,
    text: "What is the primary consequence of encountering a cyclic dependency in a directed dependency graph during topological sorting?",
    options: [
      "The traversal halts with incomplete ordering because in-degree never reaches zero for cycle vertices",
      "The sorting falls back to Depth-First Search with O(V^2) complexity",
      "It generates duplicate vertex entries in the resultant sequence",
      "Memory leak occurs due to non-terminating stack frames"
    ],
    correctIndex: 0
  },
  {
    id: 4,
    text: "In C++, which of the following ensures that an object's destructor is invoked correctly when deleting a derived instance through a base pointer?",
    options: [
      "Declaring the base class destructor as virtual",
      "Declaring the destructor as inline",
      "Using static polymorphism via CRTP",
      "Explicitly invoking operator delete in the derived class"
    ],
    correctIndex: 0
  },
  {
    id: 5,
    text: "Which transaction isolation level prevents 'Dirty Read' and 'Non-repeatable Read' but may permit 'Phantom Read' in relational database systems?",
    options: ["Read Uncommitted", "Read Committed", "Repeatable Read", "Serializable"],
    correctIndex: 2
  }
];

export const AssessmentSessionModal: React.FC<AssessmentSessionModalProps> = ({
  isOpen,
  onClose,
  title = "TCS Digital Technical Screening Round",
  company = "TCS",
  onFinish
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(42 * 60 + 15); // 00:42:15
  const [lastAutosave, setLastAutosave] = useState("10:42:15");
  const [submitted, setSubmitted] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState(0);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || submitted) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, submitted]);

  // Periodic autosave simulation
  useEffect(() => {
    if (!isOpen || submitted) return;
    const autoSaver = setInterval(() => {
      const now = new Date();
      setLastAutosave(now.toTimeString().split(" ")[0]);
    }, 15000);
    return () => clearInterval(autoSaver);
  }, [isOpen, submitted]);

  if (!isOpen) return null;

  const currentQ = mockQuestions[currentIdx];

  const handleSelectOption = (optIdx: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optIdx
    }));
  };

  const handleNext = () => {
    if (currentIdx < mockQuestions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    let correct = 0;
    mockQuestions.forEach((q) => {
      if (answers[q.id] === q.correctIndex) {
        correct += 1;
      }
    });
    const finalScore = Math.round((correct / mockQuestions.length) * 100);
    setCalculatedScore(finalScore);
    setSubmitted(true);
    onFinish(finalScore);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `00:${m}:${s}`;
  };

  return (
    <div className="modal-backdrop-layer" role="dialog" aria-modal="true">
      <div className="modal-card-box modal-lg" style={{ height: "92vh" }}>
        {/* Top examination bar */}
        <div className="assessment-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <b>{company} | {title}</b>
            <div className="proctor-live-status">
              <span className="pulse-dot" />
              <span>Proctoring Active · Camera & Audio Connected</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="assessment-timer-badge">
              <Clock size={14} style={{ display: "inline", marginRight: 6, verticalAlign: "-2px" }} />
              {formatTimer(secondsRemaining)}
            </div>
            <button className="btn-ghost" onClick={onClose} style={{ color: "var(--cp-white)" }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {submitted ? (
          <div style={{ padding: "60px 40px", textAlign: "center", margin: "auto" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "var(--cp-success-bg)",
                color: "var(--cp-success)",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 20px"
              }}
            >
              <CheckCircle2 size={36} />
            </div>
            <h2>Assessment Submitted Successfully</h2>
            <p style={{ color: "var(--cp-grey-600)", margin: "8px 0 24px", fontSize: 14 }}>
              Your responses have been securely verified and logged against the official company benchmark.
            </p>
            <div
              style={{
                display: "inline-block",
                padding: "16px 32px",
                borderRadius: "var(--cp-radius-md)",
                background: "var(--cp-grey-50)",
                border: "1px solid var(--cp-grey-200)",
                marginBottom: 28
              }}
            >
              <span style={{ fontSize: 12, color: "var(--cp-grey-500)", textTransform: "uppercase", display: "block" }}>
                Measured Score
              </span>
              <strong style={{ fontSize: 36, color: "var(--cp-black)" }}>
                {calculatedScore}%
              </strong>
            </div>
            <div>
              <button className="btn btn-primary" onClick={onClose}>
                Return to Assessment Hub
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="assessment-body-split">
              {/* Question palette */}
              <div className="question-palette-panel">
                <span className="eyebrow-tag">Question Palette</span>
                <p style={{ fontSize: 12, color: "var(--cp-grey-500)" }}>
                  {Object.keys(answers).length} of {mockQuestions.length} answered
                </p>

                <div className="question-palette-grid">
                  {mockQuestions.map((q, idx) => {
                    const isAnswered = answers[q.id] !== undefined;
                    const isCurrent = idx === currentIdx;
                    return (
                      <button
                        key={q.id}
                        className={`question-palette-btn ${isCurrent ? "current" : isAnswered ? "answered" : ""}`}
                        onClick={() => setCurrentIdx(idx)}
                      >
                        Q{idx + 1} {isAnswered && !isCurrent ? "✓" : ""}
                      </button>
                    );
                  })}
                </div>

                <div style={{ marginTop: 24, padding: "12px", background: "var(--cp-white)", borderRadius: "var(--cp-radius-sm)", border: "1px solid var(--cp-grey-200)" }}>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-600)", display: "block", fontWeight: 600 }}>
                    Security & Proctoring
                  </span>
                  <p style={{ fontSize: 11, color: "var(--cp-grey-500)", marginTop: 4 }}>
                    Continuous attention tracking enabled. Do not navigate away from this window.
                  </p>
                </div>
              </div>

              {/* Question display & options */}
              <div className="question-workspace-panel">
                <div className="question-header">
                  <span className="eyebrow-tag">Question {currentIdx + 1} of {mockQuestions.length}</span>
                  <h4>{currentQ.text}</h4>
                </div>

                <div className="question-options-stack">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = answers[currentQ.id] === optIdx;
                    return (
                      <div
                        key={optIdx}
                        className={`option-choice-item ${isSelected ? "selected" : ""}`}
                        onClick={() => handleSelectOption(optIdx)}
                      >
                        <input
                          type="radio"
                          name={`q-${currentQ.id}`}
                          checked={isSelected}
                          onChange={() => handleSelectOption(optIdx)}
                        />
                        <span style={{ fontSize: 14, color: "var(--cp-black)" }}>{opt}</span>
                      </div>
                    );
                  })}
                </div>

                <div style={{ marginTop: "auto", fontSize: 12, color: "var(--cp-grey-500)" }}>
                  <span>Autosaved at {lastAutosave} · Session ID: ASM-9842</span>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="assessment-bottom-bar">
              <button
                className="btn btn-secondary"
                onClick={handlePrev}
                disabled={currentIdx === 0}
              >
                <ArrowLeft size={15} /> Previous
              </button>

              <div style={{ display: "flex", gap: 10 }}>
                {currentIdx < mockQuestions.length - 1 ? (
                  <button className="btn btn-secondary" onClick={handleNext}>
                    Save & Next <ArrowRight size={15} />
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={handleSubmit}>
                    Submit Assessment
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
