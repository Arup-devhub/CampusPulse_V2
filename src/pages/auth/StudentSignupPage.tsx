import React, { useState } from "react";
import {
  Lock, Mail, User, Github, Linkedin, ArrowLeft,
  AlertCircle, CheckCircle2, Phone, Building, BookOpen, Sparkles
} from "lucide-react";
import { authService, StudentRegistrationData } from "../../services/authService";

interface StudentSignupPageProps {
  onSuccess: () => void;
  onNavigateLogin: () => void;
}

export const StudentSignupPage: React.FC<StudentSignupPageProps> = ({
  onSuccess,
  onNavigateLogin
}) => {
  // Required fields
  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  // Optional fields
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("National Institute of Technology");
  const [degree, setDegree] = useState("B.Tech");
  const [branch, setBranch] = useState("Computer Science & Engineering");
  const [semester, setSemester] = useState("7");
  const [cgpa, setCgpa] = useState("8.42");

  // Lifecycle states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ name: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!regNo.trim()) {
      setErrorMessage("Please enter your institutional registration number.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid college/university email address.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must contain at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Password confirmation does not match the password.");
      return;
    }
    if (!githubUrl.trim() || !githubUrl.includes("github.com")) {
      setErrorMessage("Please provide a valid GitHub profile URL (e.g. https://github.com/your-username).");
      return;
    }
    if (!linkedinUrl.trim() || !linkedinUrl.includes("linkedin.com")) {
      setErrorMessage("Please provide a valid LinkedIn profile URL (e.g. https://linkedin.com/in/your-username).");
      return;
    }
    if (cgpa && (isNaN(Number(cgpa)) || Number(cgpa) < 0 || Number(cgpa) > 10)) {
      setErrorMessage("CGPA must be a decimal value between 0.00 and 10.00.");
      return;
    }

    setLoading(true);

    try {
      const data: StudentRegistrationData = {
        name: name.trim(),
        regNo: regNo.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        githubUrl: githubUrl.trim(),
        linkedinUrl: linkedinUrl.trim(),
        college: college.trim(),
        degree,
        branch,
        semester: parseInt(semester, 10) || 7,
        cgpa: parseFloat(cgpa) || 8.0,
        phone: phone.trim() || undefined
      };

      const res = await authService.registerStudent(data);

      if (res.success && res.session) {
        setSuccessInfo({ name: res.session.user.name });
        setTimeout(() => {
          onSuccess();
        }, 1200);
      } else {
        setErrorMessage(res.error || "Unable to create your student account. This email or registration number may already be registered.");
      }
    } catch (err) {
      setErrorMessage("Network error occurred during account creation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-panel" style={{ width: "min(640px, 100%)" }}>
        {/* Navigation header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <button
            type="button"
            className="btn-ghost"
            style={{ display: "flex", alignItems: "center", gap: 6, padding: 0, fontSize: 13, color: "var(--cp-grey-700)" }}
            onClick={onNavigateLogin}
          >
            <ArrowLeft size={15} />
            <span>Back to Sign In</span>
          </button>

          <button
            type="button"
            className="btn-ghost"
            style={{ fontSize: 12, color: "var(--cp-grey-600)", padding: 0 }}
            onClick={onNavigateLogin}
          >
            Change account type
          </button>
        </div>

        {/* Brand Header with Official CampusPulse Logo */}
        <div className="auth-brand-header">
          <a href="/login" className="auth-logo-badge" aria-label="CampusPulse home" onClick={(e) => { e.preventDefault(); onNavigateLogin(); }}>
            <img
              src="/campuspulse-logo.png"
              alt="CampusPulse"
              className="auth-official-logo"
            />
          </a>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--cp-black)", letterSpacing: -0.5, margin: 0 }}>
              CampusPulse
            </h1>
            <span style={{ fontSize: 13, color: "var(--cp-grey-600)", fontWeight: 500, display: "block", marginTop: 2 }}>
              Student Registration
            </span>
          </div>
        </div>

        {/* Title and Supporting Text */}
        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <h2 style={{ fontSize: 19, fontWeight: 700, color: "var(--cp-black)" }}>
            Create Student Account
          </h2>
          <p style={{ fontSize: 13, color: "var(--cp-grey-600)", marginTop: 4, lineHeight: 1.5 }}>
            Create your CampusPulse student account and start tracking your placement readiness.
          </p>
        </div>

        {/* Success Modal / Banner */}
        {successInfo && (
          <div className="auth-alert-banner success" role="status" style={{ marginBottom: 24, padding: 16 }}>
            <CheckCircle2 size={22} style={{ flexShrink: 0 }} />
            <div>
              <b style={{ fontSize: 14 }}>Account created successfully.</b>
              <p style={{ fontSize: 13, marginTop: 3 }}>
                Welcome to CampusPulse, <b>{successInfo.name}</b>.
              </p>
              <span style={{ fontSize: 12, color: "var(--cp-grey-700)", display: "block", marginTop: 4 }}>
                You are signed in as: <b>Student</b>. Redirecting to your Placement Dashboard...
              </span>
            </div>
          </div>
        )}

        {/* Error notification banner */}
        {errorMessage && (
          <div className="auth-alert-banner error" role="alert">
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <div style={{ fontSize: 13 }}>
              <b>Unable to create your student account</b>
              <p style={{ marginTop: 2 }}>{errorMessage}</p>
            </div>
          </div>
        )}

        {!successInfo && (
          <form onSubmit={handleSubmit}>
            {/* Required Identification */}
            <div className="form-row-2col">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Arup Lenka"
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
                  placeholder="e.g. 2101297042"
                  required
                />
                <span className="form-helper">Official student university enrollment ID</span>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Institutional / College Email *</label>
              <div className="input-with-icon">
                <Mail size={15} className="input-prefix-icon" />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: 34 }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="arup.lenka@campus.edu"
                  required
                />
              </div>
            </div>

            {/* Passwords */}
            <div className="form-row-2col">
              <div className="form-group">
                <label className="form-label">Password *</label>
                <div className="input-with-icon">
                  <Lock size={15} className="input-prefix-icon" />
                  <input
                    type="password"
                    className="form-input"
                    style={{ paddingLeft: 34 }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <div className="input-with-icon">
                  <Lock size={15} className="input-prefix-icon" />
                  <input
                    type="password"
                    className="form-input"
                    style={{ paddingLeft: 34 }}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Verified Portfolio Links */}
            <div className="form-row-2col">
              <div className="form-group">
                <label className="form-label">GitHub Profile URL *</label>
                <div className="input-with-icon">
                  <Github size={15} className="input-prefix-icon" />
                  <input
                    type="url"
                    className="form-input"
                    style={{ paddingLeft: 34 }}
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/your-username"
                    required
                  />
                </div>
                <span className="form-helper">Required for codebase analysis</span>
              </div>

              <div className="form-group">
                <label className="form-label">LinkedIn Profile URL *</label>
                <div className="input-with-icon">
                  <Linkedin size={15} className="input-prefix-icon" />
                  <input
                    type="url"
                    className="form-input"
                    style={{ paddingLeft: 34 }}
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/your-username"
                    required
                  />
                </div>
                <span className="form-helper">Verified credential cross-matching</span>
              </div>
            </div>

            {/* Optional Academic Profile */}
            <div style={{ margin: "16px 0 10px", padding: "12px", background: "var(--cp-grey-50)", borderRadius: "var(--cp-radius-sm)", border: "1px solid var(--cp-grey-200)" }}>
              <span className="eyebrow-tag" style={{ color: "var(--cp-grey-700)" }}>
                Academic Context (Optional)
              </span>

              <div className="form-row-2col" style={{ marginTop: 10 }}>
                <div className="form-group">
                  <label className="form-label">College / University</label>
                  <input
                    type="text"
                    className="form-input"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="National Institute of Technology"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Degree & Branch</label>
                  <input
                    type="text"
                    className="form-input"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="Computer Science & Engineering"
                  />
                </div>
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Semester</label>
                  <select
                    className="form-select"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                  >
                    {[5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Current CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    className="form-input"
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    placeholder="8.42"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number (Optional)</label>
                <div className="input-with-icon">
                  <Phone size={15} className="input-prefix-icon" />
                  <input
                    type="tel"
                    className="form-input"
                    style={{ paddingLeft: 34 }}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              style={{ height: 44, fontSize: 14, fontWeight: 600, marginTop: 18 }}
              disabled={loading}
            >
              {loading ? "Creating Student Account..." : "Create Student Account"}
            </button>

            <div style={{ marginTop: 20, textAlign: "center", borderTop: "1px solid var(--cp-grey-200)", paddingTop: 14 }}>
              <span style={{ fontSize: 13, color: "var(--cp-grey-600)" }}>
                Already have an account?{" "}
              </span>
              <button
                type="button"
                className="btn-ghost"
                style={{ fontSize: 13, fontWeight: 600, color: "var(--cp-black)", padding: 0 }}
                onClick={onNavigateLogin}
              >
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
