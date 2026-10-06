import React, { useState } from "react";
import { Video, Clock, Award, CheckCircle2, ChevronRight, Play, Sparkles, AlertCircle } from "lucide-react";
import { AIInterviewSession } from "../types";
import { initialInterviews } from "../data/mockData";

interface AIInterviewsPageProps {
  onStartLiveInterview: (company: string, roleTitle: string) => void;
  onViewResult: (session: AIInterviewSession) => void;
}

export const AIInterviewsPage: React.FC<AIInterviewsPageProps> = ({
  onStartLiveInterview,
  onViewResult
}) => {
  const [targetCompany, setTargetCompany] = useState("TCS");
  const [interviewType, setInterviewType] = useState<"Technical" | "HR" | "Behavioral">("Technical");

  return (
    <div>
      <div className="page-header-block">
        <div>
          <span className="eyebrow-tag">AI Placement Interview Simulator</span>
          <h1 className="page-title">AI Online Interviews & Technical Defense</h1>
          <p className="page-description">
            First-class interactive placement interview simulation evaluating algorithm complexity explanations, problem solving, and technical communication.
          </p>
        </div>

        <div className="page-actions-group">
          <button
            className="btn btn-primary"
            onClick={() => onStartLiveInterview(targetCompany, `${targetCompany} Software Engineer`)}
          >
            <Play size={15} /> Start AI Interview Session
          </button>
        </div>
      </div>

      {/* Featured Interview Landing Banner */}
      <div className="workshop-hero-card" style={{ marginBottom: 24 }}>
        <div className="workshop-hero-content">
          <span className="eyebrow-tag" style={{ color: "var(--cp-grey-400)" }}>
            Next Scheduled Interview Milestone
          </span>
          <h2>{targetCompany} — Digital Software Engineer Mock Round</h2>
          <p>
            10 AI-generated technical questions calibrated to TCS Digital campus hiring criteria. Responses are transcribed and scored on technical correctness, time-complexity rigor, and structured articulation.
          </p>

          <div className="tag-cluster">
            <span>Duration: 20 min</span>
            <span>Questions: 10</span>
            <span>Type: Technical / OOP / DSA</span>
            <span>Status: Ready to Launch</span>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              className="btn btn-primary"
              style={{ backgroundColor: "var(--cp-white)", color: "var(--cp-black)" }}
              onClick={() => onStartLiveInterview(targetCompany, "Digital Software Engineer")}
            >
              <Video size={16} /> Enter Live Interview Room
            </button>
          </div>
        </div>

        <div className="workshop-hero-stats">
          <span style={{ color: "var(--cp-grey-400)", fontSize: 11, textTransform: "uppercase" }}>
            Benchmark Target
          </span>
          <strong style={{ fontSize: 36, color: "var(--cp-white)", margin: "4px 0" }}>75+</strong>
          <span style={{ color: "var(--cp-grey-300)" }}>Pass threshold for Stage 3</span>
        </div>
      </div>

      {/* Configuration & Quick Launch Card */}
      <div className="grid-2col">
        <div className="cp-card">
          <div className="card-title-bar">
            <div>
              <h3>Configure New Practice Session</h3>
              <p>Select target company and role focus</p>
            </div>
            <Sparkles size={16} style={{ color: "var(--cp-black)" }} />
          </div>

          <div className="form-row-2col">
            <div className="form-group">
              <label className="form-label">Target Company</label>
              <select
                className="form-select"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
              >
                <option value="TCS">Tata Consultancy Services (TCS)</option>
                <option value="Infosys">Infosys</option>
                <option value="Deloitte">Deloitte</option>
                <option value="Accenture">Accenture</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Interview Type</label>
              <select
                className="form-select"
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value as any)}
              >
                <option value="Technical">Technical Defense & System Fundamentals</option>
                <option value="HR">HR & Fitment</option>
                <option value="Behavioral">Behavioral (STAR Method)</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            <div style={{ fontSize: 12, color: "var(--cp-grey-600)" }}>
              <span>Expected duration: <b>20 mins</b> · Web camera & microphone required</span>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => onStartLiveInterview(targetCompany, `${targetCompany} Software Engineer`)}
            >
              Start Session Now <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Evaluation Rubric disclosure */}
        <div className="cp-card">
          <div className="card-title-bar">
            <div>
              <h3>Objective Evaluation Rubric</h3>
              <p>Transparent scoring dimensions</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
            <div style={{ padding: 10, background: "var(--cp-grey-50)", borderRadius: "var(--cp-radius-sm)" }}>
              <b style={{ color: "var(--cp-black)", display: "block" }}>1. Technical Correctness (35%)</b>
              <span style={{ color: "var(--cp-grey-600)", fontSize: 12 }}>
                Algorithms, edge-case coverage, and computational complexity bounds.
              </span>
            </div>

            <div style={{ padding: 10, background: "var(--cp-grey-50)", borderRadius: "var(--cp-radius-sm)" }}>
              <b style={{ color: "var(--cp-black)", display: "block" }}>2. Problem Solving Structure (25%)</b>
              <span style={{ color: "var(--cp-grey-600)", fontSize: 12 }}>
                Logical progression from initial hypothesis to verified implementation.
              </span>
            </div>

            <div style={{ padding: 10, background: "var(--cp-grey-50)", borderRadius: "var(--cp-radius-sm)" }}>
              <b style={{ color: "var(--cp-black)", display: "block" }}>3. Communication Clarity (25%)</b>
              <span style={{ color: "var(--cp-grey-600)", fontSize: 12 }}>
                Crisp speech pacing and structured explanation without digression.
              </span>
            </div>

            <div style={{ padding: 10, background: "var(--cp-grey-50)", borderRadius: "var(--cp-radius-sm)" }}>
              <b style={{ color: "var(--cp-black)", display: "block" }}>4. Answer Relevance (15%)</b>
              <span style={{ color: "var(--cp-grey-600)", fontSize: 12 }}>
                Direct addressing of core prompts without repetitive filler.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Previous Completed Interviews Table */}
      <div className="cp-card" style={{ marginTop: 24 }}>
        <div className="card-title-bar">
          <div>
            <h3>Completed AI Interview History</h3>
            <p>Review scored transcripts and diagnostic feedback</p>
          </div>
        </div>

        <div className="table-container">
          <table className="cp-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Role & Stage</th>
                <th>Interview Date</th>
                <th>Duration</th>
                <th>Overall Score</th>
                <th>Status</th>
                <th>Detailed Feedback</th>
              </tr>
            </thead>
            <tbody>
              {initialInterviews.map((item) => (
                <tr key={item.id}>
                  <td>
                    <b>{item.company}</b>
                  </td>
                  <td>
                    {item.role} ({item.type})
                  </td>
                  <td>{item.date || "Today"}</td>
                  <td>{item.durationMinutes} min</td>
                  <td>
                    {item.score ? (
                      <b style={{ fontSize: 14 }}>{item.score}/100</b>
                    ) : (
                      <span style={{ color: "var(--cp-grey-500)" }}>Pending</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${item.status === "Completed" ? "badge-ready" : "badge-neutral"}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    {item.score ? (
                      <button className="btn btn-sm btn-secondary" onClick={() => onViewResult(item)}>
                        View Rubric Breakdown
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => onStartLiveInterview(item.company, item.role)}
                      >
                        Resume
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
