import React, { useState, useEffect } from "react";
import {
  AlertTriangle, BookOpen, ArrowRight, Code, Database,
  MessageSquare, X, CheckCircle2, Clock, Check
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Page, Role, SkillGapItem, WorkshopRequest } from "../types";
import { UserProfile } from "../services/authService";
import { initialSkillGaps } from "../data/mockData";
import { workshopRequestService } from "../services/workshopRequestService";

interface SkillGapsPageProps {
  onOpenWorkshopBuilder: () => void;
  onNavigate: (page: Page) => void;
  role?: Role;
  currentUser?: UserProfile;
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
  onNavigate,
  role = "Student",
  currentUser
}) => {
  const isStudent = role === "Student";

  // Request for Workshop modal state (§5, §6)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedGap, setSelectedGap] = useState<SkillGapItem>(initialSkillGaps[0]);
  const [additionalMessage, setAdditionalMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Student's workshop requests history (§7)
  const [myRequests, setMyRequests] = useState<WorkshopRequest[]>(() =>
    workshopRequestService.getRequestsForStudent(currentUser?.id || currentUser?.name || "Arup Lenka")
  );

  useEffect(() => {
    const unsub = workshopRequestService.subscribe(() => {
      setMyRequests(
        workshopRequestService.getRequestsForStudent(currentUser?.id || currentUser?.name || "Arup Lenka")
      );
    });
    return unsub;
  }, [currentUser]);

  const handleOpenRequestModal = (gap?: SkillGapItem) => {
    if (gap) {
      setSelectedGap(gap);
    } else {
      setSelectedGap(initialSkillGaps[0]);
    }
    setAdditionalMessage("");
    setIsRequestModalOpen(true);
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      workshopRequestService.submitRequest({
        studentId: currentUser?.id || "std-000",
        studentName: currentUser?.name || "Arup Lenka",
        studentRegNo: currentUser?.regNo || "NIT2025CSE001",
        studentBranch: currentUser?.branch || "Computer Science & Engineering",
        skill: selectedGap.skill,
        currentScore: selectedGap.score,
        requiredScore: selectedGap.requiredScore,
        priority: selectedGap.priority,
        linkedDrive: selectedGap.linkedCompany,
        reason: `Automatically generated from the detected skill gap in ${selectedGap.skill}`,
        additionalMessage: additionalMessage.trim() || undefined
      });

      setIsSubmitting(false);
      setIsRequestModalOpen(false);
      setToastMessage(`Workshop request for ${selectedGap.skill} submitted to Placement Cell.`);
      setTimeout(() => setToastMessage(null), 4500);
    }, 400);
  };

  return (
    <div>
      {/* Toast notification */}
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
          <span className="eyebrow-tag">
            {isStudent ? "Personal Skill Diagnostics" : "Cohort Placement Intelligence"}
          </span>
          <h1 className="page-title">Skill Gap Analysis & Intervention Matrix</h1>
          <p className="page-description">
            {isStudent
              ? "Compares your verified performance directly against company cutoffs to detect barrier gaps and request intervention workshops."
              : "Compares verified student skill levels directly against company recruitment cutoffs to detect barrier gaps."}
          </p>
        </div>

        <div className="page-actions-group">
          {/* §5: A student must NOT create a workshop/cohort. Replace with Request for Workshop */}
          {isStudent ? (
            <button
              className="btn btn-primary"
              onClick={() => handleOpenRequestModal()}
              aria-label="Request for Workshop"
            >
              <BookOpen size={15} /> Request for Workshop
            </button>
          ) : (
            <button className="btn btn-primary" onClick={onOpenWorkshopBuilder}>
              <BookOpen size={15} /> Create Workshop from Cohort
            </button>
          )}
        </div>
      </div>

      {/* Top metrics row */}
      <div className="stat-kpi-grid">
        <div className="stat-kpi-card">
          <div className="stat-icon-square">
            <AlertTriangle size={20} />
          </div>
          <div className="stat-kpi-info">
            <span className="stat-kpi-label">
              {isStudent ? "Identified Skill Gaps" : "Students with Critical Gaps"}
            </span>
            <div className="stat-kpi-value">{isStudent ? "3" : "186"}</div>
            <span className="stat-kpi-delta critical">
              {isStudent ? "2 high-priority deficits" : "14 require intervention today"}
            </span>
          </div>
        </div>

        <div className="stat-kpi-card">
          <div className="stat-icon-square">
            <Code size={20} />
          </div>
          <div className="stat-kpi-info">
            <span className="stat-kpi-label">Highest Priority Gap</span>
            <div className="stat-kpi-value">DSA & DP</div>
            <span className="stat-kpi-delta warning">54% vs 75% cutoff (TCS)</span>
          </div>
        </div>

        <div className="stat-kpi-card">
          <div className="stat-icon-square">
            <Database size={20} />
          </div>
          <div className="stat-kpi-info">
            <span className="stat-kpi-label">Secondary Technical Gap</span>
            <div className="stat-kpi-value">SQL & DBMS</div>
            <span className="stat-kpi-delta neutral">64% vs 70% cutoff</span>
          </div>
        </div>

        <div className="stat-kpi-card">
          <div className="stat-icon-square">
            <BookOpen size={20} />
          </div>
          <div className="stat-kpi-info">
            <span className="stat-kpi-label">
              {isStudent ? "Interventions Available" : "Bootcamp Conversion"}
            </span>
            <div className="stat-kpi-value">{isStudent ? "4" : "72%"}</div>
            <span className="stat-kpi-delta positive">
              {isStudent ? "+18 pts post-workshop gain" : "+18 pts post-workshop"}
            </span>
          </div>
        </div>
      </div>

      {/* Split chart & intervention queue */}
      <div className="grid-2col">
        <div className="cp-card">
          <div className="card-title-bar">
            <div>
              <h3>
                {isStudent ? "Skill Deficit Magnitude by Category" : "Students Affected by Measured Skill Gap"}
              </h3>
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
              <h3>{isStudent ? "Recommended Interventions" : "Direct Intervention Queue"}</h3>
              <p>
                {isStudent
                  ? "Request specialized workshops to clear recruitment thresholds"
                  : "Form workshops instantly for impacted candidate groups"}
              </p>
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
                    Current: {gap.score}% · Target: {gap.requiredScore}% · Drive: {gap.linkedCompany}
                  </span>
                </div>

                {isStudent ? (
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleOpenRequestModal(gap)}
                  >
                    Request Workshop
                  </button>
                ) : (
                  <button className="btn btn-sm btn-primary" onClick={onOpenWorkshopBuilder}>
                    Create Workshop
                  </button>
                )}
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
                <th>Measured Score</th>
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
                    {isStudent ? (
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => handleOpenRequestModal(gap)}
                      >
                        Request Workshop <ArrowRight size={12} />
                      </button>
                    ) : (
                      <button className="btn btn-sm btn-ghost" onClick={onOpenWorkshopBuilder}>
                        Intervene <ArrowRight size={12} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Workshop Requests Status Section (§7) */}
      {isStudent && myRequests.length > 0 && (
        <div className="cp-card" style={{ marginTop: 24 }}>
          <div className="card-title-bar">
            <div>
              <h3>My Workshop Requests</h3>
              <p>Track administrative review status for your requested interventions</p>
            </div>
          </div>

          <div className="table-container">
            <table className="cp-table">
              <thead>
                <tr>
                  <th>Target Skill</th>
                  <th>Priority</th>
                  <th>Linked Drive</th>
                  <th>Submitted Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myRequests.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <b>{req.skill}</b>
                      <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>
                        Score: {req.currentScore}% / Cutoff: {req.requiredScore}%
                      </span>
                    </td>
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
                          req.status === "Approved" || req.status === "Scheduled" || req.status === "Completed"
                            ? "badge-ready"
                            : req.status === "Pending"
                            ? "badge-developing"
                            : "badge-risk"
                        }`}
                      >
                        {req.status === "Pending" ? "Pending Placement Admin Review" : req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Request for Workshop (§6) */}
      {isRequestModalOpen && (
        <div
          className="modal-backdrop-layer"
          onClick={() => setIsRequestModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="modal-card-box"
            style={{ width: "min(560px, 94vw)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-bar">
              <div>
                <h2>Request for Workshop</h2>
                <span style={{ fontSize: 12, color: "var(--cp-grey-500)" }}>
                  Intervention request based on measured placement skill gaps
                </span>
              </div>
              <button
                className="btn-ghost"
                onClick={() => setIsRequestModalOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitRequest}>
              <div className="modal-body-scroll" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Skill / Gap</label>
                  <select
                    className="form-select"
                    value={selectedGap.skill}
                    onChange={(e) => {
                      const matched = initialSkillGaps.find((g) => g.skill === e.target.value);
                      if (matched) setSelectedGap(matched);
                    }}
                  >
                    {initialSkillGaps.map((g) => (
                      <option key={g.skill} value={g.skill}>
                        {g.skill}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row-2col">
                  <div className="form-group">
                    <label className="form-label">Current Score</label>
                    <input
                      type="text"
                      className="form-input"
                      value={`${selectedGap.score}%`}
                      readOnly
                      style={{ background: "var(--cp-surface-muted)" }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Required Score</label>
                    <input
                      type="text"
                      className="form-input"
                      value={`${selectedGap.requiredScore}%`}
                      readOnly
                      style={{ background: "var(--cp-surface-muted)" }}
                    />
                  </div>
                </div>

                <div className="form-row-2col">
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <input
                      type="text"
                      className="form-input"
                      value={selectedGap.priority}
                      readOnly
                      style={{ background: "var(--cp-surface-muted)" }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Linked Placement Drive</label>
                    <input
                      type="text"
                      className="form-input"
                      value={selectedGap.linkedCompany}
                      readOnly
                      style={{ background: "var(--cp-surface-muted)" }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Reason</label>
                  <input
                    type="text"
                    className="form-input"
                    value={`Automatically generated from the detected skill gap in ${selectedGap.skill}`}
                    readOnly
                    style={{ background: "var(--cp-surface-muted)", fontSize: 13 }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Additional Message (Optional)</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Provide additional details regarding topics you'd like covered..."
                    value={additionalMessage}
                    onChange={(e) => setAdditionalMessage(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer-bar">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsRequestModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting Request..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
