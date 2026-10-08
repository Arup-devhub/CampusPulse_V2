import React, { useState, useEffect } from "react";
import {
  Users, CheckCircle2, AlertTriangle, Clock, RefreshCw,
  Search, Filter, X, ArrowUpRight, ShieldCheck, Calendar, BookOpen,
  Award, Building2, Check, AlertCircle, HelpCircle
} from "lucide-react";
import { StudentAttendanceItem, InterviewEligibilityStatus } from "../types";
import {
  attendanceService,
  AttendanceKPIs,
  calculateInterviewEligibility,
  InterviewEligibilityEvaluation,
  CGPA_THRESHOLDS,
  MIN_TOTAL_ATTENDANCE
} from "../services/attendanceService";
import { initialDrives } from "../data/mockData";

// Active placement drives with their required CGPA cutoffs
const PLACEMENT_DRIVE_CUTOFFS = [
  ...initialDrives.map((d) => ({
    id: d.id,
    company: d.company,
    role: d.role,
    minCgpa: d.minCgpa,
    package: d.package
  })),
  {
    id: "drv-005",
    company: "Amazon",
    role: "Software Development Engineer (SDE I)",
    minCgpa: 8.5,
    package: "₹28.5 LPA"
  }
];

export const AttendancePage: React.FC = () => {
  const [records, setRecords] = useState<StudentAttendanceItem[]>(() =>
    attendanceService.getStudentsAttendance()
  );
  const [kpis, setKpis] = useState<AttendanceKPIs>(() =>
    attendanceService.getAttendanceKPIs()
  );

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");
  const [attendanceFilter, setAttendanceFilter] = useState<"All" | "Eligible" | "Defaulters">("All");
  const [cgpaFilter, setCgpaFilter] = useState<
    "All" | "Below 7.0" | "7.0-7.49" | "7.5-7.99" | "8.0-8.49" | "8.5-8.99" | "9.0+"
  >("All");
  const [eligibilityFilter, setEligibilityFilter] = useState<
    "All" | "Eligible" | "Restricted" | "Not Eligible"
  >("All");
  const [selectedDriveId, setSelectedDriveId] = useState<string>("All");

  // Modal & Sync state
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

  const selectedDrive = PLACEMENT_DRIVE_CUTOFFS.find((d) => d.id === selectedDriveId);

  // Helper to evaluate a record dynamically based on whether a specific drive is selected
  const getEvaluatedRecord = (item: StudentAttendanceItem): InterviewEligibilityEvaluation => {
    if (selectedDrive) {
      return calculateInterviewEligibility({
        cgpa: item.cgpa,
        totalAttendance: item.totalAttendance,
        interviewCgpaCutoff: selectedDrive.minCgpa,
        driveName: `${selectedDrive.company} (${selectedDrive.role})`
      });
    }

    return calculateInterviewEligibility({
      cgpa: item.cgpa,
      totalAttendance: item.totalAttendance
    });
  };

  // Filter application
  const filteredRecords = records.filter((r) => {
    // 1. Search Query
    const matchesQuery =
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.branch.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Branch
    const matchesBranch = branchFilter === "All" || r.branch.includes(branchFilter);

    // 3. Attendance Filter
    let matchesAttendance = true;
    if (attendanceFilter === "Eligible") {
      matchesAttendance = r.totalAttendance > MIN_TOTAL_ATTENDANCE;
    } else if (attendanceFilter === "Defaulters") {
      matchesAttendance = r.totalAttendance <= MIN_TOTAL_ATTENDANCE;
    }

    // 4. CGPA Filter
    let matchesCgpa = true;
    if (cgpaFilter === "Below 7.0") {
      matchesCgpa = r.cgpa < 7.0;
    } else if (cgpaFilter === "7.0-7.49") {
      matchesCgpa = r.cgpa >= 7.0 && r.cgpa < 7.5;
    } else if (cgpaFilter === "7.5-7.99") {
      matchesCgpa = r.cgpa >= 7.5 && r.cgpa < 8.0;
    } else if (cgpaFilter === "8.0-8.49") {
      matchesCgpa = r.cgpa >= 8.0 && r.cgpa < 8.5;
    } else if (cgpaFilter === "8.5-8.99") {
      matchesCgpa = r.cgpa >= 8.5 && r.cgpa < 9.0;
    } else if (cgpaFilter === "9.0+") {
      matchesCgpa = r.cgpa >= 9.0;
    }

    // 5. Eligibility Filter (evaluated against active drive or general)
    const evaluation = getEvaluatedRecord(r);
    const matchesEligibility =
      eligibilityFilter === "All" || evaluation.status === eligibilityFilter;

    return matchesQuery && matchesBranch && matchesAttendance && matchesCgpa && matchesEligibility;
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

      {/* Header block */}
      <div className="page-header-block">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="eyebrow-tag">Institutional Placement Compliance</span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                color: "var(--cp-text-secondary)",
                fontWeight: 600,
                background: "var(--cp-surface-muted)",
                border: "1px solid var(--cp-border)",
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
              Demo / Simulated ERP Gateway
            </span>
          </div>
          <h1 className="page-title">Student Attendance & Interview Eligibility</h1>
          <p className="page-description">
            Evaluate student placement interview eligibility combining mandatory total attendance (&gt; 75.0%) with academic CGPA tiers and company-specific cutoffs.
          </p>
        </div>

        <div className="page-actions-group">
          <button
            className="btn btn-secondary"
            onClick={handleManualSync}
            disabled={isSyncing}
            title="Poll session attendance logs from ERP gateway"
          >
            <RefreshCw size={14} className={isSyncing ? "spin-icon" : ""} />
            {isSyncing ? "Syncing ERP..." : "Refresh from College ERP"}
          </button>
        </div>
      </div>

      {/* Top 5 KPI Cards Grid (§12) */}
      <section className="stat-kpi-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        {/* 1. Total Students */}
        <div className="stat-kpi-card">
          <div className="stat-icon-square">
            <Users size={18} />
          </div>
          <div className="stat-kpi-info">
            <span className="stat-kpi-label">Total Students</span>
            <div className="stat-kpi-value">{kpis.totalStudents}</div>
            <span className="stat-kpi-delta neutral">Enrolled 2026 Batch</span>
          </div>
        </div>

        {/* 2. Attendance Eligible */}
        <div className="stat-kpi-card">
          <div className="stat-icon-square">
            <Clock size={18} />
          </div>
          <div className="stat-kpi-info">
            <span className="stat-kpi-label">Attendance Eligible</span>
            <div className="stat-kpi-value" style={{ color: "var(--cp-success)" }}>
              {kpis.attendanceEligibleCount}
            </div>
            <span className="stat-kpi-delta positive">
              Attendance &gt; 75.0% passed
            </span>
          </div>
        </div>

        {/* 3. CGPA Eligible */}
        <div className="stat-kpi-card">
          <div className="stat-icon-square">
            <Award size={18} />
          </div>
          <div className="stat-kpi-info">
            <span className="stat-kpi-label">CGPA Eligible</span>
            <div className="stat-kpi-value" style={{ color: "var(--cp-info)" }}>
              {kpis.cgpaEligibleCount}
            </div>
            <span className="stat-kpi-delta positive">
              CGPA ≥ 7.00 (Tiers 1–5)
            </span>
          </div>
        </div>

        {/* 4. Interview Eligible (Satisfies both) */}
        <div className="stat-kpi-card">
          <div className="stat-icon-square">
            <CheckCircle2 size={18} />
          </div>
          <div className="stat-kpi-info">
            <span className="stat-kpi-label">Interview Qualified</span>
            <div className="stat-kpi-value" style={{ color: "var(--cp-success)" }}>
              {kpis.interviewEligibleCount}
            </div>
            <span className="stat-kpi-delta positive">
              Both prerequisites met
            </span>
          </div>
        </div>

        {/* 5. Not Eligible */}
        <div className="stat-kpi-card">
          <div className="stat-icon-square">
            <AlertTriangle size={18} />
          </div>
          <div className="stat-kpi-info">
            <span className="stat-kpi-label">Not Eligible</span>
            <div className="stat-kpi-value" style={{ color: "var(--cp-error)" }}>
              {kpis.notEligibleCount}
            </div>
            <span className="stat-kpi-delta critical">
              Attendance ≤ 75% or CGPA &lt; 7.0
            </span>
          </div>
        </div>
      </section>

      {/* Main Table Card with Multi-Dimensional Filters */}
      <div className="cp-card">
        {/* Drive context banner when evaluating specific drive (§15, §18) */}
        {selectedDrive && (
          <div
            style={{
              padding: "10px 16px",
              background: "rgba(14, 165, 233, 0.08)",
              borderBottom: "1px solid rgba(14, 165, 233, 0.2)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 12
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Building2 size={16} style={{ color: "var(--cp-info)" }} />
              <span>
                Evaluating against <b>{selectedDrive.company}</b> ({selectedDrive.role}) · Cutoff: <b>≥ {selectedDrive.minCgpa} CGPA</b> + <b>Attendance &gt; 75.0%</b>
              </span>
            </div>
            <button
              className="btn-ghost"
              style={{ fontSize: 11, padding: "2px 6px" }}
              onClick={() => setSelectedDriveId("All")}
            >
              Reset to General Tiers
            </button>
          </div>
        )}

        {/* Filter bar (§5, §10, §11) */}
        <div className="table-filter-bar" style={{ flexWrap: "wrap", gap: 10 }}>
          <div className="filter-controls" style={{ flexWrap: "wrap", gap: 8 }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search student, reg no..."
                className="filter-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: 200 }}
              />
            </div>

            {/* CGPA Filter (§5) */}
            <select
              className="filter-select"
              value={cgpaFilter}
              onChange={(e) => setCgpaFilter(e.target.value as any)}
              title="Filter by Academic CGPA Range"
            >
              <option value="All">All CGPA</option>
              <option value="Below 7.0">Below 7.0 (Not Eligible)</option>
              <option value="7.0-7.49">7.0 – 7.49 (Tier 1)</option>
              <option value="7.5-7.99">7.5 – 7.99 (Tier 2)</option>
              <option value="8.0-8.49">8.0 – 8.49 (Tier 3)</option>
              <option value="8.5-8.99">8.5 – 8.99 (Tier 4)</option>
              <option value="9.0+">9.0+ (Tier 5)</option>
            </select>

            {/* Attendance Filter (§5, §10) */}
            <select
              className="filter-select"
              value={attendanceFilter}
              onChange={(e) => setAttendanceFilter(e.target.value as any)}
              title="Filter by Attendance Range"
            >
              <option value="All">All Attendance</option>
              <option value="Eligible">&gt; 75% (Attendance Eligible)</option>
              <option value="Defaulters">≤ 75% (Attendance Defaulters)</option>
            </select>

            {/* Interview Eligibility Filter (§11) */}
            <select
              className="filter-select"
              value={eligibilityFilter}
              onChange={(e) => setEligibilityFilter(e.target.value as any)}
              title="Filter by Interview Eligibility"
            >
              <option value="All">All Eligibility</option>
              <option value="Eligible">Eligible</option>
              <option value="Restricted">Restricted</option>
              <option value="Not Eligible">Not Eligible</option>
            </select>

            {/* Branch Filter */}
            <select
              className="filter-select"
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              title="Filter by Engineering Branch"
            >
              <option value="All">All Branches</option>
              <option value="Computer Science">Computer Science & Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics">Electronics & Communication</option>
              <option value="Electrical">Electrical & Electronics</option>
            </select>

            {/* Company / Placement Drive Filter (§15, §18) */}
            <select
              className="filter-select"
              value={selectedDriveId}
              onChange={(e) => setSelectedDriveId(e.target.value)}
              title="Evaluate eligibility against specific company placement drive"
              style={{ fontWeight: selectedDriveId !== "All" ? 600 : 400 }}
            >
              <option value="All">All Drives (General Evaluation)</option>
              {PLACEMENT_DRIVE_CUTOFFS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.company} (Cutoff ≥ {d.minCgpa} CGPA)
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "var(--cp-text-secondary)" }}>
            <span>
              Rule: <b>Total Attendance &gt; 75%</b> + <b>CGPA Tier</b>
            </span>
            <span>·</span>
            <span>Showing {filteredRecords.length} of {records.length} students</span>
          </div>
        </div>

        {/* Table Container (§6) */}
        <div className="table-container">
          <table className="cp-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Registration No.</th>
                <th>Branch</th>
                <th>CGPA</th>
                <th>Academic Attendance</th>
                <th>Training Attendance</th>
                <th>Total Attendance</th>
                <th>Interview Eligibility</th>
                <th>Eligibility Tier</th>
                <th>Last Updated</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={12} style={{ textAlign: "center", padding: 32, color: "var(--cp-text-secondary)" }}>
                    No student records matched the combined filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => {
                  const evalResult = getEvaluatedRecord(item);
                  const isAttPassed = item.totalAttendance > MIN_TOTAL_ATTENDANCE;

                  return (
                    <tr key={item.studentId}>
                      {/* Student */}
                      <td>
                        <b>{item.studentName}</b>
                        <span style={{ fontSize: 11, color: "var(--cp-text-secondary)", display: "block" }}>
                          {item.email}
                        </span>
                      </td>

                      {/* Registration No. */}
                      <td>
                        <code style={{ fontSize: 12 }}>{item.regNo}</code>
                      </td>

                      {/* Branch */}
                      <td>{item.branch.split(" ")[0]}</td>

                      {/* CGPA */}
                      <td>
                        <b
                          style={{
                            fontSize: 13,
                            color: item.cgpa >= CGPA_THRESHOLDS.minimum ? "var(--cp-text-primary)" : "var(--cp-error)"
                          }}
                        >
                          {item.cgpa.toFixed(2)}
                        </b>
                      </td>

                      {/* Academic Attendance */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span>{item.academicAttendance}%</span>
                          <span style={{ fontSize: 11, color: "var(--cp-text-secondary)" }}>
                            ({item.academicAttendedSessions}/{item.academicTotalSessions})
                          </span>
                        </div>
                      </td>

                      {/* Training Attendance */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span>{item.trainingAttendance}%</span>
                          <span style={{ fontSize: 11, color: "var(--cp-text-secondary)" }}>
                            ({item.trainingAttendedSessions}/{item.trainingTotalSessions})
                          </span>
                        </div>
                      </td>

                      {/* Total Attendance */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <b
                            style={{
                              fontSize: 13,
                              color: isAttPassed ? "var(--cp-text-primary)" : "var(--cp-error)"
                            }}
                          >
                            {item.totalAttendance}%
                          </b>
                          <span style={{ fontSize: 11, color: "var(--cp-text-secondary)" }}>
                            ({item.totalAttendedSessions}/{item.totalScheduledSessions})
                          </span>
                        </div>
                      </td>

                      {/* Interview Eligibility Status (§7, §8) */}
                      <td>
                        <span
                          className={`badge ${
                            evalResult.status === "Eligible"
                              ? "badge-ready"
                              : evalResult.status === "Restricted"
                              ? "badge-developing"
                              : "badge-risk"
                          }`}
                          title={evalResult.reason}
                        >
                          {evalResult.status}
                        </span>
                      </td>

                      {/* Eligibility Tier (§3, §6) */}
                      <td>
                        <span
                          className={`badge ${
                            evalResult.tier === "NOT_ELIGIBLE" ? "badge-risk" : "badge-neutral"
                          }`}
                        >
                          {evalResult.tierDisplay}
                        </span>
                      </td>

                      {/* Last Updated */}
                      <td>
                        <span style={{ fontSize: 12, color: "var(--cp-text-secondary)" }}>
                          {item.lastUpdated}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`badge ${
                            evalResult.status === "Eligible"
                              ? "badge-neutral"
                              : evalResult.status === "Restricted"
                              ? "badge-developing"
                              : "badge-critical"
                          }`}
                        >
                          {evalResult.status === "Not Eligible" ? "At Risk" : "Normal"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: "right" }}>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => setSelectedStudent(item)}
                          aria-label={`View audit details for ${item.studentName}`}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explanatory Student Attendance & CGPA Eligibility Audit Modal (§8, §17, §18) */}
      {selectedStudent && (() => {
        const studentEval = getEvaluatedRecord(selectedStudent);
        const generalEval = calculateInterviewEligibility({
          cgpa: selectedStudent.cgpa,
          totalAttendance: selectedStudent.totalAttendance
        });
        const isAttPassed = selectedStudent.totalAttendance > MIN_TOTAL_ATTENDANCE;

        return (
          <div
            className="modal-backdrop-layer"
            onClick={() => setSelectedStudent(null)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="modal-card-box"
              style={{ width: "min(680px, 95vw)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="modal-header-bar">
                <div>
                  <h2>Student Attendance & Interview Eligibility Audit</h2>
                  <span style={{ fontSize: 12, color: "var(--cp-text-secondary)" }}>
                    Placement Qualification & CGPA Cutoff Evaluation Report
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
                {/* Student Identification Profile */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 12,
                    padding: 14,
                    background: "var(--cp-surface-muted)",
                    borderRadius: "var(--cp-radius-sm)",
                    border: "1px solid var(--cp-border)"
                  }}
                >
                  <div>
                    <span style={{ fontSize: 11, color: "var(--cp-text-secondary)", textTransform: "uppercase" }}>
                      Student Name
                    </span>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--cp-text-primary)" }}>
                      {selectedStudent.studentName}
                    </div>
                    <span style={{ fontSize: 11, color: "var(--cp-text-secondary)" }}>
                      {selectedStudent.email}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: "var(--cp-text-secondary)", textTransform: "uppercase" }}>
                      Registration No.
                    </span>
                    <div style={{ fontWeight: 600, fontSize: 13, fontFamily: "monospace" }}>
                      {selectedStudent.regNo}
                    </div>
                    <span style={{ fontSize: 11, color: "var(--cp-text-secondary)" }}>
                      Batch 2026 · Sem 7
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: "var(--cp-text-secondary)", textTransform: "uppercase" }}>
                      Branch
                    </span>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>
                      {selectedStudent.branch}
                    </div>
                  </div>
                </div>

                {/* Academic & Attendance Metrics Row (§17) */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                  {/* CGPA */}
                  <div style={{ padding: 12, border: "1px solid var(--cp-border)", borderRadius: "var(--cp-radius-sm)" }}>
                    <span style={{ fontSize: 11, color: "var(--cp-text-secondary)", textTransform: "uppercase" }}>
                      Academic CGPA
                    </span>
                    <div style={{ fontSize: 22, fontWeight: 800, margin: "4px 0", color: "var(--cp-text-primary)" }}>
                      {selectedStudent.cgpa.toFixed(2)}
                    </div>
                    <span className="badge badge-neutral" style={{ fontSize: 10 }}>
                      {generalEval.tierDisplay}
                    </span>
                  </div>

                  {/* Academic Attendance */}
                  <div style={{ padding: 12, border: "1px solid var(--cp-border)", borderRadius: "var(--cp-radius-sm)" }}>
                    <span style={{ fontSize: 11, color: "var(--cp-text-secondary)", textTransform: "uppercase" }}>
                      Academic
                    </span>
                    <div style={{ fontSize: 20, fontWeight: 700, margin: "4px 0" }}>
                      {selectedStudent.academicAttendance}%
                    </div>
                    <span style={{ fontSize: 11, color: "var(--cp-text-secondary)" }}>
                      {selectedStudent.academicAttendedSessions}/{selectedStudent.academicTotalSessions} sess.
                    </span>
                  </div>

                  {/* Training Attendance */}
                  <div style={{ padding: 12, border: "1px solid var(--cp-border)", borderRadius: "var(--cp-radius-sm)" }}>
                    <span style={{ fontSize: 11, color: "var(--cp-text-secondary)", textTransform: "uppercase" }}>
                      Training
                    </span>
                    <div style={{ fontSize: 20, fontWeight: 700, margin: "4px 0" }}>
                      {selectedStudent.trainingAttendance}%
                    </div>
                    <span style={{ fontSize: 11, color: "var(--cp-text-secondary)" }}>
                      {selectedStudent.trainingAttendedSessions}/{selectedStudent.trainingTotalSessions} sess.
                    </span>
                  </div>

                  {/* Total Attendance */}
                  <div
                    style={{
                      padding: 12,
                      border: "1px solid var(--cp-border)",
                      borderRadius: "var(--cp-radius-sm)",
                      background: isAttPassed ? "var(--cp-success-bg)" : "var(--cp-error-bg)"
                    }}
                  >
                    <span style={{ fontSize: 11, color: "var(--cp-text-secondary)", textTransform: "uppercase" }}>
                      Total Attendance
                    </span>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        margin: "4px 0",
                        color: isAttPassed ? "var(--cp-success)" : "var(--cp-error)"
                      }}
                    >
                      {selectedStudent.totalAttendance}%
                    </div>
                    <span style={{ fontSize: 11, color: "var(--cp-text-secondary)" }}>
                      {selectedStudent.totalAttendedSessions}/{selectedStudent.totalScheduledSessions} total
                    </span>
                  </div>
                </div>

                {/* Explanatory Eligibility Banner (§8, §16, §17) */}
                <div
                  style={{
                    padding: 16,
                    borderRadius: "var(--cp-radius-sm)",
                    border: `1px solid ${
                      generalEval.status === "Eligible"
                        ? "var(--cp-success-border)"
                        : generalEval.status === "Restricted"
                        ? "var(--cp-warning-border)"
                        : "var(--cp-error-border)"
                    }`,
                    background:
                      generalEval.status === "Eligible"
                        ? "var(--cp-success-bg)"
                        : generalEval.status === "Restricted"
                        ? "var(--cp-warning-bg)"
                        : "var(--cp-error-bg)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <span
                        style={{
                          fontSize: 11,
                          textTransform: "uppercase",
                          fontWeight: 700,
                          color:
                            generalEval.status === "Eligible"
                              ? "var(--cp-success)"
                              : generalEval.status === "Restricted"
                              ? "var(--cp-warning)"
                              : "var(--cp-error)"
                        }}
                      >
                        Institutional Interview Eligibility
                      </span>
                      <h3 style={{ fontSize: 18, margin: "2px 0 0", color: "var(--cp-text-primary)" }}>
                        {generalEval.status === "Eligible"
                          ? "ELIGIBLE FOR PLACEMENT INTERVIEWS"
                          : generalEval.status === "Restricted"
                          ? "RESTRICTED INTERVIEW ELIGIBILITY"
                          : "NOT ELIGIBLE TO SIT IN INTERVIEWS"}
                      </h3>
                    </div>

                    <span
                      className={`badge ${
                        generalEval.status === "Eligible"
                          ? "badge-ready"
                          : generalEval.status === "Restricted"
                          ? "badge-developing"
                          : "badge-risk"
                      }`}
                      style={{ fontSize: 13, padding: "4px 12px" }}
                    >
                      {generalEval.status.toUpperCase()}
                    </span>
                  </div>

                  <div style={{ fontSize: 12, lineHeight: 1.6, color: "var(--cp-text-secondary)" }}>
                    <div style={{ display: "flex", gap: 16, margin: "6px 0" }}>
                      <span>
                        Attendance Requirement:{" "}
                        <b style={{ color: isAttPassed ? "var(--cp-success)" : "var(--cp-error)" }}>
                          {isAttPassed ? "Passed (> 75%) ✓" : "Failed (≤ 75%) ✗"}
                        </b>
                      </span>
                      <span>·</span>
                      <span>
                        CGPA Tier: <b>{generalEval.tierDisplay}</b> ({selectedStudent.cgpa.toFixed(2)})
                      </span>
                    </div>

                    <p style={{ margin: "4px 0" }}>
                      <b>Reason / Guidance:</b> {generalEval.reason}
                    </p>

                    {generalEval.eligibleForSummary && generalEval.status !== "Not Eligible" && (
                      <p style={{ margin: "2px 0", color: "var(--cp-success)" }}>
                        <b>Eligible for:</b> {generalEval.eligibleForSummary}
                      </p>
                    )}

                    {generalEval.notEligibleForSummary && (
                      <p style={{ margin: "2px 0", color: "var(--cp-error)" }}>
                        <b>Not eligible for:</b> {generalEval.notEligibleForSummary}
                      </p>
                    )}
                  </div>
                </div>

                {/* Company-Specific Cutoff Evaluation Matrix (§15, §18) */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span className="eyebrow-tag">
                      Company Placement Drive Specific Qualifications
                    </span>
                    <span style={{ fontSize: 11, color: "var(--cp-text-secondary)" }}>
                      Drive Cutoff vs Candidate Standing
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {PLACEMENT_DRIVE_CUTOFFS.map((drive) => {
                      const driveEval = calculateInterviewEligibility({
                        cgpa: selectedStudent.cgpa,
                        totalAttendance: selectedStudent.totalAttendance,
                        interviewCgpaCutoff: drive.minCgpa,
                        driveName: drive.company
                      });

                      const isDriveEligible = driveEval.status === "Eligible";

                      return (
                        <div
                          key={drive.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px 14px",
                            border: "1px solid var(--cp-border)",
                            borderRadius: "var(--cp-radius-sm)",
                            background: isDriveEligible
                              ? "rgba(16, 185, 129, 0.04)"
                              : "rgba(239, 68, 68, 0.03)",
                            fontSize: 12
                          }}
                        >
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <b>{drive.company}</b>
                              <span style={{ color: "var(--cp-text-secondary)" }}>— {drive.role}</span>
                            </div>
                            <span style={{ fontSize: 11, color: "var(--cp-text-secondary)" }}>
                              Required Cutoff: <b>≥ {drive.minCgpa} CGPA</b> · Package: {drive.package}
                            </span>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 11, color: "var(--cp-text-secondary)" }}>
                              {!isAttPassed
                                ? "Attendance ≤ 75%"
                                : selectedStudent.cgpa < drive.minCgpa
                                ? `CGPA (${selectedStudent.cgpa.toFixed(2)}) < ${drive.minCgpa}`
                                : `CGPA ${selectedStudent.cgpa.toFixed(2)} ≥ ${drive.minCgpa}`}
                            </span>
                            <span
                              className={`badge ${isDriveEligible ? "badge-ready" : "badge-risk"}`}
                            >
                              {isDriveEligible ? "Eligible ✓" : "Not Eligible ✗"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Session Logs */}
                {selectedStudent.recentSessions && selectedStudent.recentSessions.length > 0 && (
                  <div>
                    <span className="eyebrow-tag" style={{ marginBottom: 8, display: "block" }}>
                      Recent Attendance Log
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
                            border: "1px solid var(--cp-border)",
                            borderRadius: "var(--cp-radius-sm)",
                            fontSize: 12
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span className="badge badge-neutral" style={{ fontSize: 10 }}>
                              {s.type}
                            </span>
                            <b>{s.subject}</b>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ color: "var(--cp-text-secondary)" }}>{s.date}</span>
                            <span className={`badge ${s.attended ? "badge-ready" : "badge-risk"}`}>
                              {s.attended ? "Attended ✓" : "Absent ✗"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Audit Source & Timestamp (§24) */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    background: "var(--cp-surface-muted)",
                    borderRadius: "var(--cp-radius-sm)",
                    fontSize: 12,
                    color: "var(--cp-text-secondary)"
                  }}
                >
                  <span><b>Data Source:</b> Demo / University ERP Attendance Gateway</span>
                  <span><b>Last Synced:</b> {selectedStudent.lastUpdated}</span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer-bar">
                <button className="btn btn-primary" onClick={() => setSelectedStudent(null)}>
                  Close Audit Report
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
