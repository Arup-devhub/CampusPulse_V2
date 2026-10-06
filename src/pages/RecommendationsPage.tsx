import React, { useState } from "react";
import { Zap, Clock, Target, ArrowRight, CheckCircle2, Filter } from "lucide-react";
import { initialRecommendations } from "../data/mockData";
import { Recommendation, Page } from "../types";

interface RecommendationsPageProps {
  onNavigate: (page: Page) => void;
  onStartAssessment: () => void;
  onStartInterview: () => void;
}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({
  onNavigate,
  onStartAssessment,
  onStartInterview
}) => {
  const [filter, setFilter] = useState<string>("All");
  const [completedIds, setCompletedIds] = useState<Record<string, boolean>>({});

  const handleAction = (rec: Recommendation) => {
    if (rec.category === "Coding" || rec.category === "Technical") {
      onStartAssessment();
    } else if (rec.category === "Interview") {
      onStartInterview();
    } else if (rec.category === "Resume") {
      onNavigate("Resumes");
    } else {
      onNavigate("Assessments");
    }
  };

  const toggleCompleted = (id: string) => {
    setCompletedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = initialRecommendations.filter(
    (r) => filter === "All" || r.category === filter || r.priority === filter
  );

  return (
    <div>
      <div className="page-header-block">
        <div>
          <span className="eyebrow-tag">Personalized Recommendation Engine</span>
          <h1 className="page-title">Actionable Placement Recommendations</h1>
          <p className="page-description">
            Prescriptive preparation tasks calculated from measured skill gaps and target company stage criteria.
          </p>
        </div>

        <div className="page-actions-group">
          <div className="filter-controls">
            <Filter size={15} style={{ color: "var(--cp-grey-500)" }} />
            <select
              className="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Categories & Priorities</option>
              <option value="Coding">Coding</option>
              <option value="Technical">Technical</option>
              <option value="Interview">Interview</option>
              <option value="Resume">Resume</option>
              <option value="High">High Priority Only</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
        {filtered.map((rec) => {
          const isDone = completedIds[rec.id];

          return (
            <div
              key={rec.id}
              className="cp-card"
              style={{
                display: "flex",
                flexDirection: "column",
                borderLeft: rec.priority === "High" ? "4px solid var(--cp-error)" : "4px solid var(--cp-warning)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span className="badge badge-dark">{rec.category}</span>
                    <span className={`badge ${rec.priority === "High" ? "badge-risk" : "badge-developing"}`}>
                      {rec.priority} Priority
                    </span>
                    <span className="badge badge-neutral">Target: {rec.companyTarget}</span>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--cp-black)" }}>{rec.title}</h3>
                </div>

                <button
                  className="btn-ghost"
                  onClick={() => toggleCompleted(rec.id)}
                  title={isDone ? "Mark as Incomplete" : "Mark as Completed"}
                >
                  <CheckCircle2 size={18} style={{ color: isDone ? "var(--cp-success)" : "var(--cp-grey-400)" }} />
                </button>
              </div>

              {/* Explicit 'Why' */}
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--cp-grey-500)", display: "block" }}>
                  Why This Is Recommended:
                </span>
                <p style={{ fontSize: 13, color: "var(--cp-grey-800)", marginTop: 2, lineHeight: 1.45 }}>
                  {rec.reason}
                </p>
              </div>

              {/* Expected impact */}
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--cp-grey-500)", display: "block" }}>
                  Expected Impact:
                </span>
                <p style={{ fontSize: 13, color: "var(--cp-grey-700)", marginTop: 2, lineHeight: 1.45 }}>
                  {rec.expectedImpact}
                </p>
              </div>

              {/* Footer info & action */}
              <div
                style={{
                  marginTop: "auto",
                  paddingTop: 14,
                  borderTop: "1px solid var(--cp-grey-200)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--cp-grey-600)" }}>
                  <Clock size={14} />
                  <span>Estimated effort: <b>{rec.estimatedEffort}</b></span>
                </div>

                <button
                  className={`btn btn-sm ${isDone ? "btn-secondary" : "btn-primary"}`}
                  onClick={() => handleAction(rec)}
                >
                  {isDone ? "Review Completed" : rec.actionText} <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
