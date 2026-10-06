import React, { useState } from "react";
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, User, Filter } from "lucide-react";
import { initialStudents } from "../data/mockData";
import { Student } from "../types";

export const AIMatchingPage: React.FC = () => {
  const [targetDrive, setTargetDrive] = useState("TCS — Digital Software Engineer");
  const [selectedStudent, setSelectedStudent] = useState<Student>(initialStudents[0]);

  // Explainable criteria map for students
  const matchDetails: Record<string, {
    matchScore: number;
    reasons: { type: "check" | "warn"; text: string }[];
  }> = {
    "std-001": {
      matchScore: 92,
      reasons: [
        { type: "check", text: "Verified Python and C++ OOP skills meet JD requirements" },
        { type: "check", text: "Meets 7.0+ CGPA benchmark (Candidate: 8.42)" },
        { type: "check", text: "Verified capstone project in distributed database systems" },
        { type: "check", text: "Strong assessment score (82% Aptitude Benchmark)" },
        { type: "warn", text: "DSA coding readiness is 55% (Enrolled in Bootcamp)" }
      ]
    },
    "std-002": {
      matchScore: 78,
      reasons: [
        { type: "check", text: "Meets 7.0+ CGPA benchmark (Candidate: 7.85)" },
        { type: "check", text: "Proficient in Java OOP fundamentals" },
        { type: "warn", text: "SQL and relational database querying needs evidence" },
        { type: "warn", text: "No verified cloud project documentation" }
      ]
    },
    "std-003": {
      matchScore: 96,
      reasons: [
        { type: "check", text: "Exemplary CGPA 9.12 with zero backlog history" },
        { type: "check", text: "Advanced Python and Cloud fundamentals verified" },
        { type: "check", text: "High assessment score (88% diagnostic benchmark)" },
        { type: "check", text: "Strong technical interview defense in previous round" }
      ]
    },
    "std-004": {
      matchScore: 54,
      reasons: [
        { type: "warn", text: "CGPA 6.94 is slightly below the 7.00 primary digital cutoff" },
        { type: "warn", text: "1 active backlog recorded in semester 5" },
        { type: "warn", text: "Coding readiness at 52% (Requires immediate intervention)" },
        { type: "check", text: "C programming and hardware interface background" }
      ]
    },
    "std-005": {
      matchScore: 88,
      reasons: [
        { type: "check", text: "Meets CGPA benchmark (8.65 with zero backlogs)" },
        { type: "check", text: "Strong Spring Boot & MySQL enterprise project" },
        { type: "check", text: "Consistent diagnostic score (79% Readiness)" },
        { type: "warn", text: "Awaiting final mock technical interview clearance" }
      ]
    },
    "std-006": {
      matchScore: 48,
      reasons: [
        { type: "warn", text: "CGPA 6.55 is below digital cutoff" },
        { type: "warn", text: "High risk classification (48% readiness)" },
        { type: "check", text: "Basic C++ concepts documented" }
      ]
    }
  };

  const currentDetails = matchDetails[selectedStudent.id] || matchDetails["std-001"];

  return (
    <div>
      <div className="page-header-block">
        <div>
          <span className="eyebrow-tag">Explainable Candidate Intelligence</span>
          <h1 className="page-title">AI Matching & Candidate Verification</h1>
          <p className="page-description">
            Transparently scores candidate compatibility against job descriptions using verified academic records, assessment scores, and project artifacts.
          </p>
        </div>

        <div className="page-actions-group">
          <label style={{ fontSize: 13, fontWeight: 600, color: "var(--cp-grey-700)" }}>
            Matching For Drive:
          </label>
          <select
            className="filter-select"
            value={targetDrive}
            onChange={(e) => setTargetDrive(e.target.value)}
            style={{ fontWeight: 600 }}
          >
            <option value="TCS — Digital Software Engineer">TCS — Digital Software Engineer (₹7.2 LPA)</option>
            <option value="Infosys — Specialist Programmer">Infosys — Specialist Programmer (₹6.5 LPA)</option>
            <option value="Deloitte — Technology Analyst">Deloitte — Technology Analyst (₹8.0 LPA)</option>
          </select>
        </div>
      </div>

      <div className="grid-2col">
        {/* Candidates Table */}
        <div className="cp-card">
          <div className="card-title-bar">
            <div>
              <h3>Candidate Pipeline & Match Scores</h3>
              <p>Click a candidate to inspect verified match criteria</p>
            </div>
          </div>

          <div className="table-container">
            <table className="cp-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Match Score</th>
                  <th>Readiness</th>
                  <th>Risk Level</th>
                  <th>Key Skills</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {initialStudents.map((std) => {
                  const details = matchDetails[std.id] || { matchScore: 75, reasons: [] };
                  const isSelected = selectedStudent.id === std.id;

                  return (
                    <tr
                      key={std.id}
                      style={{
                        cursor: "pointer",
                        backgroundColor: isSelected ? "var(--cp-grey-100)" : undefined
                      }}
                      onClick={() => setSelectedStudent(std)}
                    >
                      <td>
                        <b>{std.name}</b>
                        <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>
                          {std.regNo} · {std.branch.split(" ")[0]}
                        </span>
                      </td>
                      <td>
                        <b style={{ fontSize: 14 }}>{details.matchScore}%</b>
                      </td>
                      <td>{std.readiness}%</td>
                      <td>
                        <span
                          className={`badge ${
                            std.risk === "Ready"
                              ? "badge-ready"
                              : std.risk === "Developing"
                              ? "badge-developing"
                              : "badge-risk"
                          }`}
                        >
                          {std.risk}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: 12, color: "var(--cp-grey-700)" }}>
                          {std.topSkills.slice(0, 2).join(", ")}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-neutral">{std.placementStatus}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Explainable Decision Panel */}
        <div className="cp-card">
          <div className="card-title-bar">
            <div>
              <h3>Why this candidate matches?</h3>
              <p>Transparent deterministic verification checklist</p>
            </div>
            <span className="badge badge-dark">{currentDetails.matchScore}% Compatibility</span>
          </div>

          <div
            style={{
              padding: "16px",
              background: "var(--cp-grey-50)",
              border: "1px solid var(--cp-grey-200)",
              borderRadius: "var(--cp-radius-sm)",
              marginBottom: 20
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="user-avatar" style={{ width: 36, height: 36 }}>
                {selectedStudent.name[0]}
              </div>
              <div>
                <b style={{ fontSize: 14, color: "var(--cp-black)" }}>{selectedStudent.name}</b>
                <span style={{ fontSize: 12, color: "var(--cp-grey-500)", display: "block" }}>
                  {selectedStudent.regNo} · CGPA {selectedStudent.cgpa} · {selectedStudent.branch}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {currentDetails.reasons.map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  fontSize: 13,
                  lineHeight: 1.45
                }}
              >
                {r.type === "check" ? (
                  <CheckCircle2 size={16} style={{ color: "var(--cp-success)", marginTop: 2, flexShrink: 0 }} />
                ) : (
                  <AlertTriangle size={16} style={{ color: "var(--cp-warning)", marginTop: 2, flexShrink: 0 }} />
                )}
                <span style={{ color: r.type === "check" ? "var(--cp-grey-900)" : "var(--cp-grey-700)" }}>
                  {r.text}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--cp-grey-200)" }}>
            <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block", marginBottom: 12 }}>
              * Explanations are derived directly from verified student databases and official assessment results without black-box inference.
            </span>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn btn-secondary btn-block"
                onClick={() => alert(`Shortlisted ${selectedStudent.name} for ${targetDrive}`)}
              >
                Shortlist Candidate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
