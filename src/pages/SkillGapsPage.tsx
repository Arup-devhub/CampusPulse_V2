import React from "react";
import { AlertTriangle, BookOpen, ArrowRight, Code, Database, MessageSquare } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Page } from "../types";
import { initialSkillGaps } from "../data/mockData";

interface SkillGapsPageProps {
  onOpenWorkshopBuilder: () => void;
  onNavigate: (page: Page) => void;
}

const skillDataChart = [
  { skill: "DSA", students: 50 },
  { skill: "C++", students: 37 },
  { skill: "SQL", students: 18 },
  { skill: "Communication", students: 12 },
  { skill: "OS / Threads", students: 9 }
];

export const SkillGapsPage: React.FC<SkillGapsPageProps> = ({
  onOpenWorkshopBuilder,
  onNavigate
}) => {
  return (
    <div>
      <div className="page-header-block">
        <div>
          <span className="eyebrow-tag">Cohort Placement Intelligence</span>
          <h1 className="page-title">Skill Gap Analysis & Intervention Matrix</h1>
          <p className="page-description">
            Compares verified student skill levels directly against company recruitment cutoffs to detect barrier gaps.
          </p>
        </div>

        <div className="page-actions-group">
          <button className="btn btn-primary" onClick={onOpenWorkshopBuilder}>
            <BookOpen size={15} /> Create Workshop from Cohort
          </button>
        </div>
      </div>

      {/* Top metrics row */}
      <div className="stat-kpi-grid">
        <div className="stat-kpi-card">
          <div className="stat-icon-square">
            <AlertTriangle size={20} />
          </div>
          <div className="stat-kpi-info">
            <span className="stat-kpi-label">Students with Critical Gaps</span>
            <div className="stat-kpi-value">186</div>
            <span className="stat-kpi-delta critical">14 require intervention today</span>
          </div>
        </div>

        <div className="stat-kpi-card">
          <div className="stat-icon-square">
            <Code size={20} />
          </div>
          <div className="stat-kpi-info">
            <span className="stat-kpi-label">Highest Priority Gap</span>
            <div className="stat-kpi-value">DSA & DP</div>
            <span className="stat-kpi-delta warning">50 students below 75% cutoff</span>
          </div>
        </div>

        <div className="stat-kpi-card">
          <div className="stat-icon-square">
            <Database size={20} />
          </div>
          <div className="stat-kpi-info">
            <span className="stat-kpi-label">Secondary Technical Gap</span>
            <div className="stat-kpi-value">SQL & DBMS</div>
            <span className="stat-kpi-delta neutral">18 students below 70%</span>
          </div>
        </div>

        <div className="stat-kpi-card">
          <div className="stat-icon-square">
            <BookOpen size={20} />
          </div>
          <div className="stat-kpi-info">
            <span className="stat-kpi-label">Bootcamp Conversion</span>
            <div className="stat-kpi-value">72%</div>
            <span className="stat-kpi-delta positive">+18 pts post-workshop</span>
          </div>
        </div>
      </div>

      {/* Split chart & intervention queue */}
      <div className="grid-2col">
        <div className="cp-card">
          <div className="card-title-bar">
            <div>
              <h3>Students Affected by Measured Skill Gap</h3>
              <p>Active placement batch across CSE, IT, and ECE branches</p>
            </div>
          </div>

          <div style={{ height: 260, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillDataChart} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e5e5" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#666", fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="skill"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#333", fontSize: 12 }}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    border: "none",
                    borderRadius: 6,
                    color: "#fff",
                    fontSize: 12
                  }}
                />
                <Bar dataKey="students" fill="#242424" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="cp-card">
          <div className="card-title-bar">
            <div>
              <h3>Direct Intervention Queue</h3>
              <p>Form workshops instantly for impacted candidate groups</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {initialSkillGaps.slice(0, 3).map((gap) => (
              <div
                key={gap.skill}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px",
                  borderRadius: "var(--cp-radius-sm)",
                  border: "1px solid var(--cp-grey-200)",
                  background: "var(--cp-white)"
                }}
              >
                <div>
                  <b style={{ fontSize: 13, color: "var(--cp-black)", display: "block" }}>{gap.skill}</b>
                  <span style={{ fontSize: 12, color: "var(--cp-grey-500)" }}>
                    {gap.studentsAffected} students · Drive: {gap.linkedCompany}
                  </span>
                </div>

                <button className="btn btn-sm btn-primary" onClick={onOpenWorkshopBuilder}>
                  Create Workshop
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 18 }}>
            <button className="btn btn-secondary btn-block" onClick={() => onNavigate("Workshops")}>
              View All Active Workshops <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Complete Company Requirements vs Student Skills Matrix */}
      <div className="cp-card">
        <div className="card-title-bar">
          <div>
            <h3>Skill Gap Matrix: Company Benchmark vs Candidate Score</h3>
            <p>Identifies exact criteria blocking shortlisting across drives</p>
          </div>
        </div>

        <div className="table-container">
          <table className="cp-table">
            <thead>
              <tr>
                <th>Skill Name</th>
                <th>Company Required Level</th>
                <th>Measured Cohort Score</th>
                <th>Cutoff Score</th>
                <th>Observed Gap</th>
                <th>Priority</th>
                <th>Target Drive</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {initialSkillGaps.map((gap) => (
                <tr key={gap.skill}>
                  <td>
                    <b>{gap.skill}</b>
                  </td>
                  <td>{gap.required}</td>
                  <td>
                    <b>{gap.score}%</b>
                  </td>
                  <td>{gap.requiredScore}%</td>
                  <td>
                    <span style={{ color: gap.gap < 0 ? "var(--cp-error)" : "var(--cp-success)", fontWeight: 700 }}>
                      {gap.gap > 0 ? `+${gap.gap}` : gap.gap} pts
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        gap.priority === "Critical"
                          ? "badge-risk"
                          : gap.priority === "High"
                          ? "badge-developing"
                          : "badge-neutral"
                      }`}
                    >
                      {gap.priority}
                    </span>
                  </td>
                  <td>{gap.linkedCompany}</td>
                  <td>
                    <button className="btn btn-sm btn-ghost" onClick={onOpenWorkshopBuilder}>
                      Intervene <ArrowRight size={12} />
                    </button>
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
