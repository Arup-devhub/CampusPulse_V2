import React, { useState, useEffect } from "react";
import {
  UserCheck, Users, CheckCircle2, AlertTriangle, Clock, RefreshCw,
  Search, Filter, X, ArrowUpRight, ShieldCheck, Calendar, BookOpen
} from "lucide-react";
import { StudentAttendanceItem } from "../types";
import { attendanceService, AttendanceKPIs } from "../services/attendanceService";

export const AttendancePage: React.FC = () => {
  const [records, setRecords] = useState<StudentAttendanceItem[]>(() =>
    attendanceService.getStudentsAttendance()
  );
  const [kpis, setKpis] = useState<AttendanceKPIs>(() =>
    attendanceService.getAttendanceKPIs()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");
  const [eligibilityFilter, setEligibilityFilter] = useState<"All" | "Eligible" | "Not Eligible">("All");
  const [selectedStudent, setSelectedStudent] = useState<StudentAttendanceItem | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  useEffect(() => {
    const unsub = attendanceService.subscribe((updated) => {
      setRecords(updated);
      setKpis(attendanceService.getAttendanceKPIs());
    });
    return unsub;
  }, []);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const result = attendanceService.simulateLiveUpdate();
      setIsSyncing(false);
      setSyncNotice(result.message);
      setTimeout(() => setSyncNotice(null), 4000);
    }, 600);
  };

  const filteredRecords = records.filter((r) => {
    const matchesQuery =
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.branch.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBranch = branchFilter === "All" || r.branch.includes(branchFilter);
    const matchesEligibility = eligibilityFilter === "All" || r.eligibility === eligibilityFilter;

    return matchesQuery && matchesBranch && matchesEligibility;
  });

  return (
    <div>
      {/* Toast Notice */}
      {syncNotice && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 100,
            background: "var(--cp-near-black)",
            color: "var(--cp-white)",
            padding: "12px 18px",
            borderRadius: "var(--cp-radius-md)",
            border: "1px solid var(--cp-grey-700)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 13
          }}
        >
          <CheckCircle2 size={16} style={{ color: "var(--cp-success)" }} />
          <span>{syncNotice}</span>
        </div>
      )}

      {/* Header block (§29) */}
      <div className="page-header-block">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="eyebrow-tag">Institutional Compliance</span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                color: "var(--cp-success)",
                fontWeight: 600,
                background: "var(--cp-success-bg)",
                border: "1px solid var(--cp-success-border)",
                padding: "2px 8px",
                borderRadius: 12
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--cp-success)",
                  display: "inline-block"
                }}
              />
              Live ERP Gateway
            </span>
          </div>
          <h1 className="page-title">Student Attendance</h1>
          <p className="page-description">
            Monitor academic and training attendance to determine placement interview eligibility.
          </p>
        </div>

        <div className="page-actions-group">
          <button
            className="btn btn-secondary"
            onClick={handleManualSync}
            disabled={isSyncing}
            title="Poll latest session attendance logs from college ERP"
          >
            <RefreshCw size={14} className={isSyncing ? "spin-icon" : ""} />
            {isSyncing ? "Syncing ERP..." : "Refresh from College ERP"}
          </button>
        </div>
      </div>

      {/* Top KPI Cards Grid (§29) */}
      <section className="stat-kpi-grid">
        <div className="stat-kpi-card">
          <div className="stat-icon-square">
            <Users size={20} />
          </div>
          <div className="stat-kpi-info">
            <span className="stat-kpi-label">Total Students</span>
            <div className="stat-kpi-value">{kpis.totalStudents}</div>
            <span className="stat-kpi-delta neutral">Enrolled in 2026 Batch</span>
          </div>
        </div>

        <div className="stat-kpi-card">
          <div className="stat-icon-square">
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-kpi-info">
            <span className="stat-kpi-label">Eligible for Interview</span>
            <div className="stat-kpi-value" style={{ color: "var(--cp-success)" }}>
              {kpis.eligibleCount}
            </div>
            <span className="stat-kpi-delta positive">
              Total Attendance &gt; 75.0%
            </span>
          </div>
        </div>

        <div className="stat-kpi-card">
          <div className="stat-icon-square">
            <AlertTriangle size={20} />
          </div>
          <div className="stat-kpi-info">
            <span className="stat-kpi-label">Below Attendance Threshold</span>
            <div className="stat-kpi-value" style={{ color: "var(--cp-error)" }}>
              {kpis.belowThresholdCount}
            </div>
            <span className="stat-kpi-delta critical">
              Not eligible for campus interviews
            </span>
          </div>
        </div>

        <div className="stat-kpi-card">
          <div className="stat-icon-square">
            <Clock size={20} />
          </div>
          <div className="stat-kpi-info">
            <span className="stat-kpi-label">Attendance Updates Today</span>
            <div className="stat-kpi-value">{kpis.updatesTodayCount}</div>
            <span className="stat-kpi-delta positive">Live auto-recalculated</span>
          </div>
        </div>
      </section>

      {/* Table Card (§30, §31, §32, §33) */}
      <div className="cp-card">
        {/* Filter bar */}
        <div className="table-filter-bar">
          <div className="filter-controls">
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search student, reg no..."
                className="filter-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: 240 }}
              />
            </div>

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
              value={eligibilityFilter}
              onChange={(e) => setEligibilityFilter(e.target.value as any)}
            >
              <option value="All">All Eligibility</option>
              <option value="Eligible">Eligible (&gt; 75%)</option>
              <option value="Not Eligible">Not Eligible (≤ 75%)</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: "var(--cp-grey-500)" }}>
            <span>
              Rule: <b>Total Attendance &gt; 75%</b>
            </span>
            <span>·</span>
            <span>Showing {filteredRecords.length} of {records.length} students</span>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="table-container">
          <table className="cp-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Registration No.</th>
                <th>Branch</th>
                <th>Academic Attendance</th>
                <th>Training Attendance</th>
                <th>Total Attendance</th>
                <th>Interview Eligibility</th>
                <th>Last Updated</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: "center", padding: 24, color: "var(--cp-grey-500)" }}>
                    No student attendance records matched the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => (
                  <tr key={item.studentId}>
                    <td>
                      <b>{item.studentName}</b>
                      <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>
                        {item.email}
                      </span>
                    </td>
                    <td>
                      <code style={{ fontSize: 12 }}>{item.regNo}</code>
                    </td>
                    <td>{item.branch.split(" ")[0]}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <b>{item.academicAttendance}%</b>
                        <span style={{ fontSize: 11, color: "var(--cp-grey-500)" }}>
                          ({item.academicAttendedSessions}/{item.academicTotalSessions})
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <b>{item.trainingAttendance}%</b>
                        <span style={{ fontSize: 11, color: "var(--cp-grey-500)" }}>
                          ({item.trainingAttendedSessions}/{item.trainingTotalSessions})
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <b
                          style={{
                            fontSize: 13,
                            color: item.totalAttendance > 75.0 ? "var(--cp-black)" : "var(--cp-error)"
                          }}
                        >
                          {item.totalAttendance}%
                        </b>
                        <span style={{ fontSize: 11, color: "var(--cp-grey-500)" }}>
                          ({item.totalAttendedSessions}/{item.totalScheduledSessions})
                        </span>
                      </div>
                    </td>
                    <td>
                      {/* STRICT RULE (§31, §33): Total Attendance > 75% */}
                      <span
                        className={`badge ${
                          item.eligibility === "Eligible" ? "badge-ready" : "badge-risk"
                        }`}
                      >
                        {item.eligibility}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: 12, color: "var(--cp-grey-600)" }}>
                        {item.lastUpdated}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          item.status === "Normal"
                            ? "badge-neutral"
                            : item.status === "At Risk"
                            ? "badge-developing"
                            : "badge-critical"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setSelectedStudent(item)}
                        aria-label={`View attendance details for ${item.studentName}`}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Detail View Modal (§34) */}
      {selectedStudent && (
        <div
          className="modal-backdrop-layer"
          onClick={() => setSelectedStudent(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="modal-card-box"
            style={{ width: "min(600px, 94vw)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-bar">
              <div>
                <h2>Student Attendance & Eligibility Audit</h2>
                <span style={{ fontSize: 12, color: "var(--cp-grey-500)" }}>
                  Placement cell interview qualification report
                </span>
              </div>
              <button
                className="btn-ghost"
                onClick={() => setSelectedStudent(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-scroll" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Student identification card */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 12,
                  padding: 14,
                  background: "var(--cp-surface-muted)",
                  borderRadius: "var(--cp-radius-sm)"
                }}
              >
                <div>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-500)", textTransform: "uppercase" }}>Student Name</span>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--cp-black)" }}>{selectedStudent.studentName}</div>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-600)" }}>{selectedStudent.email}</span>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-500)", textTransform: "uppercase" }}>Registration Number</span>
                  <div style={{ fontWeight: 600, fontSize: 13, fontFamily: "monospace" }}>{selectedStudent.regNo}</div>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-600)" }}>Batch 2026</span>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-500)", textTransform: "uppercase" }}>Branch</span>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{selectedStudent.branch}</div>
                </div>
              </div>

              {/* Attendance metrics breakdown */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div style={{ padding: 12, border: "1px solid var(--cp-grey-200)", borderRadius: "var(--cp-radius-sm)" }}>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-500)", textTransform: "uppercase" }}>Academic Attendance</span>
                  <div style={{ fontSize: 22, fontWeight: 700, margin: "4px 0" }}>
                    {selectedStudent.academicAttendance}%
                  </div>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-600)" }}>
                    {selectedStudent.academicAttendedSessions} of {selectedStudent.academicTotalSessions} sessions
                  </span>
                </div>

                <div style={{ padding: 12, border: "1px solid var(--cp-grey-200)", borderRadius: "var(--cp-radius-sm)" }}>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-500)", textTransform: "uppercase" }}>Training Attendance</span>
                  <div style={{ fontSize: 22, fontWeight: 700, margin: "4px 0" }}>
                    {selectedStudent.trainingAttendance}%
                  </div>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-600)" }}>
                    {selectedStudent.trainingAttendedSessions} of {selectedStudent.trainingTotalSessions} sessions
                  </span>
                </div>

                <div
                  style={{
                    padding: 12,
                    border: "1px solid var(--cp-grey-200)",
                    borderRadius: "var(--cp-radius-sm)",
                    background: selectedStudent.totalAttendance > 75.0 ? "var(--cp-success-bg)" : "var(--cp-error-bg)"
                  }}
                >
                  <span style={{ fontSize: 11, color: "var(--cp-grey-600)", textTransform: "uppercase" }}>Total Attendance</span>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      margin: "4px 0",
                      color: selectedStudent.totalAttendance > 75.0 ? "var(--cp-success)" : "var(--cp-error)"
                    }}
                  >
                    {selectedStudent.totalAttendance}%
                  </div>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-700)" }}>
                    {selectedStudent.totalAttendedSessions} / {selectedStudent.totalScheduledSessions} total
                  </span>
                </div>
              </div>

              {/* Interview Eligibility Banner (§64) */}
              <div
                style={{
                  padding: 16,
                  borderRadius: "var(--cp-radius-sm)",
                  border: `1px solid ${selectedStudent.totalAttendance > 75.0 ? "var(--cp-success-border)" : "var(--cp-error-border)"}`,
                  background: selectedStudent.totalAttendance > 75.0 ? "var(--cp-success-bg)" : "var(--cp-error-bg)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <span style={{ fontSize: 11, textTransform: "uppercase", fontWeight: 700, color: selectedStudent.totalAttendance > 75.0 ? "var(--cp-success)" : "var(--cp-error)" }}>
                    Interview Eligibility Status
                  </span>
                  <h3 style={{ fontSize: 18, margin: "2px 0 4px", color: selectedStudent.totalAttendance > 75.0 ? "var(--cp-success)" : "var(--cp-error)" }}>
                    {selectedStudent.totalAttendance > 75.0 ? "ELIGIBLE TO SIT IN INTERVIEW" : "NOT ELIGIBLE TO SIT IN INTERVIEW"}
                  </h3>
                  <p style={{ fontSize: 12, color: "var(--cp-text-secondary)" }}>
                    Current Total Attendance: <b>{selectedStudent.totalAttendance}%</b> · Required Threshold: <b>More than 75% (&gt; 75.0%)</b>
                  </p>
                  {selectedStudent.totalAttendance <= 75.0 && (
                    <p style={{ fontSize: 12, color: "var(--cp-error)", fontWeight: 600, marginTop: 2 }}>
                      Reason: {selectedStudent.eligibilityReason || "Total attendance is below or equal to 75% cutoff."}
                    </p>
                  )}
                </div>

                <span
                  className={`badge ${selectedStudent.totalAttendance > 75.0 ? "badge-ready" : "badge-risk"}`}
                  style={{ fontSize: 14, padding: "6px 14px" }}
                >
                  {selectedStudent.eligibility.toUpperCase()}
                </span>
              </div>

              {/* Audit Metadata (§63) */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  background: "var(--cp-surface-muted)",
                  borderRadius: "var(--cp-radius-sm)",
                  fontSize: 12,
                  color: "var(--cp-grey-600)"
                }}
              >
                <span><b>Source:</b> College Attendance System (LMS / Biometric Integration)</span>
                <span><b>Last Updated:</b> {selectedStudent.lastUpdated}</span>
              </div>

              {/* Recent sessions log */}
              {selectedStudent.recentSessions && selectedStudent.recentSessions.length > 0 && (
                <div>
                  <span className="eyebrow-tag" style={{ marginBottom: 8, display: "block" }}>
                    Recent Session Records
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {selectedStudent.recentSessions.map((s, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "8px 12px",
                          border: "1px solid var(--cp-grey-200)",
                          borderRadius: "var(--cp-radius-sm)",
                          fontSize: 12
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span className="badge badge-neutral" style={{ fontSize: 10 }}>{s.type}</span>
                          <b>{s.subject}</b>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ color: "var(--cp-grey-500)" }}>{s.date}</span>
                          <span className={`badge ${s.attended ? "badge-ready" : "badge-risk"}`}>
                            {s.attended ? "Attended ✓" : "Absent ✗"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer-bar">
              <button className="btn btn-primary" onClick={() => setSelectedStudent(null)}>
                Close Audit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
