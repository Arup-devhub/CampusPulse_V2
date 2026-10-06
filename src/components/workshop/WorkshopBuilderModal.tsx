import React, { useState, useEffect } from "react";
import { BookOpen, Users, Calendar, ArrowRight, X, Sparkles, CheckCircle2 } from "lucide-react";
import { WorkshopCohort } from "../../types";

interface WorkshopBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkshopCreated: (newWorkshop: WorkshopCohort) => void;
}

export const WorkshopBuilderModal: React.FC<WorkshopBuilderModalProps> = ({
  isOpen,
  onClose,
  onWorkshopCreated
}) => {
  const [title, setTitle] = useState("DSA & Dynamic Programming Placement Bootcamp");
  const [targetSkill, setTargetSkill] = useState("Data Structures & Algorithms");
  const [linkedDrive, setLinkedDrive] = useState("TCS — Software Engineer");
  const [instructor, setInstructor] = useState("Prof. S. Tripathy (Lead Trainer)");
  const [date, setDate] = useState("2026-10-18");
  const [time, setTime] = useState("10:00 AM");
  const [duration, setDuration] = useState("2 hours");
  const [mode, setMode] = useState<"Classroom" | "Online" | "Hybrid">("Classroom");
  const [venue, setVenue] = useState("Computing Lab 3");
  const [capacity, setCapacity] = useState(50);

  // Live targeting criteria
  const [maxScoreThreshold, setMaxScoreThreshold] = useState(65);
  const [selectedBranch, setSelectedBranch] = useState("All Technical (CSE, IT, ECE)");
  const [preAssessmentRequired, setPreAssessmentRequired] = useState(true);
  const [postAssessmentRequired, setPostAssessmentRequired] = useState(true);

  // Live calculated cohort size
  const cohortSize = Math.min(capacity, Math.round(maxScoreThreshold * 0.77));

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newWs: WorkshopCohort = {
      id: `ws-${Date.now()}`,
      title,
      targetSkill,
      studentsAffected: cohortSize,
      avgScoreBefore: 54,
      requiredScore: 75,
      priority: "Critical",
      linkedDrive,
      deliveryMode: mode,
      instructor,
      date,
      time,
      duration,
      venue,
      capacity,
      registeredCount: Math.min(capacity, Math.round(cohortSize * 0.9)),
      attendedCount: 0,
      status: "Registration Open",
      userRegistered: true
    };
    onWorkshopCreated(newWs);
    onClose();
  };

  return (
    <div className="modal-backdrop-layer" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card-box modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-bar">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--cp-radius-sm)",
                backgroundColor: "var(--cp-black)",
                color: "var(--cp-white)",
                display: "grid",
                placeItems: "center"
              }}
            >
              <BookOpen size={16} />
            </div>
            <div>
              <h2>Create Placement Workshop Intervention</h2>
              <span style={{ fontSize: 12, color: "var(--cp-grey-500)" }}>
                Form targeted intervention cohorts directly from measured skill gaps
              </span>
            </div>
          </div>
          <button className="btn-ghost" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body-scroll">
            <div className="form-group">
              <label className="form-label">Workshop Title *</label>
              <input
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-row-2col">
              <div className="form-group">
                <label className="form-label">Target Skill / Gap *</label>
                <select
                  className="form-select"
                  value={targetSkill}
                  onChange={(e) => setTargetSkill(e.target.value)}
                >
                  <option value="Data Structures & Algorithms">Data Structures & Algorithms (DSA)</option>
                  <option value="C++ OOP & Memory">C++ Object-Oriented Programming</option>
                  <option value="SQL & Relational Databases">SQL & Database Schemas</option>
                  <option value="Technical Communication">Technical Articulation & Defense</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Linked Placement Drive</label>
                <select
                  className="form-select"
                  value={linkedDrive}
                  onChange={(e) => setLinkedDrive(e.target.value)}
                >
                  <option value="TCS — Software Engineer">TCS — Software Engineer (18 Oct)</option>
                  <option value="Infosys — Systems Engineer">Infosys — Systems Engineer (24 Oct)</option>
                  <option value="Deloitte — Technology Analyst">Deloitte — Technology Analyst (02 Nov)</option>
                  <option value="Accenture — ASE">Accenture — ASE (10 Nov)</option>
                </select>
              </div>
            </div>

            <div className="form-row-2col">
              <div className="form-group">
                <label className="form-label">Instructor / Trainer</label>
                <input
                  type="text"
                  className="form-input"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Mode & Venue</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <select
                    className="form-select"
                    value={mode}
                    onChange={(e) => setMode(e.target.value as any)}
                  >
                    <option value="Classroom">Classroom</option>
                    <option value="Online">Online</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                  <input
                    type="text"
                    className="form-input"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="Venue / Link"
                  />
                </div>
              </div>
            </div>

            <div className="form-row-2col">
              <div className="form-group">
                <label className="form-label">Date & Time</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <input
                    type="date"
                    className="form-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-input"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Cohort Capacity</label>
                <input
                  type="number"
                  className="form-input"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  min={5}
                  max={200}
                />
              </div>
            </div>

            {/* Targeting Rules Section */}
            <div
              style={{
                marginTop: 10,
                padding: "16px",
                background: "var(--cp-grey-50)",
                border: "1px solid var(--cp-grey-200)",
                borderRadius: "var(--cp-radius-md)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span className="eyebrow-tag" style={{ margin: 0 }}>Targeting Criteria & Eligibility Filter</span>
                <span className="badge badge-neutral">Auto-Cohort Matching</span>
              </div>

              <div className="form-row-2col">
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Target Students with Skill Score Below</label>
                  <input
                    type="number"
                    className="form-input"
                    value={maxScoreThreshold}
                    onChange={(e) => setMaxScoreThreshold(Number(e.target.value))}
                    min={30}
                    max={95}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Eligible Branch Filter</label>
                  <select
                    className="form-select"
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                  >
                    <option value="All Technical (CSE, IT, ECE)">All Technical (CSE, IT, ECE)</option>
                    <option value="CSE Only">Computer Science (CSE) Only</option>
                    <option value="IT Only">Information Technology (IT) Only</option>
                    <option value="All College Branches">All Registered Branches</option>
                  </select>
                </div>
              </div>

              {/* Live cohort preview */}
              <div
                style={{
                  marginTop: 14,
                  padding: "12px 16px",
                  background: "var(--cp-white)",
                  border: "1px solid var(--cp-grey-200)",
                  borderRadius: "var(--cp-radius-sm)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <b style={{ fontSize: 13, color: "var(--cp-black)" }}>
                    Estimated Eligible Cohort: {cohortSize} Students
                  </b>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>
                    Meets filter: Score &lt; {maxScoreThreshold}% in {targetSkill} · Planned Capacity: {capacity}
                  </span>
                </div>

                <div style={{ display: "flex" }}>
                  {["AR", "PK", "SD", "SM", "+46"].map((initials, i) => (
                    <div
                      key={i}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: "var(--cp-grey-100)",
                        border: "2px solid var(--cp-white)",
                        color: "var(--cp-black)",
                        display: "grid",
                        placeItems: "center",
                        fontSize: 9,
                        fontWeight: 700,
                        marginLeft: i === 0 ? 0 : -6
                      }}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer-bar">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <span>Publish Workshop & Notify Cohort</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
