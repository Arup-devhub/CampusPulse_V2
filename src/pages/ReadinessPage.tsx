import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, ArrowRight, TrendingUp, ShieldCheck } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Page } from "../types";

interface ReadinessPageProps {
  onNavigate: (page: Page) => void;
  onOpenWorkshop: () => void;
}

const companyData: Record<string, {
  overall: number;
  status: "Ready" | "Developing" | "At Risk";
  stages: { name: string; score: number; status: "Ready" | "Developing" | "At Risk" }[];
  history: { name: string; value: number }[];
  gaps: { skill: string; current: number; required: number; priority: "Critical" | "High" | "Medium" }[];
}> = {
  TCS: {
    overall: 74,
    status: "Ready",
    stages: [
      { name: "Aptitude & Reasoning", score: 82, status: "Ready" },
      { name: "Technical MCQ", score: 61, status: "Developing" },
      { name: "Coding & DSA", score: 55, status: "At Risk" },
      { name: "Technical Interview", score: 74, status: "Ready" }
    ],
    history: [
      { name: "Baseline", value: 54 },
      { name: "Diagnostic", value: 61 },
      { name: "Bootcamp", value: 68 },
      { name: "Reassessment", value: 74 }
    ],
    gaps: [
      { skill: "Data Structures & Algorithms", current: 55, required: 75, priority: "Critical" },
      { skill: "C++ Memory & OOP", current: 58, required: 75, priority: "High" },
      { skill: "SQL Queries & Indexing", current: 62, required: 70, priority: "Medium" }
    ]
  },
  Infosys: {
    overall: 71,
    status: "Ready",
    stages: [
      { name: "InfyTQ Aptitude", score: 85, status: "Ready" },
      { name: "Technical Core", score: 66, status: "Developing" },
      { name: "Hands-on Coding", score: 62, status: "Developing" },
      { name: "Behavioral & HR", score: 80, status: "Ready" }
    ],
    history: [
      { name: "Baseline", value: 50 },
      { name: "Diagnostic", value: 58 },
      { name: "Bootcamp", value: 65 },
      { name: "Reassessment", value: 71 }
    ],
    gaps: [
      { skill: "Relational Database Joins", current: 60, required: 70, priority: "High" },
      { skill: "Java OOP Principles", current: 64, required: 70, priority: "Medium" }
    ]
  },
  Deloitte: {
    overall: 68,
    status: "Developing",
    stages: [
      { name: "Versant English", score: 84, status: "Ready" },
      { name: "Cognitive Problem Solving", score: 72, status: "Ready" },
      { name: "System Fundamentals", score: 54, status: "At Risk" },
      { name: "Case Study & Partner Round", score: 66, status: "Developing" }
    ],
    history: [
      { name: "Baseline", value: 48 },
      { name: "Diagnostic", value: 55 },
      { name: "Bootcamp", value: 62 },
      { name: "Reassessment", value: 68 }
    ],
    gaps: [
      { skill: "Cloud Architecture Basics", current: 52, required: 70, priority: "Critical" },
      { skill: "Case Defense Articulation", current: 65, required: 72, priority: "Medium" }
    ]
  },
  Wipro: {
    overall: 61,
    status: "At Risk",
    stages: [
      { name: "Quantitative Aptitude", score: 70, status: "Ready" },
      { name: "Verbal Ability", score: 68, status: "Developing" },
      { name: "Coding Logic", score: 48, status: "At Risk" },
      { name: "Technical Viva", score: 60, status: "Developing" }
    ],
    history: [
      { name: "Baseline", value: 42 },
      { name: "Diagnostic", value: 49 },
      { name: "Bootcamp", value: 55 },
      { name: "Reassessment", value: 61 }
    ],
    gaps: [
      { skill: "Array & Matrix Algorithms", current: 48, required: 70, priority: "Critical" }
    ]
  },
  Accenture: {
    overall: 79,
    status: "Ready",
    stages: [
      { name: "Cognitive Assessment", score: 86, status: "Ready" },
      { name: "Technical Assessment", score: 75, status: "Ready" },
      { name: "Coding Test", score: 72, status: "Ready" },
      { name: "Communication Assessment", score: 82, status: "Ready" }
    ],
    history: [
      { name: "Baseline", value: 62 },
      { name: "Diagnostic", value: 68 },
      { name: "Bootcamp", value: 74 },
      { name: "Reassessment", value: 79 }
    ],
    gaps: [
      { skill: "Microservice Concepts", current: 68, required: 72, priority: "Medium" }
    ]
  }
};

