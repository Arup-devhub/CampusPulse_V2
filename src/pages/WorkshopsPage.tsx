import React, { useState } from "react";
import { BookOpen, Users, Calendar, CheckCircle2, TrendingUp, Plus, ArrowRight, Clock } from "lucide-react";
import { WorkshopCohort, Role } from "../types";

interface WorkshopsPageProps {
  workshops: WorkshopCohort[];
  role: Role;
  onOpenCreateModal: () => void;
  onOpenAttendanceModal: (ws: WorkshopCohort) => void;
  onToggleRegister: (id: string) => void;
}

const cohortsTable = [
  { skill: "Data Structures & Algorithms", students: 50, avgScore: 54, required: 75, priority: "Critical", drive: "TCS" },
  { skill: "C++ OOP & Memory Management", students: 37, avgScore: 57, required: 75, priority: "High", drive: "TCS" },
  { skill: "SQL Complex Joins & Indexing", students: 18, avgScore: 64, required: 70, priority: "Medium", drive: "Infosys" },
  { skill: "Technical Articulation & Defense", students: 12, avgScore: 66, required: 72, priority: "Medium", drive: "Deloitte" }
];

export const WorkshopsPage: React.FC<WorkshopsPageProps> = ({
  workshops,
  role,
  onOpenCreateModal,
  onOpenAttendanceModal,
  onToggleRegister
}) => {
  const isStudent = role === "Student";

  return (
    <div>
      <div className="page-header-block">
        <div>
          <span className="eyebrow-tag">College Intervention System</span>
          <h1 className="page-title">Workshops & Placement Interventions</h1>
          <p className="page-description">
            Transforms measured student skill gaps into targeted training bootcamps with mandatory pre/post assessments and verifiable readiness tracking.
          </p>
        </div>

        <div className="page-actions-group">
          {!isStudent && (
            <button className="btn btn-primary" onClick={onOpenCreateModal}>
              <Plus size={15} /> Create Workshop from Cohort
            </button>
          )}
        </div>
      </div>

      {/* Featured Intervention Banner */}
      <div className="workshop-hero-card">
        <div className="workshop-hero-content">
          <span className="eyebrow-tag" style={{ color: "var(--cp-grey-400)" }}>
            High-Priority Placement Intervention
          </span>
          <h2>DSA + C++ Placement Bootcamp</h2>
          <p>
            {isStudent
              ? "You were automatically targeted for this bootcamp because your measured DSA score is 54%, while TCS Digital requires 75% for Stage 2 coding clearance."
              : "50 students in CSE/IT are currently below the required DSA threshold for upcoming TCS recruitment. Mandatory 2-hour classroom intervention."}
          </p>

          <div className="tag-cluster">
            <span>Target Skill: DSA & DP</span>
            <span>Target Drive: TCS Digital</span>
            <span>Capacity: 50</span>
            <span>Instructor: Prof. S. Tripathy</span>
            <span>Venue: Lab 3</span>
          </div>

          <div>
            {isStudent ? (
              <button
                className="btn btn-primary"
                style={{ backgroundColor: "var(--cp-white)", color: "var(--cp-black)" }}
                onClick={() => onToggleRegister(workshops[0]?.id || "ws-001")}
              >
                <CheckCircle2 size={16} />
                <span>{workshops[0]?.userRegistered ? "Enrolled ✓ (View Schedule)" : "Register for Bootcamp"}</span>
              </button>
            ) : (
              <button
                className="btn btn-primary"
                style={{ backgroundColor: "var(--cp-white)", color: "var(--cp-black)" }}
                onClick={() => onOpenAttendanceModal(workshops[0])}
              >
                <span>Record Attendance & Review Impact</span>
                <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>

        <div className="workshop-hero-stats">
          <span style={{ color: "var(--cp-grey-400)", fontSize: 11, textTransform: "uppercase" }}>
            Target Benchmark
          </span>
          <strong style={{ fontSize: 32, margin: "6px 0 2px" }}>54% → 75%</strong>
          <span style={{ color: "var(--cp-grey-300)" }}>Cohort Size: 50 Students</span>
        </div>
      </div>

      {/* Intervention Overview Stats */}
      <div className="stat-kpi-grid">
        <div className="stat-kpi-card">
          <div className="stat-icon-square">
            <Users size={20} />
          </div>
          <div className="stat-kpi-info">
            <span className="stat-kpi-label">Targeted Students</span>
            <div className="stat-kpi-value">186</div>
            <span className="stat-kpi-delta neutral">Across 4 priority skill cohorts</span>
          </div>
        </div>

        <div className="stat-kpi-card">
          <div className="stat-icon-square">
            <Calendar size={20} />
          </div>
          <div className="stat-kpi-info">
            <span className="stat-kpi-label">Upcoming Sessions</span>
            <div className="stat-kpi-value">{workshops.length}</div>
            <span className="stat-kpi-delta warning">Scheduled next 14 days</span>
          </div>
        </div>

        <div className="stat-kpi-card">
          <div className="stat-icon-square">
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-kpi-info">
            <span className="stat-kpi-label">Average Attendance</span>
            <div className="stat-kpi-value">89%</div>
            <span className="stat-kpi-delta positive">+6% vs previous cycle</span>
          </div>
        </div>

        <div className="stat-kpi-card">
          <div className="stat-icon-square">
            <TrendingUp size={20} />
          </div>
          <div className="stat-kpi-info">
            <span className="stat-kpi-label">Average Readiness Gain</span>
            <div className="stat-kpi-value">+18.6%</div>
            <span className="stat-kpi-delta positive">Descriptive gain</span>
          </div>
        </div>
      </div>

      {/* Placement Officer View: Skill Gap Cohorts table */}
      {!isStudent && (
        <div className="cp-card" style={{ marginBottom: 24 }}>
          <div className="card-title-bar">
            <div>
              <h3>Skill Gap Cohorts Available for Intervention</h3>
              <p>Directly convert measured deficit groups into college-led workshops</p>
            </div>
            <button className="btn btn-sm btn-primary" onClick={onOpenCreateModal}>
              <Plus size={14} /> New Workshop
            </button>
          </div>

          <div className="table-container">
            <table className="cp-table">
              <thead>
                <tr>
                  <th>Target Deficit Skill</th>
                  <th>Impacted Students</th>
                  <th>Cohort Avg Score</th>
                  <th>Company Cutoff</th>
                  <th>Priority</th>
                  <th>Linked Placement Drive</th>
                  <th>Intervention Action</th>
                </tr>
              </thead>
              <tbody>
                {cohortsTable.map((row) => (
                  <tr key={row.skill}>
                    <td>
                      <b>{row.skill}</b>
                    </td>
                    <td>
                      <b>{row.students} students</b>
                    </td>
                    <td>{row.avgScore}%</td>
                    <td>{row.required}%</td>
                    <td>
                      <span
                        className={`badge ${
                          row.priority === "Critical"
                            ? "badge-risk"
                            : row.priority === "High"
                            ? "badge-developing"
                            : "badge-neutral"
                        }`}
                      >
                        {row.priority}
                      </span>
                    </td>
                    <td>{row.drive}</td>
                    <td>
                      <button className="btn btn-sm btn-secondary" onClick={onOpenCreateModal}>
                        Deploy Workshop <ArrowRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Active Workshops Directory */}
      <div className="cp-card">
        <div className="card-title-bar">
          <div>
            <h3>Active Placement Workshops</h3>
            <p>Registration, schedule details, and verified before/after results</p>
          </div>
        </div>

        <div className="table-container">
          <table className="cp-table">
            <thead>
              <tr>
                <th>Workshop Title</th>
                <th>Target Cohort</th>
                <th>Schedule & Venue</th>
                <th>Registration</th>
                <th>Verified Impact</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {workshops.map((ws) => (
                <tr key={ws.id}>
                  <td>
                    <b>{ws.title}</b>
                    <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>
                      {ws.linkedDrive} · {ws.deliveryMode}
                    </span>
                  </td>
                  <td>{ws.studentsAffected} students</td>
                  <td>
                    <span>{ws.date} · {ws.time}</span>
                    <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>{ws.venue}</span>
                  </td>
                  <td>
                    <b>{ws.registeredCount} / {ws.capacity}</b>
                  </td>
                  <td>
                    <span className="badge badge-ready">+{ws.requiredScore - ws.avgScoreBefore} pts avg</span>
                  </td>
                  <td>
                    <span className={`badge ${ws.status === "Full" ? "badge-developing" : "badge-ready"}`}>
                      {ws.status}
                    </span>
                  </td>
                  <td>
                    {isStudent ? (
                      <button
                        className={`btn btn-sm ${ws.userRegistered ? "btn-secondary" : "btn-primary"}`}
                        onClick={() => onToggleRegister(ws.id)}
                      >
                        {ws.userRegistered ? "Registered ✓" : "Register"}
                      </button>
                    ) : (
                      <button className="btn btn-sm btn-secondary" onClick={() => onOpenAttendanceModal(ws)}>
                        Attendance & Impact
                      </button>
                    )}
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
