import React, { useState } from "react";
import { Briefcase, Calendar, Users, Award, Plus, ArrowRight, CheckCircle2 } from "lucide-react";
import { initialDrives } from "../data/mockData";
import { PlacementDrive, Page } from "../types";

interface DrivesPageProps {
  onNavigate: (page: Page) => void;
}

export const DrivesPage: React.FC<DrivesPageProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState("All");

  const filtered = initialDrives.filter(
    (d) => filter === "All" || d.status === filter
  );

  return (
    <div>
      <div className="page-header-block">
        <div>
          <span className="eyebrow-tag">Recruitment Calendar</span>
          <h1 className="page-title">Campus Placement Drives</h1>
          <p className="page-description">
            Published placement opportunities, academic eligibility requirements, recruitment stages, and candidate pools.
          </p>
        </div>

        <div className="page-actions-group">
          <button className="btn btn-primary" onClick={() => alert("Drive creation modal will be launched.")}>
            <Plus size={15} /> Publish New Drive
          </button>
        </div>
      </div>

      <div className="table-filter-bar" style={{ background: "transparent", border: "none", padding: 0 }}>
        <div className="filter-controls">
          <select
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Drives</option>
            <option value="Active">Active Drives</option>
            <option value="Upcoming">Upcoming Drives</option>
          </select>
        </div>
      </div>

      {/* Grid of Placement Drives Cards */}
      <div className="grid-3col">
        {filtered.map((drive) => (
          <div key={drive.id} className="cp-card" style={{ display: "flex", flexDirection: "column" }}>
            <div className="card-title-bar">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "var(--cp-radius-sm)",
                    background: "var(--cp-near-black)",
                    color: "var(--cp-white)",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 700,
                    fontSize: 14
                  }}
                >
                  {drive.company[0]}
                </div>
                <div>
                  <h3 style={{ fontSize: 16 }}>{drive.company}</h3>
                  <span style={{ fontSize: 12, color: "var(--cp-grey-500)" }}>{drive.role}</span>
                </div>
              </div>

              <span className={`badge ${drive.status === "Active" ? "badge-ready" : "badge-neutral"}`}>
                {drive.status}
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                padding: "12px",
                background: "var(--cp-grey-50)",
                borderRadius: "var(--cp-radius-sm)",
                border: "1px solid var(--cp-grey-200)",
                margin: "12px 0 16px"
              }}
            >
              <div>
                <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>CTC Package</span>
                <b style={{ fontSize: 13, color: "var(--cp-black)" }}>{drive.package}</b>
              </div>
              <div>
                <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>Drive Date</span>
                <b style={{ fontSize: 13, color: "var(--cp-black)" }}>{drive.driveDate}</b>
              </div>
              <div>
                <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>Deadline</span>
                <span style={{ fontSize: 12, color: "var(--cp-grey-700)" }}>{drive.deadline}</span>
              </div>
              <div>
                <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>Min CGPA</span>
                <span style={{ fontSize: 12, color: "var(--cp-grey-700)" }}>{drive.minCgpa}+ & 0 Backlogs</span>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <span className="eyebrow-tag" style={{ fontSize: 10 }}>Recruitment Stages</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                {drive.stages.map((st, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 11,
                      padding: "2px 8px",
                      background: "var(--cp-grey-100)",
                      borderRadius: 4,
                      color: "var(--cp-grey-800)"
                    }}
                  >
                    {i + 1}. {st}
                  </span>
                ))}
              </div>
            </div>

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
              <div>
                <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>
                  {drive.candidatesCount} Candidates
                </span>
                <span className="badge badge-ready">{drive.avgReadiness}% Avg Ready</span>
              </div>

              <button
                className="btn btn-sm btn-primary"
                onClick={() => onNavigate("Readiness")}
              >
                Inspect Cohort <ArrowRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
