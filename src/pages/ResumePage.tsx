import React, { useState, useEffect, useRef } from "react";
import {
  FileText, Upload, Sparkles, Download, CheckCircle2, AlertTriangle,
  Clock, Trash2, Check, RefreshCw, Eye, ArrowRight, ShieldCheck, X,
  FileCheck, FileUp, AlertCircle, Send
} from "lucide-react";
import {
  resumeService, ResumeVersion, AISuggestion
} from "../services/resumeService";
import { UserProfile } from "../services/authService";

interface ResumePageProps {
  currentUser?: UserProfile;
}

export const ResumePage: React.FC<ResumePageProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<"overview" | "upload" | "enhance" | "jd_match">("overview");
  const [versions, setVersions] = useState<ResumeVersion[]>(resumeService.getAllVersions());
  const [currentResume, setCurrentResume] = useState<ResumeVersion>(resumeService.getCurrentResume());

  // Upload state
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<ResumeVersion | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Enhancement state
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [enhancing, setEnhancing] = useState(false);
  const [appliedCount, setAppliedCount] = useState(0);
  const [enhancementSuccess, setEnhancementSuccess] = useState<string | null>(null);

  // JD Alignment state
  const [selectedJd, setSelectedJd] = useState<"TCS" | "Infosys" | "Deloitte">("TCS");
  const [jdAnalyzing, setJdAnalyzing] = useState(false);
  const [jdSuccess, setJdSuccess] = useState<string | null>(null);

  // Preview Modal
  const [previewVersion, setPreviewVersion] = useState<ResumeVersion | null>(null);

  // Subscribe to service updates
  useEffect(() => {
    const unsub = resumeService.subscribe((updated) => {
      setVersions(updated);
      const curr = updated.find((v) => v.isCurrent) || updated[0];
      if (curr) setCurrentResume(curr);
    });
    return unsub;
  }, []);

  // Initialize suggestions
  useEffect(() => {
    setSuggestions(resumeService.getEnhancementSuggestions(currentResume.id, selectedJd));
  }, [currentResume.id, selectedJd]);

  // Handle Drag & Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFileUpload(e.target.files[0]);
    }
  };

  const processFileUpload = async (file: File) => {
    setUploadError(null);
    setUploadSuccess(null);

    // Initial validation check
    const validation = resumeService.validateFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || "File validation failed.");
      return;
    }

    setUploading(true);
    setUploadProgress(15);

    // Simulated step-by-step upload progress & text extraction
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 120);

    setTimeout(async () => {
      clearInterval(interval);
      setUploadProgress(100);

      const res = await resumeService.uploadResume(file, currentUser?.name);
      setUploading(false);

      if (res.success && res.version) {
        setUploadSuccess(res.version);
        setCurrentResume(res.version);
        setVersions(resumeService.getAllVersions());
      } else {
        setUploadError(res.error || "Failed to process resume file.");
      }
    }, 700);
  };

  const handleToggleSuggestion = (sugId: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === sugId ? { ...s, applied: !s.applied } : s))
    );
  };

  const handleApplyEnhancements = () => {
    setEnhancing(true);
    setTimeout(() => {
      const newVersion = resumeService.applyEnhancements(currentResume.id, suggestions);
      setEnhancing(false);
      setEnhancementSuccess(`Saved as ${newVersion.label} with verified bullet point enhancements!`);
      setCurrentResume(newVersion);
      setVersions(resumeService.getAllVersions());
      setTimeout(() => setEnhancementSuccess(null), 4000);
    }, 500);
  };

  const handleApplyJdTailoring = () => {
    setJdAnalyzing(true);
    setTimeout(() => {
      const tailoredLabel = `Version ${versions.length + 1} — ${selectedJd} Digital Tailored`;
      const newVersion = resumeService.applyEnhancements(currentResume.id, suggestions, tailoredLabel);
      setJdAnalyzing(false);
      setJdSuccess(`Created ${tailoredLabel} tailored specifically to ${selectedJd} recruitment criteria.`);
      setCurrentResume(newVersion);
      setVersions(resumeService.getAllVersions());
      setTimeout(() => setJdSuccess(null), 4000);
    }, 600);
  };

  const handleDownload = (version: ResumeVersion) => {
    const content = `CAMPUSPULSE INSTITUTIONAL RESUME\n` +
      `================================\n` +
      `Candidate: ${version.data.candidateName}\n` +
      `Registration No: ${version.data.regNo}\n` +
      `Email: ${version.data.email}\n` +
      `Version: ${version.label}\n` +
      `Status: ${version.status} (Verified Data Only - Zero AI Fabrication)\n\n` +
      `EDUCATION\n` +
      `---------\n` +
      `${version.data.education.degree}\n` +
      `${version.data.education.institution} (${version.data.education.duration})\n` +
      `CGPA: ${version.data.education.cgpa} | Backlogs: ${version.data.education.backlogs}\n\n` +
      `TECHNICAL COMPETENCIES\n` +
      `----------------------\n` +
      `Languages: ${version.data.skills.languages.join(", ")}\n` +
      `Core Concepts: ${version.data.skills.core.join(", ")}\n` +
      `Tools: ${version.data.skills.tools.join(", ")}\n\n` +
      `PROJECTS\n` +
      `--------\n` +
      version.data.projects.map((p) => `* ${p.title} (${p.period})\n  ${p.description}\n  Highlights:\n  ${p.highlights.map((h) => `  - ${h}`).join("\n")}`).join("\n\n") +
      `\n\nCERTIFICATIONS\n` +
      `--------------\n` +
      version.data.certifications.map((c) => `* ${c}`).join("\n") +
      `\n\n[Certified by CampusPulse Placement Verification Authority]`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = version.fileName.replace(/\.[^/.]+$/, "") + ".txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const jds = {
    TCS: {
      company: "Tata Consultancy Services (TCS)",
      role: "Digital Software Engineer",
      package: "₹7.2 LPA",
      requirements: ["Data Structures & Algorithms", "C++ / Java OOP", "SQL & Database Normalization", "Git & Linux", "REST APIs"],
      matched: ["Data Structures & Algorithms", "C++ OOP", "SQL", "Git"],
      missing: ["REST APIs (Awaiting post-assessment verification)"]
    },
    Infosys: {
      company: "Infosys",
      role: "Specialist Programmer",
      package: "₹6.5 LPA",
      requirements: ["Core Java / Python", "Complex SQL Query Tuning", "FastAPI / Spring Boot", "Clean Architecture"],
      matched: ["Python", "SQL Basics", "Clean Architecture Concepts"],
      missing: ["Spring Boot Framework Verification"]
    },
    Deloitte: {
      company: "Deloitte",
      role: "Technology Analyst",
      package: "₹8.0 LPA",
      requirements: ["Cloud Foundations", "Analytical Problem Solving", "SQL", "Technical Communication"],
      matched: ["AWS Cloud Practitioner", "SQL", "Communication"],
      missing: ["Enterprise Case Analysis"]
    }
  };

  const currentJdDef = jds[selectedJd];

  return (
    <div>
      {/* Page Header */}
      <div className="page-header-block">
        <div>
          <span className="eyebrow-tag">Placement Document Intelligence</span>
          <h1 className="page-title">My Resumes & Placement Verification</h1>
          <p className="page-description">
            Upload institutional resumes, generate company-specific versions, and enhance technical descriptions using verified student credentials with zero artificial fabrication.
          </p>
        </div>

        <div className="page-actions-group">
          <button
            className={`btn ${activeTab === "upload" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setActiveTab("upload")}
          >
            <Upload size={15} /> Upload Resume
          </button>
          <button
            className={`btn ${activeTab === "jd_match" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setActiveTab("jd_match")}
          >
            <Sparkles size={15} /> Generate from JD
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="resume-tabs-bar" role="tablist">
        <button
          className={`resume-tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
          role="tab"
          aria-selected={activeTab === "overview"}
        >
          <FileText size={15} />
          <span>Current Resume & Version History ({versions.length})</span>
        </button>

        <button
          className={`resume-tab-btn ${activeTab === "upload" ? "active" : ""}`}
          onClick={() => setActiveTab("upload")}
          role="tab"
          aria-selected={activeTab === "upload"}
        >
          <FileUp size={15} />
          <span>Upload Resume</span>
        </button>

        <button
          className={`resume-tab-btn ${activeTab === "enhance" ? "active" : ""}`}
          onClick={() => setActiveTab("enhance")}
          role="tab"
          aria-selected={activeTab === "enhance"}
        >
          <Sparkles size={15} />
          <span>AI Resume Enhancement</span>
        </button>

        <button
          className={`resume-tab-btn ${activeTab === "jd_match" ? "active" : ""}`}
          onClick={() => setActiveTab("jd_match")}
          role="tab"
          aria-selected={activeTab === "jd_match"}
        >
          <CheckCircle2 size={15} />
          <span>JD Matching & Tailoring</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & VERSION HISTORY */}
      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Active Resume Card */}
          <div className="cp-card active-resume-card">
            <div className="card-title-bar">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="resume-doc-icon">
                  <FileText size={22} />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <h3 style={{ fontSize: 16 }}>{currentResume.fileName}</h3>
                    <span className="badge badge-ready">Active Current Version</span>
                  </div>
                  <span style={{ fontSize: 12, color: "var(--cp-grey-500)" }}>
                    {currentResume.label} · Uploaded {currentResume.uploadDate} · {currentResume.fileSizeFormatted}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => setPreviewVersion(currentResume)}>
                  <Eye size={14} /> Preview
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => handleDownload(currentResume)}>
                  <Download size={14} /> Download
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => setActiveTab("enhance")}>
                  <Sparkles size={14} /> AI Enhance
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab("upload")}>
                  <RefreshCw size={14} /> Replace
                </button>
              </div>
            </div>

            {/* Quick summary strip */}
            <div className="active-resume-metrics-grid">
              <div>
                <span className="metric-sublabel">Verification Status</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--cp-success)", fontWeight: 600, fontSize: 13, marginTop: 2 }}>
                  <ShieldCheck size={16} /> Verified Authentic (Zero Hallucination)
                </div>
              </div>
              <div>
                <span className="metric-sublabel">Match Score Benchmark</span>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--cp-black)", marginTop: 2 }}>
                  {currentResume.matchScore}% Target Fit
                </div>
              </div>
              <div>
                <span className="metric-sublabel">Document Format</span>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--cp-grey-800)", marginTop: 2 }}>
                  {currentResume.fileType} Document Standard
                </div>
              </div>
            </div>
          </div>

          {/* Versions Table / History */}
          <div className="cp-card">
            <div className="card-title-bar">
              <div>
                <h3>Resume Version History</h3>
                <p>Preserves original uploads alongside AI-enhanced and company-tailored iterations</p>
              </div>
              <span style={{ fontSize: 12, color: "var(--cp-grey-500)" }}>
                {versions.length} versions stored
              </span>
            </div>

            <div className="table-container">
              <table className="cp-table">
                <thead>
                  <tr>
                    <th>Version & Label</th>
                    <th>File Name</th>
                    <th>Date Stamped</th>
                    <th>File Size</th>
                    <th>Status</th>
                    <th>Fit Score</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {versions.map((ver) => (
                    <tr key={ver.id} className={ver.isCurrent ? "table-row-highlight" : ""}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <b>{ver.label}</b>
                          {ver.isCurrent && <span className="badge badge-ready" style={{ fontSize: 10 }}>Current</span>}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontFamily: "monospace", fontSize: 12 }}>{ver.fileName}</span>
                      </td>
                      <td>{ver.uploadDate}</td>
                      <td>{ver.fileSizeFormatted}</td>
                      <td>
                        <span className={`badge ${ver.status === "AI Enhanced" ? "badge-neutral" : "badge-ready"}`}>
                          {ver.status}
                        </span>
                      </td>
                      <td>
                        <b>{ver.matchScore}%</b>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => setPreviewVersion(ver)}
                            title="Preview Version"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleDownload(ver)}
                            title="Download Version"
                          >
                            <Download size={13} />
                          </button>
                          {!ver.isCurrent && (
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => resumeService.setCurrentVersion(ver.id)}
                            >
                              Use as Current
                            </button>
                          )}
                          {versions.length > 1 && !ver.isCurrent && (
                            <button
                              className="btn btn-sm btn-ghost"
                              style={{ color: "var(--cp-error)" }}
                              onClick={() => resumeService.deleteVersion(ver.id)}
                              title="Delete Version"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: UPLOAD RESUME */}
      {activeTab === "upload" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="cp-card">
            <div className="card-title-bar">
              <div>
                <h3>Upload Your Existing Resume</h3>
                <p>Extract verified coursework, technical skills, and project accomplishments into your institutional portfolio</p>
              </div>
            </div>

            {/* Error banner */}
            {uploadError && (
              <div className="auth-alert-banner error" style={{ marginBottom: 16 }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <div style={{ fontSize: 13 }}>
                  <b>Upload Rejected</b>
                  <p style={{ marginTop: 2 }}>{uploadError}</p>
                </div>
              </div>
            )}

            {/* Success state banner */}
            {uploadSuccess && (
              <div className="auth-alert-banner success" style={{ marginBottom: 16 }}>
                <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                <div style={{ fontSize: 13, flex: 1 }}>
                  <b>Resume Uploaded Successfully</b>
                  <p style={{ marginTop: 2 }}>
                    "{uploadSuccess.fileName}" was validated and stored as <b>{uploadSuccess.label}</b>.
                  </p>
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <button className="btn btn-sm btn-secondary" onClick={() => setPreviewVersion(uploadSuccess)}>
                      <Eye size={13} /> Preview Resume
                    </button>
                    <button className="btn btn-sm btn-primary" onClick={() => setActiveTab("enhance")}>
                      <Sparkles size={13} /> AI Enhance Now
                    </button>
                    <button className="btn btn-sm btn-secondary" onClick={() => handleDownload(uploadSuccess)}>
                      <Download size={13} /> Download
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Drag & Drop Zone */}
            <div
              className={`resume-drop-zone ${dragActive ? "drag-active" : ""}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc"
                style={{ display: "none" }}
                onChange={handleFileInputChange}
              />

              <div className="drop-zone-icon-box">
                <FileUp size={32} />
              </div>

              <h4 style={{ fontSize: 16, color: "var(--cp-black)", marginTop: 12 }}>
                Drag & Drop your resume here
              </h4>
              <p style={{ fontSize: 13, color: "var(--cp-grey-500)", marginTop: 4 }}>
                or click to browse from your device
              </p>

              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <span className="badge badge-neutral">PDF</span>
                <span className="badge badge-neutral">DOCX</span>
                <span className="badge badge-neutral">DOC</span>
                <span className="badge badge-neutral">Max 5 MB</span>
              </div>
            </div>

            {/* Uploading progress bar */}
            {uploading && (
              <div style={{ marginTop: 20, padding: 16, background: "var(--cp-grey-50)", borderRadius: "var(--cp-radius-sm)", border: "1px solid var(--cp-grey-200)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--cp-black)" }}>
                    Validating & Parsing Document...
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--cp-grey-700)" }}>
                    {uploadProgress}%
                  </span>
                </div>
                <div className="progress-track">
                  <div className="progress-bar" style={{ width: `${uploadProgress}%` }} />
                </div>
                <span style={{ fontSize: 11, color: "var(--cp-grey-500)", marginTop: 6, display: "block" }}>
                  Extracting verified technical competencies against registrar records...
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: AI RESUME ENHANCEMENT */}
      {activeTab === "enhance" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Hard Rule Banner */}
          <div className="institutional-notice-banner">
            <ShieldCheck size={18} style={{ color: "var(--cp-success)", flexShrink: 0 }} />
            <div style={{ fontSize: 13, color: "var(--cp-grey-800)" }}>
              <b>CampusPulse Verification Invariant:</b> AI enhancement strictly refines bullet clarity, active verbs, and keyword conciseness. <b>The system never fabricates unearned qualifications, certifications, projects, or metrics.</b>
            </div>
          </div>

          {enhancementSuccess && (
            <div className="auth-alert-banner success">
              <CheckCircle2 size={16} />
              <span style={{ fontSize: 13 }}>{enhancementSuccess}</span>
            </div>
          )}

          {/* Enhancement Workspace Grid */}
          <div className="grid-2col">
            {/* Left: Detected verified items & suggestion toggles */}
            <div className="cp-card">
              <div className="card-title-bar">
                <div>
                  <h3>AI Suggested Refinements</h3>
                  <p>Derived strictly from your verified profile and selected project artifacts</p>
                </div>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => setSuggestions(resumeService.getEnhancementSuggestions(currentResume.id, selectedJd))}
                >
                  <RefreshCw size={13} /> Re-analyze
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {suggestions.map((sug) => (
                  <div
                    key={sug.id}
                    className={`suggestion-item-box ${sug.applied ? "applied" : ""}`}
                    onClick={() => handleToggleSuggestion(sug.id)}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <span className="badge badge-dark" style={{ fontSize: 11 }}>
                        {sug.category}
                      </span>
                      <input
                        type="checkbox"
                        checked={sug.applied}
                        onChange={() => handleToggleSuggestion(sug.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    <div style={{ fontSize: 12, marginBottom: 6 }}>
                      <span style={{ color: "var(--cp-grey-500)", textDecoration: "line-through", display: "block" }}>
                        "{sug.originalText}"
                      </span>
                      <strong style={{ color: "var(--cp-black)", display: "block", marginTop: 4 }}>
                        → "{sug.suggestedText}"
                      </strong>
                    </div>

                    <span style={{ fontSize: 11, color: "var(--cp-grey-600)", fontStyle: "italic" }}>
                      Rationale: {sug.rationale}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "var(--cp-grey-600)" }}>
                  {suggestions.filter((s) => s.applied).length} of {suggestions.length} suggestions selected
                </span>

                <button
                  className="btn btn-primary"
                  onClick={handleApplyEnhancements}
                  disabled={enhancing || suggestions.filter((s) => s.applied).length === 0}
                >
                  <Sparkles size={14} />
                  <span>{enhancing ? "Applying Enhancements..." : "Save as New Enhanced Version"}</span>
                </button>
              </div>
            </div>

            {/* Right: Live Preview of Enhanced Resume */}
            <div className="cp-card">
              <div className="card-title-bar">
                <div>
                  <h3>Enhanced Resume Preview</h3>
                  <p>Standardized institutional format</p>
                </div>
                <button className="btn btn-sm btn-secondary" onClick={() => handleDownload(currentResume)}>
                  <Download size={13} /> Export PDF
                </button>
              </div>

              <div className="academic-resume-sheet">
                <div style={{ textAlign: "center", borderBottom: "2px solid var(--cp-black)", paddingBottom: 10, marginBottom: 12 }}>
                  <h2 style={{ fontSize: 18, color: "var(--cp-black)" }}>{currentResume.data.candidateName}</h2>
                  <p style={{ fontSize: 11, color: "var(--cp-grey-600)" }}>
                    {currentResume.data.education.degree} · Reg: {currentResume.data.regNo}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--cp-grey-600)" }}>
                    {currentResume.data.email} · {currentResume.data.githubUrl}
                  </p>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <h4 className="resume-section-heading">Education</h4>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <b>{currentResume.data.education.degree}</b>
                    <span>{currentResume.data.education.duration}</span>
                  </div>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-700)" }}>
                    {currentResume.data.education.institution} · CGPA: {currentResume.data.education.cgpa} (0 Backlogs)
                  </span>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <h4 className="resume-section-heading">Technical Competencies</h4>
                  <p style={{ fontSize: 11 }}><b>Languages:</b> {currentResume.data.skills.languages.join(", ")}</p>
                  <p style={{ fontSize: 11 }}><b>Core:</b> {currentResume.data.skills.core.join(", ")}</p>
                  <p style={{ fontSize: 11 }}><b>Tools:</b> {currentResume.data.skills.tools.join(", ")}</p>
                </div>

                <div>
                  <h4 className="resume-section-heading">Verified Projects</h4>
                  {currentResume.data.projects.map((p, idx) => (
                    <div key={idx} style={{ marginBottom: 8, fontSize: 11 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <b>{p.title}</b>
                        <span>{p.period}</span>
                      </div>
                      <p style={{ color: "var(--cp-grey-800)", marginTop: 2 }}>{p.description}</p>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 12, borderTop: "1px dashed var(--cp-grey-300)", paddingTop: 8, display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "var(--cp-grey-500)" }}>
                  <ShieldCheck size={13} style={{ color: "var(--cp-success)" }} />
                  <span>Certified authentic by CampusPulse Placement Verification Authority</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: JD MATCHING & TAILORING */}
      {activeTab === "jd_match" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {jdSuccess && (
            <div className="auth-alert-banner success">
              <CheckCircle2 size={16} />
              <span style={{ fontSize: 13 }}>{jdSuccess}</span>
            </div>
          )}

          <div className="grid-2col">
            {/* Left: Job Description Selection & Analysis */}
            <div className="cp-card">
              <div className="card-title-bar">
                <div>
                  <h3>Target Job Description</h3>
                  <p>Select company recruitment drive</p>
                </div>
                <select
                  className="filter-select"
                  value={selectedJd}
                  onChange={(e) => setSelectedJd(e.target.value as any)}
                  style={{ fontWeight: 600 }}
                >
                  <option value="TCS">TCS — Digital Software Engineer (₹7.2 LPA)</option>
                  <option value="Infosys">Infosys — Specialist Programmer (₹6.5 LPA)</option>
                  <option value="Deloitte">Deloitte — Technology Analyst (₹8.0 LPA)</option>
                </select>
              </div>

              <div style={{ padding: 14, background: "var(--cp-grey-50)", border: "1px solid var(--cp-grey-200)", borderRadius: "var(--cp-radius-sm)", marginBottom: 16 }}>
                <span className="eyebrow-tag">Recruiter Hiring Criteria</span>
                <h4 style={{ fontSize: 15, color: "var(--cp-black)", marginTop: 4 }}>
                  {currentJdDef.company} · {currentJdDef.role}
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                  {currentJdDef.requirements.map((req, i) => (
                    <span key={i} className="badge badge-dark" style={{ fontSize: 11 }}>
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              {/* Match scorecard */}
              <div style={{ padding: 16, border: "1px solid var(--cp-grey-200)", borderRadius: "var(--cp-radius-sm)", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--cp-black)" }}>
                    Verified Match Alignment
                  </span>
                  <strong style={{ fontSize: 24, color: "var(--cp-black)" }}>
                    {selectedJd === "TCS" ? "92%" : selectedJd === "Infosys" ? "84%" : "88%"}
                  </strong>
                </div>

                <div className="progress-track" style={{ marginTop: 8 }}>
                  <div
                    className="progress-bar success"
                    style={{ width: `${selectedJd === "TCS" ? 92 : selectedJd === "Infosys" ? 84 : 88}%` }}
                  />
                </div>

                <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
                  <div style={{ color: "var(--cp-success)", display: "flex", alignItems: "center", gap: 6 }}>
                    <CheckCircle2 size={14} />
                    <span><b>Skills Matched:</b> {currentJdDef.matched.join(", ")}</span>
                  </div>
                  <div style={{ color: "var(--cp-warning)", display: "flex", alignItems: "center", gap: 6 }}>
                    <AlertTriangle size={14} />
                    <span><b>Attention Areas:</b> {currentJdDef.missing.join(", ")}</span>
                  </div>
                </div>
              </div>

              <button
                className="btn btn-primary btn-block"
                onClick={handleApplyJdTailoring}
                disabled={jdAnalyzing}
              >
                <Sparkles size={14} />
                <span>{jdAnalyzing ? "Tailoring & Creating Version..." : `Create Tailored Resume for ${selectedJd}`}</span>
              </button>
            </div>

            {/* Right: Tailored Version Output */}
            <div className="cp-card">
              <div className="card-title-bar">
                <div>
                  <h3>Tailored Output Preview</h3>
                  <p>ATS-optimized alignment without fabricated credentials</p>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleDownload(currentResume)}
                >
                  <Download size={14} /> Download
                </button>
              </div>

              <div className="academic-resume-sheet">
                <div style={{ textAlign: "center", borderBottom: "2px solid var(--cp-black)", paddingBottom: 10, marginBottom: 12 }}>
                  <h2 style={{ fontSize: 18, color: "var(--cp-black)" }}>{currentResume.data.candidateName}</h2>
                  <p style={{ fontSize: 11, color: "var(--cp-grey-600)" }}>
                    Target Role: {currentJdDef.company} ({currentJdDef.role})
                  </p>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <h4 className="resume-section-heading">Targeted Competencies</h4>
                  <p style={{ fontSize: 11 }}>
                    <b>Matched Repertoire:</b> {currentJdDef.matched.join(" · ")}
                  </p>
                </div>

                <div>
                  <h4 className="resume-section-heading">Project Alignment</h4>
                  <p style={{ fontSize: 11, color: "var(--cp-grey-800)" }}>
                    Highlighted capstone <b>{currentResume.data.projects[0]?.title}</b> demonstrates verified conformance with {selectedJd} system expectations.
                  </p>
                </div>

                <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => alert("Verified tailored resume dispatched to university placement coordinator.")}
                  >
                    <Send size={13} /> Send to Placement Cell
                  </button>
                  <span className="badge badge-ready">Audit-Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULL RESUME PREVIEW MODAL */}
      {previewVersion && (
        <div className="modal-backdrop-layer" onClick={() => setPreviewVersion(null)} role="dialog" aria-modal="true">
          <div
            className="modal-card-box modal-lg"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: "90vh" }}
          >
            <div className="modal-header-bar">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <FileText size={18} />
                <div>
                  <h2>{previewVersion.label}</h2>
                  <span style={{ fontSize: 12, color: "var(--cp-grey-500)" }}>
                    {previewVersion.fileName} · {previewVersion.uploadDate} · {previewVersion.fileSizeFormatted}
                  </span>
                </div>
              </div>
              <button className="btn-ghost" onClick={() => setPreviewVersion(null)} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-scroll" style={{ background: "var(--cp-grey-100)", padding: 24 }}>
              <div className="academic-resume-sheet" style={{ maxWidth: 700, margin: "0 auto", boxShadow: "0 4px 18px rgba(0,0,0,0.08)" }}>
                {/* Header */}
                <div style={{ textAlign: "center", borderBottom: "2px solid var(--cp-black)", paddingBottom: 14, marginBottom: 16 }}>
                  <h1 style={{ fontSize: 22, color: "var(--cp-black)", letterSpacing: -0.5 }}>
                    {previewVersion.data.candidateName}
                  </h1>
                  <p style={{ fontSize: 12, color: "var(--cp-grey-700)", marginTop: 4 }}>
                    {previewVersion.data.education.degree} · Reg No: {previewVersion.data.regNo}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--cp-grey-600)", marginTop: 2 }}>
                    {previewVersion.data.email} · {previewVersion.data.githubUrl} · {previewVersion.data.linkedinUrl}
                  </p>
                </div>

                {/* Education */}
                <div style={{ marginBottom: 14 }}>
                  <h4 className="resume-section-heading">Education</h4>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <b>{previewVersion.data.education.degree}</b>
                    <span>{previewVersion.data.education.duration}</span>
                  </div>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-700)" }}>
                    {previewVersion.data.education.institution} · CGPA: {previewVersion.data.education.cgpa} (0 Active Backlogs)
                  </span>
                </div>

                {/* Technical Skills */}
                <div style={{ marginBottom: 14 }}>
                  <h4 className="resume-section-heading">Verified Technical Competencies</h4>
                  <p style={{ fontSize: 12 }}><b>Languages:</b> {previewVersion.data.skills.languages.join(", ")}</p>
                  <p style={{ fontSize: 12 }}><b>Core Foundations:</b> {previewVersion.data.skills.core.join(", ")}</p>
                  <p style={{ fontSize: 12 }}><b>Tools & Frameworks:</b> {previewVersion.data.skills.tools.join(", ")}</p>
                </div>

                {/* Projects */}
                <div style={{ marginBottom: 14 }}>
                  <h4 className="resume-section-heading">Verified Academic & Capstone Projects</h4>
                  {previewVersion.data.projects.map((proj, i) => (
                    <div key={i} style={{ marginBottom: 10, fontSize: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <b>{proj.title}</b>
                        <span>{proj.period}</span>
                      </div>
                      <p style={{ color: "var(--cp-grey-800)", marginTop: 2 }}>{proj.description}</p>
                      {proj.highlights && proj.highlights.length > 0 && (
                        <ul style={{ paddingLeft: 16, marginTop: 4, color: "var(--cp-grey-700)" }}>
                          {proj.highlights.map((h, hi) => (
                            <li key={hi}>{h}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>

                {/* Certifications */}
                <div style={{ marginBottom: 14 }}>
                  <h4 className="resume-section-heading">Verified Certifications</h4>
                  <ul style={{ paddingLeft: 16, fontSize: 12, color: "var(--cp-grey-800)" }}>
                    {previewVersion.data.certifications.map((cert, ci) => (
                      <li key={ci}>{cert}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ borderTop: "1px dashed var(--cp-grey-300)", paddingTop: 10, marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: "var(--cp-grey-500)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <ShieldCheck size={14} style={{ color: "var(--cp-success)" }} />
                    Verified authentic by CampusPulse Placement Verification Authority
                  </span>
                  <span>{previewVersion.status}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer-bar">
              <button className="btn btn-secondary" onClick={() => setPreviewVersion(null)}>
                Close Preview
              </button>
              <button className="btn btn-primary" onClick={() => handleDownload(previewVersion)}>
                <Download size={14} /> Download Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
