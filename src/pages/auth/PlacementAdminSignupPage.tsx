import React, { useState } from "react";
import {
  Building2, Lock, Mail, User, ArrowLeft, AlertCircle,
  CheckCircle2, Phone, ShieldCheck
} from "lucide-react";
import { authService, PlacementAdminRegistrationData } from "../../services/authService";

interface PlacementAdminSignupPageProps {
  onSuccess: () => void;
  onNavigateLogin: () => void;
}

export const PlacementAdminSignupPage: React.FC<PlacementAdminSignupPageProps> = ({
  onSuccess,
  onNavigateLogin
}) => {
  // Required fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Optional fields
  const [designation, setDesignation] = useState("Training & Placement Officer");
  const [department, setDepartment] = useState("Placement & Training Directorate");
  const [phone, setPhone] = useState("");

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
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid official institutional email address.");
      return;
    }
    if (!college.trim()) {
      setErrorMessage("Please specify your College or Institution organization name.");
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

    setLoading(true);

    try {
      const data: PlacementAdminRegistrationData = {
        name: name.trim(),
        email: email.trim(),
        college: college.trim(),
        password,
        confirmPassword,
        designation: designation.trim() || undefined,
        department: department.trim() || undefined,
        phone: phone.trim() || undefined
      };

      const res = await authService.registerPlacementAdmin(data);

      if (res.success && res.session) {
        setSuccessInfo({ name: res.session.user.name });
        setTimeout(() => {
          onSuccess();
        }, 1200);
      } else {
        setErrorMessage(res.error || "Unable to create your placement admin account. This official email may already be registered.");
      }
    } catch (err) {
      setErrorMessage("Network error occurred during administrator account creation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-panel" style={{ width: "min(580px, 100%)" }}>
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
              Placement Admin Registration
            </span>
          </div>
        </div>

        {/* Title and Supporting Text */}
        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <h2 style={{ fontSize: 19, fontWeight: 700, color: "var(--cp-black)" }}>
            Create Placement Admin Account
          </h2>
          <p style={{ fontSize: 13, color: "var(--cp-grey-600)", marginTop: 4, lineHeight: 1.5 }}>
            Create your placement administration account to manage students, drives, assessments and placement operations.
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
                You are signed in as: <b>Placement Admin</b>. Redirecting to Placement Command Center...
              </span>
            </div>
          </div>
        )}

        {/* Error notification banner */}
        {errorMessage && (
          <div className="auth-alert-banner error" role="alert">
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <div style={{ fontSize: 13 }}>
              <b>Unable to create your placement admin account</b>
              <p style={{ marginTop: 2 }}>{errorMessage}</p>
            </div>
          </div>
        )}

        {!successInfo && (
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Full Name *</label>
              <div className="input-with-icon">
                <User size={15} className="input-prefix-icon" />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: 34 }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Prof. Arup Lenka"
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Official / Institutional Email *</label>
              <div className="input-with-icon">
                <Mail size={15} className="input-prefix-icon" />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: 34 }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="placement.officer@university.edu"
                  required
                />
              </div>
              <span className="form-helper">Use university official email for administrator verification</span>
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">College / Organization *</label>
              <div className="input-with-icon">
                <Building2 size={15} className="input-prefix-icon" />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: 34 }}
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. National Institute of Technology, Bhubaneswar"
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

            {/* Optional Institutional Details */}
            <div style={{ margin: "16px 0 10px", padding: "12px", background: "var(--cp-grey-50)", borderRadius: "var(--cp-radius-sm)", border: "1px solid var(--cp-grey-200)" }}>
              <span className="eyebrow-tag" style={{ color: "var(--cp-grey-700)" }}>
                Administrative Details (Optional)
              </span>

              <div className="form-row-2col" style={{ marginTop: 10 }}>
                <div className="form-group">
                  <label className="form-label">Designation / Role Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Head of Corporate Relations / TPO"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    className="form-input"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Placement Cell"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Official Phone Number (Optional)</label>
                <div className="input-with-icon">
                  <Phone size={15} className="input-prefix-icon" />
                  <input
                    type="tel"
                    className="form-input"
                    style={{ paddingLeft: 34 }}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 (0674) 230-1000"
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
              {loading ? "Creating Placement Admin Account..." : "Create Placement Admin Account"}
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
