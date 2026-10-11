import React, { useState } from "react";
import {
  Building2, Lock, Mail, User, ArrowLeft, AlertCircle,
  CheckCircle2, Phone, ShieldCheck, Eye, EyeOff
} from "lucide-react";
import { authService, PlacementAdminRegistrationData } from "../../services/authService";
import { isValidEmail, evaluatePassword } from "../../utils/validation";
import { PasswordRequirementsChecklist } from "../../components/auth/PasswordRequirementsChecklist";

interface PlacementAdminSignupPageProps {
  onSuccess: () => void;
  onNavigateLogin: () => void;
}

export const PlacementAdminSignupPage: React.FC<PlacementAdminSignupPageProps> = ({
  onSuccess,
  onNavigateLogin
}) => {
  // Required fields (all start empty)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Optional fields (all start empty)
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");

  // UI & Validation states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Lifecycle states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ name: string } | null>(null);

  const passwordEvaluation = evaluatePassword(password);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (emailError && isValidEmail(val)) {
      setEmailError(null);
    }
  };

  const handleEmailBlur = () => {
    if (email.trim() && !isValidEmail(email)) {
      setEmailError("Please enter a valid email.");
    } else {
      setEmailError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      setEmailError("Please enter a valid email.");
      setErrorMessage("Please enter a valid email.");
      return;
    }
    setEmailError(null);

    if (!college.trim()) {
      setErrorMessage("Please specify your College or Institution organization name.");
      return;
    }
    if (!passwordEvaluation.isValid) {
      setErrorMessage("Please ensure your password meets all security requirements.");
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
        email: trimmedEmail,
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
              <label className="form-label" htmlFor="admin-name">Full Name *</label>
              <div className="input-with-icon">
                <User size={15} className="input-prefix-icon" aria-hidden="true" />
                <input
                  id="admin-name"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: 34 }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Arup Lenka"
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label" htmlFor="admin-email">Official / Institutional Email *</label>
              <div className="input-with-icon">
                <Mail size={15} className="input-prefix-icon" aria-hidden="true" />
                <input
                  id="admin-email"
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: 34 }}
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  placeholder="name@example.com"
                  required
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "admin-email-error" : undefined}
                />
              </div>
              {emailError && (
                <span
                  id="admin-email-error"
                  role="alert"
                  style={{ color: "var(--cp-danger, #ef4444)", fontSize: 12, marginTop: 4, display: "block" }}
                >
                  {emailError}
                </span>
              )}
              <span className="form-helper">Use university official email for administrator verification</span>
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label" htmlFor="admin-college">College / Organization *</label>
              <div className="input-with-icon">
                <Building2 size={15} className="input-prefix-icon" aria-hidden="true" />
                <input
                  id="admin-college"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: 34 }}
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g., National Institute of Technology"
                  required
                />
              </div>
            </div>

            {/* Passwords */}
            <div className="form-row-2col">
              <div className="form-group">
                <label className="form-label" htmlFor="admin-password">Password *</label>
                <div className="input-with-icon">
                  <Lock size={15} className="input-prefix-icon" aria-hidden="true" />
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    style={{ paddingLeft: 34, paddingRight: 36 }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
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

              <div className="form-group">
                <label className="form-label" htmlFor="admin-confirm-password">Confirm Password *</label>
                <div className="input-with-icon">
                  <Lock size={15} className="input-prefix-icon" aria-hidden="true" />
                  <input
                    id="admin-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-input"
                    style={{ paddingLeft: 34, paddingRight: 36 }}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required
                  />
                  <button
                    type="button"
                    className="input-suffix-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password security checklist */}
            <div style={{ marginBottom: 14 }}>
              <PasswordRequirementsChecklist rules={passwordEvaluation.rules} />
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
                    placeholder="e.g., Training & Placement Officer"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    className="form-input"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g., Placement & Training Directorate"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Official Phone Number (Optional)</label>
                <div className="input-with-icon">
                  <Phone size={15} className="input-prefix-icon" aria-hidden="true" />
                  <input
                    type="tel"
                    className="form-input"
                    style={{ paddingLeft: 34 }}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g., +91 (0674) 230-1000"
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
