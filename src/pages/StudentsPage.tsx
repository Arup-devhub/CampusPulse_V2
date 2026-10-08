import React, { useState, useEffect } from "react";
import { Users, Filter, Search, ArrowRight, X, ExternalLink, Github, Linkedin, CheckCircle2, AlertTriangle } from "lucide-react";
import { initialStudents } from "../data/mockData";
import { Student, StudentAttendanceItem, Role } from "../types";
import { UserProfile } from "../services/authService";
import { attendanceService } from "../services/attendanceService";

interface StudentsPageProps {
  currentUser?: UserProfile | null;
  role?: Role;
}

export const StudentsPage: React.FC<StudentsPageProps> = ({ currentUser, role }) => {
  const currentRole = role || currentUser?.role;
  const isPlacementAdmin = currentRole === "Placement Admin";
  const isRecruiter = currentRole === "Recruiter";

  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");
  const [eligibilityFilter, setEligibilityFilter] = useState("All");
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);

  const [attendanceMap, setAttendanceMap] = useState<Record<string, StudentAttendanceItem>>(() => {
    const list = attendanceService.getStudentsAttendance();
    const map: Record<string, StudentAttendanceItem> = {};
    list.forEach((item) => {
      map[item.studentId] = item;
      map[item.regNo] = item;
    });
    return map;
  });

  useEffect(() => {
    const unsub = attendanceService.subscribe((list) => {
      const map: Record<string, StudentAttendanceItem> = {};
      list.forEach((item) => {
        map[item.studentId] = item;
        map[item.regNo] = item;
      });
      setAttendanceMap(map);
    });
    return unsub;
  }, []);

  const filteredStudents = initialStudents.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.regNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBranch = branchFilter === "All" || s.branch.includes(branchFilter);
    const matchesRisk = riskFilter === "All" || s.risk === riskFilter;

    const att = attendanceMap[s.id] || attendanceMap[s.regNo];
    const eligibility = att ? att.eligibility : "Eligible";
    const matchesEligibility = eligibilityFilter === "All" || eligibility === eligibilityFilter;

    return matchesSearch && matchesBranch && matchesRisk && matchesEligibility;
  });

  const getStudentAttendance = (std: Student) => {
    return attendanceMap[std.id] || attendanceMap[std.regNo];
  };

  return (
    <div>
      <div className="page-header-block">
        <div>
          <span className="eyebrow-tag">
            {isRecruiter ? "Candidate Discovery Directory" : "Student Placement Roster"}
          </span>
          <h1 className="page-title">Candidates & Students</h1>
          <p className="page-description">
            Comprehensive operational registry of candidates, academic standing, measured readiness scores, and placement interview eligibility.
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
              <option value="All">All Readiness Profiles</option>
              <option value="Ready">Ready</option>
              <option value="Developing">Developing</option>
              <option value="At Risk">At Risk</option>
            </select>

            <select
              className="filter-select"
              value={eligibilityFilter}
              onChange={(e) => setEligibilityFilter(e.target.value)}
            >
              <option value="All">All Interview Eligibility</option>
              <option value="Eligible">Eligible (&gt; 75%)</option>
              <option value="Not Eligible">Not Eligible (≤ 75%)</option>
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
                <th>Candidate</th>
                <th>Registration No.</th>
                <th>Branch & Sem</th>
                <th>CGPA</th>
                <th>Readiness</th>
                <th>Risk Profile</th>
                {/* Section §38: Placement Admin view shows Attendance & Interview Eligibility */}
                {isPlacementAdmin && <th>Attendance</th>}
                <th>Interview Eligibility</th>
                <th>Placement Status</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((std) => {
                const att = getStudentAttendance(std);
                const isEligible = att ? att.totalAttendance > 75.0 : true;

                return (
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
                    {isPlacementAdmin && (
                      <td>
                        {att ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <b style={{ fontSize: 12, color: isEligible ? "var(--cp-black)" : "var(--cp-error)" }}>
                              {att.totalAttendance}%
                            </b>
                            <span style={{ fontSize: 11, color: "var(--cp-grey-500)" }}>
                              (A:{att.academicAttendance}% / T:{att.trainingAttendance}%)
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: "var(--cp-grey-400)" }}>N/A</span>
                        )}
                      </td>
                    )}
                    <td>
                      {/* Section §38, §39: Attendance eligibility is a separate condition */}
                      <span className={`badge ${isEligible ? "badge-ready" : "badge-risk"}`}>
                        {isEligible ? "Eligible" : "Not Eligible"}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{std.placementStatus}</span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setActiveStudent(std)}
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                );
              })}
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
                  background: "var(--cp-surface-muted)",
                  borderRadius: "var(--cp-radius-sm)",
                  border: "1px solid var(--cp-grey-200)",
                  marginBottom: 20
                }}
              >
                <div>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-500)", textTransform: "uppercase" }}>Academic Standing</span>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "var(--cp-black)" }}>{activeStudent.cgpa} CGPA</div>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-600)" }}>{activeStudent.backlogs} Backlogs</span>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-500)", textTransform: "uppercase" }}>Readiness Score</span>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "var(--cp-black)" }}>{activeStudent.readiness}%</div>
                  <span className={`badge ${activeStudent.risk === "Ready" ? "badge-ready" : "badge-risk"}`}>
                    {activeStudent.risk}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-500)", textTransform: "uppercase" }}>Interview Eligibility</span>
                  {(() => {
                    const att = getStudentAttendance(activeStudent);
                    const isEligible = att ? att.totalAttendance > 75.0 : true;
                    return (
                      <div style={{ marginTop: 4 }}>
                        <span className={`badge ${isEligible ? "badge-ready" : "badge-risk"}`} style={{ fontSize: 13, padding: "4px 10px" }}>
                          {isEligible ? "ELIGIBLE" : "NOT ELIGIBLE"}
                        </span>
                        {att && (
                          <span style={{ fontSize: 11, color: "var(--cp-grey-600)", display: "block", marginTop: 4 }}>
                            Total Attendance: {att.totalAttendance}% (&gt; 75% required)
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Attendance section for Placement Admin (§38) */}
              {isPlacementAdmin && getStudentAttendance(activeStudent) && (
                <div style={{ marginBottom: 20, padding: 14, border: "1px solid var(--cp-grey-200)", borderRadius: "var(--cp-radius-sm)" }}>
                  <span className="eyebrow-tag" style={{ marginBottom: 8, display: "block" }}>
                    Attendance Breakdown & College Verification
                  </span>
                  {(() => {
                    const att = getStudentAttendance(activeStudent)!;
                    return (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                        <div style={{ fontSize: 12 }}>
                          <span style={{ color: "var(--cp-grey-500)", display: "block" }}>Academic</span>
                          <b>{att.academicAttendance}%</b> ({att.academicAttendedSessions}/{att.academicTotalSessions})
                        </div>
                        <div style={{ fontSize: 12 }}>
                          <span style={{ color: "var(--cp-grey-500)", display: "block" }}>Training Bootcamp</span>
                          <b>{att.trainingAttendance}%</b> ({att.trainingAttendedSessions}/{att.trainingTotalSessions})
                        </div>
                        <div style={{ fontSize: 12 }}>
                          <span style={{ color: "var(--cp-grey-500)", display: "block" }}>Combined Total</span>
                          <b style={{ color: att.totalAttendance > 75.0 ? "var(--cp-success)" : "var(--cp-error)" }}>
                            {att.totalAttendance}%
                          </b> ({att.totalAttendedSessions}/{att.totalScheduledSessions})
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

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
