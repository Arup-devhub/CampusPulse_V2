import React, { useState, useEffect } from "react";
import { Lock, Mail, User, Github, Linkedin, X, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { Role } from "../../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userRole: Role, userName: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [tab, setTab] = useState<"signin" | "onboarding">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>("Student");

  // Onboarding fields (all start empty)
  const [studentName, setStudentName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [branch, setBranch] = useState("");
  const [cgpa, setCgpa] = useState("");

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
    onLoginSuccess(selectedRole, studentName || "Student User");
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
                display: "grid",
                placeItems: "center",
                padding: 2
              }}
            >
              <img
                src="/campuspulse-mark-transparent.png"
                alt="CampusPulse"
                style={{ width: 24, height: 24, objectFit: "contain" }}
              />
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
                    placeholder="name@example.com"
                    required
                  />
                  <span className="form-helper">Use your institutional or registered credentials</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-with-icon">
                    <Lock size={15} className="input-prefix-icon" aria-hidden="true" />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-input"
                      style={{ paddingLeft: 34, paddingRight: 36 }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      className="input-suffix-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
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
                      placeholder="e.g., Arup Lenka"
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
                      placeholder="e.g., 2101297042"
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
                    placeholder="name@example.com"
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
                      placeholder="https://github.com/your-username"
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
                      placeholder="https://linkedin.com/in/your-username"
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
                      placeholder="e.g., Computer Science & Engineering"
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
                      placeholder="e.g., 8.42"
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
