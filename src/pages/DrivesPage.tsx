import React, { useState } from "react";
import { Briefcase, Calendar, Users, Award, Plus, ArrowRight, CheckCircle2, X } from "lucide-react";
import { initialDrives } from "../data/mockData";
import { PlacementDrive, Page } from "../types";

interface DrivesPageProps {
  onNavigate: (page: Page) => void;
}

export const DrivesPage: React.FC<DrivesPageProps> = ({ onNavigate }) => {
  const [drives, setDrives] = useState<PlacementDrive[]>(initialDrives);
  const [filter, setFilter] = useState("All");
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [activeDriveDetails, setActiveDriveDetails] = useState<PlacementDrive | null>(null);

  // New Drive Form
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [pkg, setPkg] = useState("₹7.0 LPA");
  const [deadline, setDeadline] = useState("Nov 15, 2026");
  const [driveDate, setDriveDate] = useState("Nov 22, 2026");
  const [minCgpa, setMinCgpa] = useState("7.0");

  const filtered = drives.filter(
    (d) => filter === "All" || d.status === filter
  );

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role) return;

    const newDrive: PlacementDrive = {
      id: `drv-${Date.now()}`,
      company,
      role,
      package: pkg,
      deadline,
      driveDate,
      eligibility: `B.Tech CSE/IT with CGPA >= ${minCgpa}`,
      minCgpa: parseFloat(minCgpa) || 7.0,
      stages: ["Online Assessment", "Technical Defense", "HR Interview"],
      candidatesCount: 120,
      avgReadiness: 72,
      status: "Active"
    };

    setDrives((prev) => [newDrive, ...prev]);
    setIsPublishModalOpen(false);
    setCompany("");
    setRole("");
  };

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
          <button className="btn btn-primary" onClick={() => setIsPublishModalOpen(true)}>
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

              <div style={{ display: "flex", gap: 6 }}>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => setActiveDriveDetails(drive)}
                >
                  Details
                </button>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => onNavigate("Readiness")}
                >
                  Cohort <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PUBLISH DRIVE MODAL */}
      {isPublishModalOpen && (
        <div className="modal-backdrop-layer" onClick={() => setIsPublishModalOpen(false)} role="dialog" aria-modal="true">
          <div className="modal-card-box" onClick={(e) => e.stopPropagation()} style={{ width: "min(560px, 94vw)" }}>
            <div className="modal-header-bar">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Briefcase size={18} />
                <div>
                  <h2>Publish New Placement Drive</h2>
                  <span style={{ fontSize: 12, color: "var(--cp-grey-500)" }}>Register corporate recruitment visiting schedule</span>
                </div>
              </div>
              <button className="btn-ghost" onClick={() => setIsPublishModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePublishSubmit}>
              <div className="modal-body-scroll">
                <div className="form-row-2col">
                  <div className="form-group">
                    <label className="form-label">Corporate Partner *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Cisco Systems, Google, Oracle"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role Title *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Software Engineer"
                      required
                    />
                  </div>
                </div>

                <div className="form-row-2col">
                  <div className="form-group">
                    <label className="form-label">Package (CTC)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={pkg}
                      onChange={(e) => setPkg(e.target.value)}
                      placeholder="₹8.5 LPA"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Min CGPA Threshold</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-input"
                      value={minCgpa}
                      onChange={(e) => setMinCgpa(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row-2col">
                  <div className="form-group">
                    <label className="form-label">Application Deadline</label>
                    <input
                      type="text"
                      className="form-input"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Drive Assessment Date</label>
                    <input
                      type="text"
                      className="form-input"
                      value={driveDate}
                      onChange={(e) => setDriveDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer-bar">
                <button type="button" className="btn btn-secondary" onClick={() => setIsPublishModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Drive Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DRIVE DETAILS MODAL */}
      {activeDriveDetails && (
        <div className="modal-backdrop-layer" onClick={() => setActiveDriveDetails(null)} role="dialog" aria-modal="true">
          <div className="modal-card-box" onClick={(e) => e.stopPropagation()} style={{ width: "min(600px, 94vw)" }}>
            <div className="modal-header-bar">
              <div>
                <h2>{activeDriveDetails.company} — {activeDriveDetails.role}</h2>
                <span style={{ fontSize: 12, color: "var(--cp-grey-500)" }}>Drive ID: {activeDriveDetails.id}</span>
              </div>
              <button className="btn-ghost" onClick={() => setActiveDriveDetails(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-scroll">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: 16, background: "var(--cp-grey-50)", borderRadius: "var(--cp-radius-sm)", marginBottom: 16 }}>
                <div>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-500)" }}>Package</span>
                  <b style={{ display: "block", fontSize: 15 }}>{activeDriveDetails.package}</b>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-500)" }}>Eligibility</span>
                  <b style={{ display: "block", fontSize: 13 }}>{activeDriveDetails.eligibility}</b>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-500)" }}>Drive Date</span>
                  <span style={{ display: "block", fontSize: 13 }}>{activeDriveDetails.driveDate}</span>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-500)" }}>Eligible Batch Size</span>
                  <span style={{ display: "block", fontSize: 13 }}>{activeDriveDetails.candidatesCount} Students</span>
                </div>
              </div>

              <div>
                <span className="eyebrow-tag">Recruitment Sequence</span>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                  {activeDriveDetails.stages.map((st, i) => (
                    <div key={i} style={{ padding: "10px 12px", border: "1px solid var(--cp-grey-200)", borderRadius: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span><b>Stage {i + 1}:</b> {st}</span>
                      <span className="badge badge-neutral">Stage Benchmark Active</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer-bar">
              <button className="btn btn-secondary" onClick={() => setActiveDriveDetails(null)}>
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setActiveDriveDetails(null);
                  onNavigate("Readiness");
                }}
              >
                View Target Cohort
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
