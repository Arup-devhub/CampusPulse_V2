import React, { useState } from "react";
import { ClipboardCheck, Users, ShieldCheck, TrendingUp, Plus, Clock, Play } from "lucide-react";
import { initialAssessments } from "../data/mockData";
import { AssessmentItem } from "../types";

interface AssessmentsPageProps {
  onTakeAssessment: (assessment: AssessmentItem) => void;
  onOpenProctoringInspector: (assessment: AssessmentItem) => void;
}

export const AssessmentsPage: React.FC<AssessmentsPageProps> = ({
  onTakeAssessment,
  onOpenProctoringInspector
}) => {
  const [filterType, setFilterType] = useState<string>("All");

  const filtered = initialAssessments.filter(
    (a) => filterType === "All" || a.type === filterType
  );

  return (
    <div>
      <div className="page-header-block">
        <div>
          <span className="eyebrow-tag">Assessment Center</span>
          <h1 className="page-title">Diagnostic & Placement Assessments</h1>
          <p className="page-description">
            Company-specific MCQ, algorithmic coding tests, and aptitude screening with integrated probabilistic proctoring.
          </p>
        </div>

        <div className="page-actions-group">
          <button
            className="btn btn-primary"
            onClick={() => onTakeAssessment(initialAssessments[0])}
          >
            <Play size={15} /> Launch Practice Assessment
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stat-kpi-grid">
        <div className="stat-kpi-card">
          <div className="stat-icon-square">
            <ClipboardCheck size={20} />
          </div>
          <div className="stat-kpi-info">
            <span className="stat-kpi-label">Active Assessments</span>
            <div className="stat-kpi-value">12</div>
            <span className="stat-kpi-delta positive">4 scheduled this week</span>
          </div>
        </div>

        <div className="stat-kpi-card">
          <div className="stat-icon-square">
            <Users size={20} />
          </div>
          <div className="stat-kpi-info">
            <span className="stat-kpi-label">Total Attempts Logged</span>
            <div className="stat-kpi-value">1,008</div>
            <span className="stat-kpi-delta positive">92% avg completion</span>
          </div>
        </div>

        <div className="stat-kpi-card">
          <div className="stat-icon-square">
            <TrendingUp size={20} />
          </div>
          <div className="stat-kpi-info">
            <span className="stat-kpi-label">Average Cohort Score</span>
            <div className="stat-kpi-value">71%</div>
            <span className="stat-kpi-delta positive">+6 pts post-workshop</span>
          </div>
        </div>

        <div className="stat-kpi-card">
          <div className="stat-icon-square">
            <ShieldCheck size={20} />
          </div>
          <div className="stat-kpi-info">
            <span className="stat-kpi-label">Proctoring Signals Flagged</span>
            <div className="stat-kpi-value">26</div>
            <span className="stat-kpi-delta warning">Review required: 4</span>
          </div>
        </div>
      </div>

      {/* Assessments List Table */}
      <div className="cp-card">
        <div className="card-title-bar">
          <div>
            <h3>Assessment Schedule & Results</h3>
            <p>Live candidate testing and proctoring signal audit</p>
          </div>

          <div className="filter-controls">
            <select
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Technical">Technical</option>
              <option value="Aptitude">Aptitude</option>
              <option value="Coding">Coding</option>
              <option value="Company-Specific">Company-Specific</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="cp-table">
            <thead>
              <tr>
                <th>Assessment Name</th>
                <th>Category</th>
                <th>Target Company</th>
                <th>Duration</th>
                <th>Attempts</th>
                <th>Avg. Score</th>
                <th>Proctoring Signals</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((asm) => (
                <tr key={asm.id}>
                  <td>
                    <b>{asm.title}</b>
                  </td>
                  <td>{asm.type}</td>
                  <td>{asm.company}</td>
                  <td>{asm.durationMinutes} min</td>
                  <td>{asm.attemptsCount}</td>
                  <td>
                    <b>{asm.avgScore}%</b>
                  </td>
                  <td>
                    <button
                      className="btn-ghost"
                      style={{ fontSize: 12, padding: "2px 6px", display: "inline-flex", alignItems: "center", gap: 4 }}
                      onClick={() => onOpenProctoringInspector(asm)}
                    >
                      <ShieldCheck size={14} style={{ color: "var(--cp-grey-700)" }} />
                      <span>{asm.proctoringEventsCount} signals</span>
                    </button>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        asm.status === "Live"
                          ? "badge-ready"
                          : asm.status === "Review"
                          ? "badge-developing"
                          : "badge-neutral"
                      }`}
                    >
                      {asm.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-sm btn-primary" onClick={() => onTakeAssessment(asm)}>
                        Take Test
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
