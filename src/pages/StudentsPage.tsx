import React, { useState } from "react";
import { Users, Filter, Search, ArrowRight, X, ExternalLink, Github, Linkedin } from "lucide-react";
import { initialStudents } from "../data/mockData";
import { Student } from "../types";

export const StudentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);

  const filteredStudents = initialStudents.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.regNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBranch = branchFilter === "All" || s.branch.includes(branchFilter);
    const matchesRisk = riskFilter === "All" || s.risk === riskFilter;
    return matchesSearch && matchesBranch && matchesRisk;
  });

  return (
    <div>
      <div className="page-header-block">
        <div>
          <span className="eyebrow-tag">Student Placement Roster</span>
          <h1 className="page-title">Registered Students & Readiness Directory</h1>
          <p className="page-description">
            Comprehensive operational registry of students, academic standing, measured readiness scores, and placement statuses.
          </p>
        </div>
      </div>

      <div className="cp-card">
        {/* Filter Bar */}
        <div className="table-filter-bar">
          <div className="filter-controls">
            <input
              type="text"
              placeholder="Search by name or reg no..."
              className="filter-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 240 }}
            />

            <select
              className="filter-select"
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
            >
              <option value="All">All Branches</option>
              <option value="Computer Science">Computer Science & Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics">Electronics & Communication</option>
              <option value="Electrical">Electrical & Electronics</option>
            </select>

            <select
              className="filter-select"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
            >
              <option value="All">All Risk Profiles</option>
              <option value="Ready">Ready</option>
              <option value="Developing">Developing</option>
              <option value="At Risk">At Risk</option>
            </select>
          </div>

          <span style={{ fontSize: 12, color: "var(--cp-grey-500)" }}>
            Showing {filteredStudents.length} of {initialStudents.length} candidates
          </span>
        </div>

        {/* Students Table */}
        <div className="table-container">
          <table className="cp-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Registration No.</th>
                <th>Branch & Sem</th>
                <th>CGPA</th>
                <th>Readiness</th>
                <th>Risk Level</th>
                <th>Top Skills</th>
                <th>Placement Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((std) => (
                <tr key={std.id}>
                  <td>
                    <b>{std.name}</b>
                    <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>
                      {std.email}
                    </span>
                  </td>
                  <td>
                    <code style={{ fontSize: 12 }}>{std.regNo}</code>
                  </td>
                  <td>
                    <span>{std.branch.split(" ")[0]}</span>
                    <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>
                      Sem {std.semester}
                    </span>
                  </td>
                  <td>
                    <b>{std.cgpa}</b>
                  </td>
                  <td>
                    <b style={{ fontSize: 13 }}>{std.readiness}%</b>
                  </td>
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
                      {std.topSkills.join(", ")}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-neutral">{std.placementStatus}</span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setActiveStudent(std)}
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Modal Drawer */}
      {activeStudent && (
        <div className="modal-backdrop-layer" onClick={() => setActiveStudent(null)} role="dialog" aria-modal="true">
          <div
            className="modal-card-box"
            style={{ width: "min(680px, 94vw)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-bar">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="user-avatar" style={{ width: 38, height: 38 }}>
                  {activeStudent.name[0]}
                </div>
                <div>
                  <h2>{activeStudent.name}</h2>
                  <span style={{ fontSize: 12, color: "var(--cp-grey-500)" }}>
                    {activeStudent.regNo} · {activeStudent.branch}
                  </span>
                </div>
              </div>
              <button className="btn-ghost" onClick={() => setActiveStudent(null)} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-scroll">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 12,
                  padding: 16,
                  background: "var(--cp-grey-50)",
                  borderRadius: "var(--cp-radius-sm)",
                  border: "1px solid var(--cp-grey-200)",
                  marginBottom: 20
                }}
              >
                <div>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-500)", textTransform: "uppercase" }}>CGPA</span>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "var(--cp-black)" }}>{activeStudent.cgpa}</div>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-600)" }}>{activeStudent.backlogs} Backlogs</span>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-500)", textTransform: "uppercase" }}>Readiness</span>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "var(--cp-black)" }}>{activeStudent.readiness}%</div>
                  <span className={`badge ${activeStudent.risk === "Ready" ? "badge-ready" : "badge-risk"}`}>
                    {activeStudent.risk}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-500)", textTransform: "uppercase" }}>Placement Status</span>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--cp-black)", marginTop: 2 }}>
                    {activeStudent.placementStatus}
                  </div>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-600)" }}>Semester {activeStudent.semester}</span>
                </div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <span className="eyebrow-tag">Verified Skills</span>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                  {activeStudent.topSkills.map((sk) => (
                    <span key={sk} className="badge badge-neutral" style={{ fontSize: 12, padding: "4px 10px" }}>
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <span className="eyebrow-tag">Verified Links & Artifacts</span>
                <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
                  {activeStudent.githubUrl && (
                    <a
                      href={activeStudent.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-secondary"
                    >
                      <Github size={14} /> GitHub Profile
                    </a>
                  )}
                  {activeStudent.linkedinUrl && (
                    <a
                      href={activeStudent.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-secondary"
                    >
                      <Linkedin size={14} /> LinkedIn Profile
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer-bar">
              <button className="btn btn-primary" onClick={() => setActiveStudent(null)}>
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