export const ReadinessPage: React.FC<ReadinessPageProps> = ({ onNavigate, onOpenWorkshop }) => {
  const [selectedCompany, setSelectedCompany] = useState("TCS");
  const data = companyData[selectedCompany] || companyData.TCS;

  return (
    <div>
      <div className="page-header-block">
        <div>
          <span className="eyebrow-tag">Placement Readiness Engine</span>
          <h1 className="page-title">Company-Specific Student Readiness & Risk</h1>
          <p className="page-description">
            Evaluates measured student capabilities against strict recruitment stage cutoffs before campus drives begin.
          </p>
        </div>

        <div className="page-actions-group">
          <label style={{ fontSize: 13, fontWeight: 600, color: "var(--cp-grey-700)" }}>
            Select Target Company:
          </label>
          <select
            className="filter-select"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            style={{ fontWeight: 600 }}
          >
            <option value="TCS">Tata Consultancy Services (TCS)</option>
            <option value="Infosys">Infosys</option>
            <option value="Deloitte">Deloitte</option>
            <option value="Wipro">Wipro</option>
            <option value="Accenture">Accenture</option>
          </select>
        </div>
      </div>

      {/* Top 3-Card Summary Overview */}
      <div className="grid-3col">
        {/* Overall score card */}
        <div className="cp-card">
          <div className="card-title-bar">
            <div>
              <h3>Overall Readiness</h3>
              <p>Target: {selectedCompany}</p>
            </div>
            <span
              className={`badge ${
                data.status === "Ready" ? "badge-ready" : data.status === "Developing" ? "badge-developing" : "badge-risk"
              }`}
            >
              {data.status}
            </span>
          </div>

          <div className="readiness-score-display">
            <div className="score-number">{data.overall}%</div>
            <div className="score-sub">
              {data.overall >= 70
                ? "Above primary shortlisting threshold"
                : "At risk of elimination in coding stage"}
            </div>
          </div>

          <p style={{ fontSize: 12, color: "var(--cp-grey-600)", lineHeight: 1.5 }}>
            Readiness improved by 8 points after the latest college diagnostic and bootcamp cycle.
          </p>
        </div>

        {/* Stage analysis card */}
        <div className="cp-card">
          <div className="card-title-bar">
            <div>
              <h3>Recruitment Stage Analysis</h3>
              <p>Stage cutoffs for {selectedCompany}</p>
            </div>
          </div>

          <div className="stage-breakdown-list">
            {data.stages.map((st) => (
              <div key={st.name} className="stage-item-row">
                <div className="stage-label-meta">
                  <b>{st.name}</b>
                  <span>{st.score}% · {st.status}</span>
                </div>
                <div className="progress-track">
                  <div
                    className={`progress-bar ${
                      st.status === "Ready" ? "success" : st.status === "Developing" ? "warning" : "danger"
                    }`}
                    style={{ width: `${st.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Eligibility criteria check */}
        <div className="cp-card">
          <div className="card-title-bar">
            <div>
              <h3>Academic Eligibility</h3>
              <p>Company Criteria Verification</p>
            </div>
            <CheckCircle2 size={18} style={{ color: "var(--cp-success)" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--cp-grey-100)", fontSize: 13 }}>
              <span style={{ color: "var(--cp-grey-600)" }}>CGPA Benchmark</span>
              <b>8.42 / 7.00 (Eligible ✓)</b>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--cp-grey-100)", fontSize: 13 }}>
              <span style={{ color: "var(--cp-grey-600)" }}>Active Backlogs</span>
              <b>0 / 0 Max (Eligible ✓)</b>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--cp-grey-100)", fontSize: 13 }}>
              <span style={{ color: "var(--cp-grey-600)" }}>Branch Allowed</span>
              <b>CSE (Eligible ✓)</b>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13 }}>
              <span style={{ color: "var(--cp-grey-600)" }}>Verified Resume Match</span>
              <b>86% Strong Alignment</b>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <button className="btn btn-secondary btn-block" onClick={() => onNavigate("Resumes")}>
              View Verified Resume
            </button>
          </div>
        </div>
      </div>

      {/* Historical progress & Priority skill gaps */}
      <div className="grid-2col">
        <div className="cp-card">
          <div className="card-title-bar">
            <div>
              <h3>Intervention Progression History</h3>
              <p>Readiness score gains across diagnostic assessments and bootcamps</p>
            </div>
          </div>

          <div style={{ height: 260, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#666", fontSize: 12 }} />
                <YAxis domain={[35, 85]} axisLine={false} tickLine={false} tick={{ fill: "#666", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    border: "none",
                    borderRadius: 6,
                    color: "#fff",
                    fontSize: 12
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="#111111" strokeWidth={2.5} fill="#11111114" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="cp-card">
          <div className="card-title-bar">
            <div>
              <h3>Priority Skill Gaps</h3>
              <p>Skills directly blocking {selectedCompany} shortlisting</p>
            </div>
            <button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => onNavigate("Skill Gaps")}>
              All Gaps
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {data.gaps.map((gap) => (
              <div
                key={gap.skill}
                style={{
                  padding: "14px",
                  borderRadius: "var(--cp-radius-sm)",
                  border: "1px solid var(--cp-grey-200)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <b style={{ fontSize: 13, color: "var(--cp-black)" }}>{gap.skill}</b>
                  <span
                    className={`badge ${
                      gap.priority === "Critical" ? "badge-risk" : gap.priority === "High" ? "badge-developing" : "badge-neutral"
                    }`}
                  >
                    {gap.priority}
                  </span>
                </div>

                <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 12, color: "var(--cp-grey-600)" }}>
                  <span>Current: <b>{gap.current}%</b></span>
                  <span>Required: <b>{gap.required}%</b></span>
                  <span style={{ color: "var(--cp-error)", fontWeight: 600 }}>
                    Gap: -{gap.required - gap.current} pts
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16 }}>
            <button className="btn btn-primary btn-block" onClick={onOpenWorkshop}>
              Enroll in Targeted Workshop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
