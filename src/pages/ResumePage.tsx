import React, { useState } from "react";
import { Sparkles, FileText, Download, Send, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export const ResumePage: React.FC = () => {
  const [selectedJd, setSelectedJd] = useState("TCS");
  const [analyzing, setAnalyzing] = useState(false);
  const [matchScore, setMatchScore] = useState(86);
  const [isGenerated, setIsGenerated] = useState(true);

  const jds: Record<string, { company: string; role: string; text: string; requirements: string[] }> = {
    TCS: {
      company: "Tata Consultancy Services (TCS)",
      role: "Digital Software Engineer",
      text: "Seeking strong candidates proficient in Data Structures, Object-Oriented C++, Relational Databases (SQL), Git version control, and RESTful web microservices.",
      requirements: ["DSA & Problem Solving", "C++ OOP", "SQL & Database Schemas", "Git", "REST APIs"]
    },
    Infosys: {
      company: "Infosys",
      role: "Specialist Programmer",
      text: "Requires solid foundations in Core Java / Python, complex SQL query tuning, Spring Boot / FastAPI backend design, and clean architecture.",
      requirements: ["Java / Python", "SQL Query Tuning", "Backend Frameworks", "Clean Architecture"]
    }
  };

  const currentJd = jds[selectedJd] || jds.TCS;

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setMatchScore(92);
      alert("JD analyzed against verified student credentials: Match increased to 92% based on completed Distributed Systems capstone project.");
    }, 600);
  };

  return (
    <div>
      <div className="page-header-block">
        <div>
          <span className="eyebrow-tag">Verified Resume Intelligence</span>
          <h1 className="page-title">JD-Targeted Resume Generator</h1>
          <p className="page-description">
            Extracts hiring criteria from job descriptions and formats an institutional resume using strictly verified student coursework and credentials.
          </p>
        </div>

        <div className="page-actions-group">
          <button className="btn btn-secondary" onClick={() => alert("Resume exported as standardized PDF format.")}>
            <Download size={15} /> Download PDF
          </button>
          <button className="btn btn-primary" onClick={() => alert("Verified resume dispatched to company placement portal.")}>
            <Send size={15} /> Send to Placement Cell
          </button>
        </div>
      </div>

      <div className="grid-2col">
        {/* Left: Job Description & Extraction */}
        <div className="cp-card">
          <div className="card-title-bar">
            <div>
              <h3>Target Job Description</h3>
              <p>Select or paste company requirements</p>
            </div>
            <select
              className="filter-select"
              value={selectedJd}
              onChange={(e) => setSelectedJd(e.target.value)}
            >
              <option value="TCS">TCS — Digital Software Engineer</option>
              <option value="Infosys">Infosys — Specialist Programmer</option>
            </select>
          </div>

          <div className="form-group">
            <textarea
              className="form-textarea"
              rows={6}
              value={currentJd.text}
              readOnly
              style={{ fontSize: 13, lineHeight: 1.5 }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <span className="eyebrow-tag">Extracted Requirements</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
              {currentJd.requirements.map((req, i) => (
                <span key={i} className="badge badge-dark">
                  {req}
                </span>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: "16px",
              background: "var(--cp-grey-50)",
              border: "1px solid var(--cp-grey-200)",
              borderRadius: "var(--cp-radius-sm)",
              marginBottom: 16
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--cp-black)" }}>
                Verified Profile Match Score
              </span>
              <strong style={{ fontSize: 24, color: "var(--cp-black)" }}>{matchScore}%</strong>
            </div>
            <div className="progress-track" style={{ marginTop: 8 }}>
              <div className="progress-bar success" style={{ width: `${matchScore}%` }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12, fontSize: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--cp-success)" }}>
                <CheckCircle2 size={14} /> <span>DSA & C++ verified via College Diagnostic Assessment</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--cp-success)" }}>
                <CheckCircle2 size={14} /> <span>Git workflow verified via linked GitHub repository</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--cp-warning)" }}>
                <AlertTriangle size={14} /> <span>REST APIs documented in coursework; awaiting post-assessment</span>
              </div>
            </div>
          </div>

          <button
            className="btn btn-secondary btn-block"
            onClick={handleAnalyze}
            disabled={analyzing}
          >
            <Sparkles size={14} />
            <span>{analyzing ? "Analyzing verified credentials..." : "Re-Analyze Profile Against JD"}</span>
          </button>
        </div>

        {/* Right: Generated Institutional Resume Preview */}
        <div className="cp-card">
          <div className="card-title-bar">
            <div>
              <h3>Institutional Resume Preview</h3>
              <p>Verified data only — Zero AI fabrication</p>
            </div>
            <span className="badge badge-ready">Verified Clean</span>
          </div>

          {/* Standard Academic Resume Paper Preview */}
          <div
            style={{
              border: "1px solid var(--cp-grey-300)",
              background: "var(--cp-white)",
              padding: "24px",
              borderRadius: "var(--cp-radius-sm)",
              fontSize: 12,
              lineHeight: 1.5,
              color: "var(--cp-grey-900)"
            }}
          >
            {/* Header */}
            <div style={{ textAlign: "center", borderBottom: "2px solid var(--cp-black)", paddingBottom: 12, marginBottom: 14 }}>
              <h2 style={{ fontSize: 20, color: "var(--cp-black)", letterSpacing: -0.5 }}>Priyanshu Dash</h2>
              <p style={{ fontSize: 11, color: "var(--cp-grey-600)", marginTop: 2 }}>
                B.Tech in Computer Science & Engineering · Reg No: 2101297042
              </p>
              <p style={{ fontSize: 11, color: "var(--cp-grey-600)" }}>
                priyanshu.d@campus.edu · github.com/priyanshu-dash · linkedin.com/in/priyanshu-dash
              </p>
            </div>

            {/* Education */}
            <div style={{ marginBottom: 12 }}>
              <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid var(--cp-grey-300)", paddingBottom: 2, marginBottom: 6 }}>
                Education
              </h4>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <b>Bachelor of Technology in Computer Science & Engineering</b>
                <span>2023 – 2027</span>
              </div>
              <span style={{ color: "var(--cp-grey-700)" }}>National Institute of Technology · CGPA: 8.42 / 10.0 (0 Backlogs)</span>
            </div>

            {/* Technical Skills */}
            <div style={{ marginBottom: 12 }}>
              <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid var(--cp-grey-300)", paddingBottom: 2, marginBottom: 6 }}>
                Verified Technical Competencies
              </h4>
              <p><b>Languages:</b> C++, Python, SQL, Java (Basic)</p>
              <p><b>Core:</b> Data Structures & Algorithms, Database Management Systems, OOP</p>
              <p><b>Tools:</b> Git, Linux, Docker, RESTful APIs</p>
            </div>

            {/* Academic Projects */}
            <div style={{ marginBottom: 12 }}>
              <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid var(--cp-grey-300)", paddingBottom: 2, marginBottom: 6 }}>
                Verified Projects
              </h4>
              <div style={{ marginBottom: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <b>Distributed Cache Engine (C++ & Redis Protocol)</b>
                  <span>Spring 2026</span>
                </div>
                <p style={{ color: "var(--cp-grey-700)" }}>
                  Implemented multithreaded LRU cache with sub-millisecond lookups and lock-free concurrency.
                </p>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <b>Campus Placement Analytics Service</b>
                  <span>Autumn 2026</span>
                </div>
                <p style={{ color: "var(--cp-grey-700)" }}>
                  Built deterministic student-company readiness scorer with normalized database schema.
                </p>
              </div>
            </div>

            <div style={{ borderTop: "1px dashed var(--cp-grey-300)", paddingTop: 8, marginTop: 12, display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--cp-grey-500)" }}>
              <ShieldCheck size={14} style={{ color: "var(--cp-success)" }} />
              <span>Certified authentic by CampusPulse Placement Verification Authority.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
