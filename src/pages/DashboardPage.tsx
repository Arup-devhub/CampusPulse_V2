import React from "react";
import {
  Users, Target, Briefcase, AlertTriangle, ArrowRight,
  TrendingUp, Award, Calendar, CheckCircle2, ChevronDown,
  Sparkles, Video, BookOpen, Clock, FileText, Zap, UserCheck
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, BarChart, Bar
} from "recharts";
import { Role, Page } from "../types";
import { UserProfile } from "../services/authService";
import { initialDrives, initialSkillGaps, initialRecommendations, initialStudents } from "../data/mockData";

interface DashboardPageProps {
  role: Role;
  currentUser?: UserProfile;
  onNavigate: (page: Page) => void;
  onOpenWorkshopBuilder: () => void;
  onStartInterview: () => void;
  onStartAssessment: () => void;
}

const readinessTrend = [
  { name: "Jun", value: 52 },
  { name: "Jul", value: 58 },
  { name: "Aug", value: 61 },
  { name: "Sep", value: 66 },
  { name: "Oct", value: 74 }
];

export const DashboardPage: React.FC<DashboardPageProps> = ({
  role,
  currentUser,
  onNavigate,
  onOpenWorkshopBuilder,
  onStartInterview,
  onStartAssessment
}) => {
  const isStudent = role === "Student";
  const isPlacementAdmin = role === "Placement Admin";
  const isRecruiter = role === "Recruiter";
  const userName = currentUser?.name || (isStudent ? "Student" : isRecruiter ? "Recruiter" : "Placement Officer");

  return (
    <div>
      {/* Page Header */}
      <div className="page-header-block">
        <div>
          <span className="eyebrow-tag">
            {isStudent ? "Student Placement Hub" : isRecruiter ? "Corporate Recruiter Portal" : "Placement Command Center"}
          </span>
          <h1 className="page-title">
            {isStudent
              ? `Good morning, ${userName}`
              : isRecruiter
              ? `${currentUser?.companyName || "Corporate"} Campus Recruitment Dashboard`
              : `Placement Operations & Readiness Overview — ${userName}`}
          </h1>
          <p className="page-description">
            {isStudent
              ? "Track your target company readiness, close measured skill gaps, and complete recommended placement milestones."
              : isRecruiter
              ? "Review shortlisted candidate pipelines, company-specific readiness benchmarks, and assessment integrity."
              : "Monitor cohort readiness, identify at-risk students across branches, and deploy targeted college interventions."}
          </p>
        </div>

        <div className="page-actions-group">
          {/* §50: Role-specific action buttons */}
          {isStudent ? (
            <>
              <button className="btn btn-secondary" onClick={onStartAssessment}>
                <Clock size={15} /> Practice Assessment
              </button>
              <button className="btn btn-primary" onClick={onStartInterview}>
                <Video size={15} /> Enter Mock Interview Room
              </button>
            </>
          ) : isRecruiter ? (
            <button className="btn btn-primary" onClick={() => onNavigate("AI Matching")}>
              <Sparkles size={15} /> Candidate Match AI
            </button>
          ) : (
            <button className="btn btn-primary" onClick={onOpenWorkshopBuilder}>
              <BookOpen size={15} /> Create Workshop Intervention
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <section className="stat-kpi-grid">
        <div className="stat-kpi-card">
          <div className="stat-icon-square">
            <Users size={20} />
          </div>
          <div className="stat-kpi-info">
            <span className="stat-kpi-label">
              {isStudent ? "Active Applications" : isRecruiter ? "Applied Candidates" : "Total Placement Batch"}
            </span>
            <div className="stat-kpi-value">{isStudent ? "8" : isRecruiter ? "1,240" : "1,248"}</div>
            <span className="stat-kpi-delta positive">
              {isStudent ? "2 interviews pending" : isRecruiter ? "94% eligible" : "+8.4% placed vs last year"}
            </span>
          </div>
        </div>

        <div className="stat-kpi-card">
          <div className="stat-icon-square">
            <Target size={20} />
          </div>
          <div className="stat-kpi-info">
            <span className="stat-kpi-label">
              {isStudent ? "Overall Readiness" : isRecruiter ? "Avg Candidate Readiness" : "Placement Ready"}
            </span>
            <div className="stat-kpi-value">{isStudent ? "74%" : isRecruiter ? "74%" : "68%"}</div>
            <span className={`stat-kpi-delta ${isStudent ? "positive" : "neutral"}`}>
              {isStudent ? "+8 pts after latest bootcamp" : "848 students crossing threshold"}
            </span>
          </div>
        </div>

        <div className="stat-kpi-card">
          <div className="stat-icon-square">
            <Briefcase size={20} />
          </div>
          <div className="stat-kpi-info">
            <span className="stat-kpi-label">
              {isStudent ? "Eligible Drives" : isRecruiter ? "Target Talent Pipelines" : "Active Placement Drives"}
            </span>
            <div className="stat-kpi-value">{isStudent ? "6" : isRecruiter ? "3 Roles" : "14"}</div>
            <span className="stat-kpi-delta warning">
              {isStudent ? "TCS Digital in 11 days" : isRecruiter ? "B.Tech CSE & IT Candidates" : "TCS Digital Software Engineer"}
            </span>
          </div>
        </div>

        <div className="stat-kpi-card">
          <div className="stat-icon-square">
            <AlertTriangle size={20} />
          </div>
          <div className="stat-kpi-info">
            <span className="stat-kpi-label">
              {isStudent ? "Priority Skill Gaps" : isRecruiter ? "Shortlist Flags" : "Students At Risk"}
            </span>
            <div className="stat-kpi-value">{isStudent ? "3" : isRecruiter ? "14" : "186"}</div>
            <span className="stat-kpi-delta critical">
              {isStudent ? "DSA & C++ high priority" : isRecruiter ? "Under integrity review" : "Require intervention"}
            </span>
          </div>
        </div>
      </section>

      {/* Main Grid: Readiness Trend & Target Company / Intervention Impact */}
      <div className="grid-2col">
        {/* Trend chart */}
        <div className="cp-card">
          <div className="card-title-bar">
            <div>
              <h3>{isStudent ? "Your Readiness Progression" : "Cohort Placement Readiness Curve"}</h3>
              <p>Continuous evaluation across Aptitude, Technical, and Mock stages</p>
            </div>
            {/* Readiness link only for roles with access */}
            {isStudent && (
              <button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => onNavigate("Readiness")}>
                Details <ArrowRight size={14} />
              </button>
            )}
          </div>

          <div style={{ height: 260, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={readinessTrend}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#111111" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#111111" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#666", fontSize: 12 }} />
                <YAxis domain={[40, 85]} axisLine={false} tickLine={false} tick={{ fill: "#666", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    border: "none",
                    borderRadius: 6,
                    color: "#fff",
                    fontSize: 12
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="#111111" strokeWidth={2.5} fill="url(#areaGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Target company / Impact card */}
        <div className="cp-card">
          <div className="card-title-bar">
            <div>
              <h3>
                {isStudent
                  ? "Target Company: TCS"
                  : isRecruiter
                  ? "Recruitment Benchmarking"
                  : "Intervention Impact Analytics"}
              </h3>
              <p>
                {isStudent
                  ? "Readiness across recruitment stages"
                  : isRecruiter
                  ? "Candidate readiness against institutional cutoffs"
                  : "Results from completed placement bootcamps"}
              </p>
            </div>
            <span className={`badge ${isStudent ? "badge-ready" : "badge-neutral"}`}>
              {isStudent ? "74% Ready" : "Institutional"}
            </span>
          </div>

          {isStudent ? (
            <>
              <div className="readiness-score-display">
                <div className="score-number">74</div>
                <div className="score-sub">Target Score: 75 · Low Barrier Risk</div>
              </div>

              <div className="stage-breakdown-list">
                <div className="stage-item-row">
                  <div className="stage-label-meta">
                    <b>Aptitude & Logical</b>
                    <span>82% · Ready</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-bar success" style={{ width: "82%" }} />
                  </div>
                </div>

                <div className="stage-item-row">
                  <div className="stage-label-meta">
                    <b>Technical Screening</b>
                    <span>61% · Developing</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-bar warning" style={{ width: "61%" }} />
                  </div>
                </div>

                <div className="stage-item-row">
                  <div className="stage-label-meta">
                    <b>Live Coding / DSA</b>
                    <span>55% · At Risk</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-bar danger" style={{ width: "55%" }} />
                  </div>
                </div>

                <div className="stage-item-row">
                  <div className="stage-label-meta">
                    <b>Technical Interview</b>
                    <span>74% · Ready</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-bar success" style={{ width: "74%" }} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div>
              <div style={{ textAlign: "center", padding: "16px 0 20px" }}>
                <span style={{ fontSize: 11, color: "var(--cp-grey-500)", textTransform: "uppercase" }}>
                  Average Readiness Improvement
                </span>
                <div style={{ fontSize: 44, fontWeight: 800, color: "var(--cp-black)" }}>+18.6%</div>
                <span style={{ fontSize: 12, color: "var(--cp-success)", fontWeight: 600 }}>
                  After college intervention workshops
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: "var(--cp-grey-600)" }}>Students crossing readiness threshold</span>
                    <b>72% (90 of 125)</b>
                  </div>
                  <div className="progress-track">
                    <div className="progress-bar success" style={{ width: "72%" }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: "var(--cp-grey-600)" }}>Bootcamp attendance consistency</span>
                    <b>89% rate</b>
                  </div>
                  <div className="progress-track">
                    <div className="progress-bar" style={{ width: "89%" }} />
                  </div>
                </div>
              </div>

              {isPlacementAdmin && (
                <div style={{ marginTop: 22 }}>
                  <button className="btn btn-secondary btn-block" onClick={() => onNavigate("Workshops")}>
                    Manage All Workshops <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lower Grid: Role-specific cards (§50: Match exact role access) */}
      <div className="grid-equal-2col">
        {/* Left card */}
        <div className="cp-card">
          <div className="card-title-bar">
            <div>
              <h3>
                {isStudent
                  ? "Personalized Action Plan"
                  : isRecruiter
                  ? "Top AI-Matched Candidates"
                  : "Top Skill Gaps Requiring Intervention"}
              </h3>
              <p>
                {isStudent
                  ? "Ranked by target company recruitment criteria"
                  : isRecruiter
                  ? "Pre-screened candidates matching open role requirements"
                  : "Aggregated student counts across active cohorts"}
              </p>
            </div>
            {isStudent && (
              <button
                className="btn-ghost"
                style={{ fontSize: 12 }}
                onClick={() => onNavigate("Recommendations")}
              >
                View all
              </button>
            )}
            {isPlacementAdmin && (
              <button
                className="btn-ghost"
                style={{ fontSize: 12 }}
                onClick={() => onNavigate("Skill Gaps")}
              >
                View all
              </button>
            )}
            {isRecruiter && (
              <button
                className="btn-ghost"
                style={{ fontSize: 12 }}
                onClick={() => onNavigate("AI Matching")}
              >
                AI Match <ArrowRight size={12} />
              </button>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {isStudent ? (
              initialRecommendations.slice(0, 3).map((rec) => (
                <div
                  key={rec.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px",
                    borderRadius: "var(--cp-radius-sm)",
                    border: "1px solid var(--cp-grey-200)",
                    backgroundColor: "var(--cp-white)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 4,
                        background: "var(--cp-grey-100)",
                        display: "grid",
                        placeItems: "center",
                        color: "var(--cp-black)"
                      }}
                    >
                      <Zap size={16} />
                    </div>
                    <div>
                      <b style={{ fontSize: 13, color: "var(--cp-black)", display: "block" }}>{rec.title}</b>
                      <span style={{ fontSize: 11, color: "var(--cp-grey-500)" }}>
                        {rec.category} · {rec.estimatedEffort} · Target: {rec.companyTarget}
                      </span>
                    </div>
                  </div>

                  <span className={`badge ${rec.priority === "High" ? "badge-risk" : "badge-developing"}`}>
                    {rec.priority}
                  </span>
                </div>
              ))
            ) : isPlacementAdmin ? (
              initialSkillGaps.slice(0, 3).map((gap) => (
                <div
                  key={gap.skill}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px",
                    borderRadius: "var(--cp-radius-sm)",
                    border: "1px solid var(--cp-grey-200)"
                  }}
                >
                  <div>
                    <b style={{ fontSize: 13, color: "var(--cp-black)", display: "block" }}>{gap.skill}</b>
                    <span style={{ fontSize: 11, color: "var(--cp-grey-500)" }}>
                      {gap.studentsAffected} students below {gap.requiredScore}% · Drive: {gap.linkedCompany}
                    </span>
                  </div>

                  <button className="btn btn-sm btn-secondary" onClick={onOpenWorkshopBuilder}>
                    Intervene
                  </button>
                </div>
              ))
            ) : (
              // Recruiter top candidates view
              initialStudents.slice(0, 3).map((st) => (
                <div
                  key={st.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px",
                    borderRadius: "var(--cp-radius-sm)",
                    border: "1px solid var(--cp-grey-200)"
                  }}
                >
                  <div>
                    <b style={{ fontSize: 13, color: "var(--cp-black)", display: "block" }}>{st.name}</b>
                    <span style={{ fontSize: 11, color: "var(--cp-grey-500)" }}>
                      {st.branch.split(" ")[0]} · CGPA {st.cgpa} · Skills: {st.topSkills.slice(0, 2).join(", ")}
                    </span>
                  </div>

                  <span className="badge badge-ready">{st.readiness}% Match</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right card (§43: Recruiter must NOT see Placement Drives) */}
        <div className="cp-card">
          <div className="card-title-bar">
            <div>
              <h3>
                {isRecruiter ? "Candidate Directory Overview" : "Upcoming Placement Drives"}
              </h3>
              <p>
                {isRecruiter
                  ? "Direct access to evaluated student profiles"
                  : "Active recruitment schedules and eligibility status"}
              </p>
            </div>
            {isRecruiter ? (
              <button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => onNavigate("Students")}>
                View all candidates
              </button>
            ) : (
              <button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => onNavigate("Placement Drives")}>
                All drives
              </button>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {isRecruiter ? (
              initialStudents.slice(3, 6).map((st) => (
                <div
                  key={st.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px",
                    borderRadius: "var(--cp-radius-sm)",
                    border: "1px solid var(--cp-grey-200)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 4,
                        background: "var(--cp-grey-100)",
                        display: "grid",
                        placeItems: "center",
                        fontWeight: 700,
                        fontSize: 12
                      }}
                    >
                      {st.name[0]}
                    </div>
                    <div>
                      <b style={{ fontSize: 13, color: "var(--cp-black)", display: "block" }}>{st.name}</b>
                      <span style={{ fontSize: 11, color: "var(--cp-grey-500)" }}>
                        {st.branch.split(" ")[0]} · Semester {st.semester}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span className="badge badge-neutral">{st.placementStatus}</span>
                  </div>
                </div>
              ))
            ) : (
              initialDrives.slice(0, 3).map((d) => (
                <div
                  key={d.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px",
                    borderRadius: "var(--cp-radius-sm)",
                    border: "1px solid var(--cp-grey-200)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 4,
                        background: "var(--cp-near-black)",
                        color: "var(--cp-white)",
                        display: "grid",
                        placeItems: "center",
                        fontWeight: 700,
                        fontSize: 12
                      }}
                    >
                      {d.company[0]}
                    </div>
                    <div>
                      <b style={{ fontSize: 13, color: "var(--cp-black)", display: "block" }}>{d.company}</b>
                      <span style={{ fontSize: 11, color: "var(--cp-grey-500)" }}>
                        {d.role} · Drive Date: {d.driveDate}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--cp-black)", display: "block" }}>
                      {d.package}
                    </span>
                    <span className="badge badge-ready">{d.avgReadiness}% Ready</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
