import React, { useState, useEffect } from "react";
import { GraduationCap, Lock, Mail, User, Github, Linkedin, X, CheckCircle2 } from "lucide-react";
import { Role } from "../../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userRole: Role, userName: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [tab, setTab] = useState<"signin" | "onboarding">("signin");
  const [email, setEmail] = useState("priyanshu.d@campus.edu");
  const [password, setPassword] = useState("••••••••");
  const [selectedRole, setSelectedRole] = useState<Role>("Student");

  // Onboarding fields
  const [studentName, setStudentName] = useState("Priyanshu Dash");
  const [regNo, setRegNo] = useState("2101297042");
  const [githubUrl, setGithubUrl] = useState("https://github.com/priyanshu-dash");
  const [linkedinUrl, setLinkedinUrl] = useState("https://linkedin.com/in/priyanshu-dash");
  const [branch, setBranch] = useState("Computer Science & Engineering");
  const [cgpa, setCgpa] = useState("8.42");

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
    onLoginSuccess(selectedRole, studentName || "Priyanshu Dash");
    onClose();
  };

  return (
    <div className="modal-backdrop-layer" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card-box"
        style={{ width: "min(520px, 94vw)" }}
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
              <GraduationCap size={16} />
            </div>
            <div>
              <h2>{tab === "signin" ? "Student / Admin Sign In" : "Student Onboarding"}</h2>
              <span style={{ fontSize: 12, color: "var(--cp-grey-500)" }}>
                {tab === "signin" ? "CampusPulse Placement Intelligence" : "Complete your verified profile"}
              </span>
            </div>
          </div>
          <button className="btn-ghost" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body-scroll">
            {tab === "signin" ? (
              <>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as Role)}
                  >
                    <option value="Student">Student</option>
                    <option value="Placement Admin">Placement Officer / Admin</option>
                    <option value="Recruiter">Corporate Recruiter</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Email / Username</label>
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <span className="form-helper">Use your institutional or registered credentials</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                  <button
                    type="button"
                    className="btn-ghost"
                    style={{ fontSize: 12, padding: 0 }}
                    onClick={() => alert("Password reset link will be sent to your verified college email address.")}
                  >
                    Forgot Password?
                  </button>
                  <button
                    type="button"
                    className="btn-ghost"
                    style={{ fontSize: 12, padding: 0, fontWeight: 600, color: "var(--cp-black)" }}
                    onClick={() => setTab("onboarding")}
                  >
                    New student? Onboard here
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="form-row-2col">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Registration Number *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={regNo}
                      onChange={(e) => setRegNo(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">College Email *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-row-2col">
                  <div className="form-group">
                    <label className="form-label">GitHub Profile URL *</label>
                    <input
                      type="url"
                      className="form-input"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">LinkedIn Profile URL *</label>
                    <input
                      type="url"
                      className="form-input"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-row-2col">
                  <div className="form-group">
                    <label className="form-label">Branch</label>
                    <input
                      type="text"
                      className="form-input"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Current CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ marginTop: 8 }}>
                  <button
                    type="button"
                    className="btn-ghost"
                    style={{ fontSize: 12, padding: 0 }}
                    onClick={() => setTab("signin")}
                  >
                    Already have an account? Sign In
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="modal-footer-bar">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {tab === "signin" ? "Sign In" : "Complete Profile & Enter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
