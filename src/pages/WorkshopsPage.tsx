import React, { useState, useEffect } from "react";
import {
  BookOpen, Users, Calendar, CheckCircle2, TrendingUp, Plus,
  ArrowRight, Clock, Check, X, Eye, ThumbsUp, ThumbsDown
} from "lucide-react";
import { WorkshopCohort, Role, WorkshopRequest } from "../types";
import { workshopRequestService } from "../services/workshopRequestService";

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
  const isPlacementAdmin = role === "Placement Admin";

  // Placement Admin: Incoming Workshop Requests (§8)
  const [incomingRequests, setIncomingRequests] = useState<WorkshopRequest[]>(() =>
    workshopRequestService.getAllRequests()
  );
  const [selectedRequestForView, setSelectedRequestForView] = useState<WorkshopRequest | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsub = workshopRequestService.subscribe((reqs) => {
      setIncomingRequests(reqs);
    });
    return unsub;
  }, []);

  const handleApproveRequest = (req: WorkshopRequest) => {
    workshopRequestService.updateRequestStatus(req.id, "Approved");
    setToastMessage(`Approved intervention request for ${req.studentName} (${req.skill}). Ready to deploy.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleRejectRequest = (req: WorkshopRequest) => {
    workshopRequestService.updateRequestStatus(req.id, "Rejected");
    setToastMessage(`Intervention request for ${req.studentName} marked as Rejected.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div>
      {/* Toast Notification */}
      {toastMessage && (
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
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="page-header-block">
        <div>
          <span className="eyebrow-tag">College Intervention System</span>
          <h1 className="page-title">
            {isPlacementAdmin ? "Workshop & Intervention" : "Workshops & Placement Interventions"}
          </h1>
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

      {/* SECTION §8: INCOMING WORKSHOP REQUESTS (Placement Admin view) */}
      {isPlacementAdmin && (
        <div className="cp-card" style={{ marginBottom: 24 }}>
          <div className="card-title-bar">
            <div>
              <h3>Incoming Workshop Requests</h3>
              <p>Student-submitted intervention requests based on measured skill gaps</p>
            </div>
            <span className="badge badge-developing">
              {incomingRequests.filter((r) => r.status === "Pending").length} Pending Review
            </span>
          </div>

          <div className="table-container">
            <table className="cp-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Skill Gap</th>
                  <th>Current Score</th>
                  <th>Required Score</th>
                  <th>Priority</th>
                  <th>Linked Drive</th>
                  <th>Requested On</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {incomingRequests.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: 24, color: "var(--cp-grey-500)" }}>
                      No incoming student workshop requests at this time.
                    </td>
                  </tr>
                ) : (
                  incomingRequests.map((req) => (
                    <tr key={req.id}>
                      <td>
                        <b>{req.studentName}</b>
                        <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>
                          {req.studentRegNo} · {req.studentBranch.split(" ")[0]}
                        </span>
                      </td>
                      <td>
                        <b>{req.skill}</b>
                      </td>
                      <td>{req.currentScore}%</td>
                      <td>{req.requiredScore}%</td>
                      <td>
                        <span
                          className={`badge ${
                            req.priority === "Critical"
                              ? "badge-risk"
                              : req.priority === "High"
                              ? "badge-developing"
                              : "badge-neutral"
                          }`}
                        >
                          {req.priority}
                        </span>
                      </td>
                      <td>{req.linkedDrive}</td>
                      <td>{req.requestedOn}</td>
                      <td>
                        <span
                          className={`badge ${
                            req.status === "Approved" || req.status === "Scheduled"
                              ? "badge-ready"
                              : req.status === "Pending"
                              ? "badge-developing"
                              : "badge-risk"
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: 6 }}>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => setSelectedRequestForView(req)}
                            title="View request details"
                            aria-label={`View ${req.studentName}'s request`}
                          >
                            <Eye size={12} /> View
                          </button>

                          {req.status === "Pending" && (
                            <>
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleApproveRequest(req)}
                                title="Approve and feed into workshop workflow"
                                aria-label={`Approve ${req.studentName}'s request`}
                              >
                                <Check size={12} /> Approve
                              </button>
                              <button
                                className="btn btn-sm btn-ghost"
                                onClick={() => handleRejectRequest(req)}
                                style={{ color: "var(--cp-error)" }}
                                title="Reject request"
                                aria-label={`Reject ${req.studentName}'s request`}
                              >
                                <X size={12} /> Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

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

      {/* View Request Modal Dialog */}
      {selectedRequestForView && (
        <div
          className="modal-backdrop-layer"
          onClick={() => setSelectedRequestForView(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="modal-card-box"
            style={{ width: "min(520px, 94vw)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-bar">
              <div>
                <h2>Workshop Request Details</h2>
                <span style={{ fontSize: 12, color: "var(--cp-grey-500)" }}>
                  Submitted by {selectedRequestForView.studentName} on {selectedRequestForView.requestedOn}
                </span>
              </div>
              <button
                className="btn-ghost"
                onClick={() => setSelectedRequestForView(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-scroll" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  padding: 14,
                  background: "var(--cp-surface-muted)",
                  borderRadius: "var(--cp-radius-sm)"
                }}
              >
                <div>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-500)", textTransform: "uppercase" }}>Student</span>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{selectedRequestForView.studentName}</div>
                  <span style={{ fontSize: 12, color: "var(--cp-grey-600)" }}>
                    {selectedRequestForView.studentRegNo} ({selectedRequestForView.studentBranch})
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-500)", textTransform: "uppercase" }}>Linked Drive</span>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{selectedRequestForView.linkedDrive}</div>
                  <span className="badge badge-developing" style={{ marginTop: 4 }}>
                    {selectedRequestForView.priority} Priority
                  </span>
                </div>
              </div>

              <div>
                <span style={{ fontSize: 11, color: "var(--cp-grey-500)", textTransform: "uppercase" }}>Skill / Deficit</span>
                <div style={{ fontSize: 15, fontWeight: 700, margin: "2px 0 6px" }}>{selectedRequestForView.skill}</div>
                <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
                  <span>Current Score: <b>{selectedRequestForView.currentScore}%</b></span>
                  <span>Required Cutoff: <b>{selectedRequestForView.requiredScore}%</b></span>
                  <span style={{ color: "var(--cp-error)", fontWeight: 700 }}>
                    Gap: -{selectedRequestForView.requiredScore - selectedRequestForView.currentScore} pts
                  </span>
                </div>
              </div>

              <div>
                <span style={{ fontSize: 11, color: "var(--cp-grey-500)", textTransform: "uppercase" }}>System Diagnostic Reason</span>
                <p style={{ fontSize: 13, color: "var(--cp-text-secondary)", marginTop: 4 }}>
                  {selectedRequestForView.reason}
                </p>
              </div>

              {selectedRequestForView.additionalMessage && (
                <div>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-500)", textTransform: "uppercase" }}>Student Note</span>
                  <p style={{ fontSize: 13, background: "var(--cp-surface-muted)", padding: 10, borderRadius: "var(--cp-radius-sm)", marginTop: 4 }}>
                    "{selectedRequestForView.additionalMessage}"
                  </p>
                </div>
              )}
            </div>

            <div className="modal-footer-bar">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedRequestForView(null)}
              >
                Close
              </button>

              {selectedRequestForView.status === "Pending" && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      handleRejectRequest(selectedRequestForView);
                      setSelectedRequestForView(null);
                    }}
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      handleApproveRequest(selectedRequestForView);
                      setSelectedRequestForView(null);
                    }}
                  >
                    Approve Request
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
