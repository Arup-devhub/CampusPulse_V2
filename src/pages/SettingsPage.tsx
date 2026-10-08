import React, { useState } from "react";
import {
  User, Shield, Bell, Settings as SettingsIcon,
  LogOut, CheckCircle2, Laptop, Smartphone, Building2, Briefcase
} from "lucide-react";
import { Role } from "../types";
import { UserProfile, authService } from "../services/authService";

interface SettingsPageProps {
  role: Role;
  currentUser?: UserProfile;
  onOpenLogoutModal: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ role, currentUser, onOpenLogoutModal }) => {
  const [activeTab, setActiveTab] = useState<
    "Profile" | "Account" | "Security" | "Notifications"
  >("Profile");

  // Form states initialized from authenticated session
  const [name, setName] = useState(currentUser?.name || (role === "Student" ? "Arup Lenka" : "Placement Officer"));
  const [email, setEmail] = useState(currentUser?.email || (role === "Student" ? "arup.lenka@campus.edu" : "officer@campuspulse.edu"));
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [notifEmailDrives, setNotifEmailDrives] = useState(true);
  const [notifWorkshops, setNotifWorkshops] = useState(true);

  const isStudent = role === "Student";
  const isPlacementAdmin = role === "Placement Admin";
  const isRecruiter = role === "Recruiter";

  return (
    <div>
      <div className="page-header-block">
        <div>
          <span className="eyebrow-tag">Platform Configuration</span>
          <h1 className="page-title">Settings & Security</h1>
          <p className="page-description">
            Manage your personal profile, account credentials, notifications, and active login sessions.
          </p>
        </div>
      </div>

      <div className="grid-2col" style={{ gridTemplateColumns: "240px 1fr" }}>
        {/* Settings Navigation Tabs (§16, §22, §45, §48: Proctoring Rules completely removed) */}
        <div className="cp-card" style={{ padding: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { id: "Profile", label: "Personal Profile", icon: User },
              { id: "Account", label: "Account & Credentials", icon: SettingsIcon },
              { id: "Security", label: "Security & Sessions", icon: Shield },
              { id: "Notifications", label: "Notification Channels", icon: Bell }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  className={`nav-link-btn ${isActive ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    color: isActive ? "var(--cp-black)" : "var(--cp-grey-700)",
                    backgroundColor: isActive ? "var(--cp-grey-100)" : "transparent"
                  }}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <div style={{ margin: "14px 0 8px", borderTop: "1px solid var(--cp-grey-200)" }} />

            <button
              className="nav-link-btn"
              style={{ color: "var(--cp-error)" }}
              onClick={onOpenLogoutModal}
            >
              <LogOut size={16} />
              <span>Log Out of CampusPulse</span>
            </button>
          </div>
        </div>

        {/* Tab Content Panels */}
        <div className="cp-card">
          {activeTab === "Profile" && (
            <div>
              <div className="card-title-bar">
                <div>
                  <h3>Personal Profile Information</h3>
                  <p>Verified institutional identification records</p>
                </div>
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    {isRecruiter ? "Work Email" : "Official Email"}
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {isStudent && (
                <div className="form-row-2col">
                  <div className="form-group">
                    <label className="form-label">Registration Number</label>
                    <input type="text" className="form-input" value={currentUser?.regNo || "2101297042"} readOnly />
                    <span className="form-helper">Registration number is verified by the registrar</span>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Branch & Degree</label>
                    <input type="text" className="form-input" value={currentUser?.branch || "B.Tech Computer Science (CSE)"} readOnly />
                  </div>
                </div>
              )}

              {isPlacementAdmin && (
                <div className="form-row-2col">
                  <div className="form-group">
                    <label className="form-label">Organization / College</label>
                    <input type="text" className="form-input" value="National Institute of Technology" readOnly />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Designation</label>
                    <input type="text" className="form-input" value="Placement Officer & Director" readOnly />
                  </div>
                </div>
              )}

              {isRecruiter && (
                <div className="form-row-2col">
                  <div className="form-group">
                    <label className="form-label">Company</label>
                    <input type="text" className="form-input" value={currentUser?.companyName || "Tata Consultancy Services"} readOnly />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Designation</label>
                    <input type="text" className="form-input" value="Lead University Talent Acquisition" readOnly />
                  </div>
                </div>
              )}

              <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    authService.updateProfile({ name, email });
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 3000);
                  }}
                >
                  Save Changes
                </button>
                {saveSuccess && (
                  <span style={{ fontSize: 13, color: "var(--cp-success)", display: "flex", alignItems: "center", gap: 4 }}>
                    <CheckCircle2 size={15} /> Profile details saved successfully.
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Account & Credentials (§23, §46: Role-appropriate credentials with GitHub/LinkedIn removed for Admin/Recruiter) */}
          {activeTab === "Account" && (
            <div>
              <div className="card-title-bar">
                <div>
                  <h3>Account & Credentials</h3>
                  <p>
                    {isStudent
                      ? "OAuth developer links and university SSO bindings"
                      : isPlacementAdmin
                      ? "Institutional administration identity and directory bindings"
                      : "Corporate enterprise federation and account credentials"}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Placement Admin Credentials (§23) */}
                {isPlacementAdmin && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--cp-grey-100)" }}>
                      <div>
                        <b style={{ fontSize: 13, color: "var(--cp-black)" }}>Full Name</b>
                        <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>
                          {currentUser?.name || "Placement Director"}
                        </span>
                      </div>
                      <span className="badge badge-ready">Verified Admin ✓</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--cp-grey-100)" }}>
                      <div>
                        <b style={{ fontSize: 13, color: "var(--cp-black)" }}>Official Email</b>
                        <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>
                          {currentUser?.email || "placement.cell@nit.edu"}
                        </span>
                      </div>
                      <span className="badge badge-neutral">Institutional</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--cp-grey-100)" }}>
                      <div>
                        <b style={{ fontSize: 13, color: "var(--cp-black)" }}>Organization / College</b>
                        <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>
                          National Institute of Technology (NIT)
                        </span>
                      </div>
                      <span className="badge badge-ready">Affiliated ✓</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--cp-grey-100)" }}>
                      <div>
                        <b style={{ fontSize: 13, color: "var(--cp-black)" }}>Designation</b>
                        <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>
                          Placement Director & Campus Placement Officer
                        </span>
                      </div>
                      <span className="badge badge-neutral">Authorized Signatory</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
                      <div>
                        <b style={{ fontSize: 13, color: "var(--cp-black)" }}>Institutional Single Sign-On (SSO)</b>
                        <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>
                          Connected to University Active Directory (LDAP Gateway)
                        </span>
                      </div>
                      <span className="badge badge-ready">Connected ✓</span>
                    </div>
                  </>
                )}

                {/* Recruiter Credentials (§46) */}
                {isRecruiter && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--cp-grey-100)" }}>
                      <div>
                        <b style={{ fontSize: 13, color: "var(--cp-black)" }}>Full Name</b>
                        <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>
                          {currentUser?.name || "Corporate Talent Partner"}
                        </span>
                      </div>
                      <span className="badge badge-ready">Verified Recruiter ✓</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--cp-grey-100)" }}>
                      <div>
                        <b style={{ fontSize: 13, color: "var(--cp-black)" }}>Work Email</b>
                        <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>
                          {currentUser?.email || "talent.acquisition@company.com"}
                        </span>
                      </div>
                      <span className="badge badge-neutral">Corporate Domain</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--cp-grey-100)" }}>
                      <div>
                        <b style={{ fontSize: 13, color: "var(--cp-black)" }}>Company</b>
                        <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>
                          {currentUser?.companyName || "Tata Consultancy Services"}
                        </span>
                      </div>
                      <span className="badge badge-ready">Partner Verified ✓</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--cp-grey-100)" }}>
                      <div>
                        <b style={{ fontSize: 13, color: "var(--cp-black)" }}>Designation</b>
                        <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>
                          Lead University Talent Acquisition Partner
                        </span>
                      </div>
                      <span className="badge badge-neutral">Recruiter Access</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
                      <div>
                        <b style={{ fontSize: 13, color: "var(--cp-black)" }}>Enterprise Federation SSO</b>
                        <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>
                          Connected to Corporate Identity Provider (SAML 2.0 / Okta)
                        </span>
                      </div>
                      <span className="badge badge-ready">Connected ✓</span>
                    </div>
                  </>
                )}

                {/* Student Credentials (§23: Student retains developer profile fields) */}
                {isStudent && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--cp-grey-100)" }}>
                      <div>
                        <b style={{ fontSize: 13, color: "var(--cp-black)" }}>Single Sign-On (SSO)</b>
                        <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>
                          Connected to University LDAP Directory (NIT-BBSR)
                        </span>
                      </div>
                      <span className="badge badge-ready">Connected ✓</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--cp-grey-100)" }}>
                      <div>
                        <b style={{ fontSize: 13, color: "var(--cp-black)" }}>GitHub Account</b>
                        <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>
                          {currentUser?.githubUrl || "github.com/aruplenka"}
                        </span>
                      </div>
                      <span className="badge badge-ready">Verified ✓</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
                      <div>
                        <b style={{ fontSize: 13, color: "var(--cp-black)" }}>LinkedIn Profile</b>
                        <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>
                          {currentUser?.linkedinUrl || "linkedin.com/in/aruplenka"}
                        </span>
                      </div>
                      <span className="badge badge-ready">Verified ✓</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === "Security" && (
            <div>
              <div className="card-title-bar">
                <div>
                  <h3>Security & Active Sessions</h3>
                  <p>Manage account passwords and device logins</p>
                </div>
              </div>

              {/* Password update */}
              <div style={{ marginBottom: 28 }}>
                <span className="eyebrow-tag">Update Password</span>
                <div className="form-row-2col" style={{ marginTop: 8 }}>
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="form-input"
                      value={currentPw}
                      onChange={(e) => setCurrentPw(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Secure Password</label>
                    <input
                      type="password"
                      className="form-input"
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                      placeholder="Min 8 characters"
                    />
                  </div>
                </div>
                <button className="btn btn-secondary" onClick={() => alert("Password updated successfully.")}>
                  Update Password
                </button>
              </div>

              {/* Active sessions */}
              <div style={{ marginBottom: 24 }}>
                <span className="eyebrow-tag">Active Login Sessions</span>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: 12,
                      border: "1px solid var(--cp-grey-200)",
                      borderRadius: "var(--cp-radius-sm)"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Laptop size={18} style={{ color: "var(--cp-black)" }} />
                      <div>
                        <b style={{ fontSize: 13, color: "var(--cp-black)" }}>Chrome on Windows (Current Session)</b>
                        <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>
                          IP: 103.21.201.42 · Campus Computing Network · Active now
                        </span>
                      </div>
                    </div>
                    <span className="badge badge-ready">Active</span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: 12,
                      border: "1px solid var(--cp-grey-200)",
                      borderRadius: "var(--cp-radius-sm)"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Smartphone size={18} style={{ color: "var(--cp-grey-500)" }} />
                      <div>
                        <b style={{ fontSize: 13, color: "var(--cp-black)" }}>CampusPulse Mobile App</b>
                        <span style={{ fontSize: 11, color: "var(--cp-grey-500)", display: "block" }}>
                          Android 14 · Last active 3 hours ago
                        </span>
                      </div>
                    </div>
                    <button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => alert("Session revoked.")}>
                      Revoke
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ paddingTop: 16, borderTop: "1px solid var(--cp-grey-200)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <b style={{ fontSize: 13, color: "var(--cp-black)", display: "block" }}>Sign Out Everywhere</b>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-500)" }}>
                    Terminates all active tokens across devices and browsers
                  </span>
                </div>
                <button className="btn btn-danger" onClick={onOpenLogoutModal}>
                  Logout From All Devices
                </button>
              </div>
            </div>
          )}

          {activeTab === "Notifications" && (
            <div>
              <div className="card-title-bar">
                <div>
                  <h3>Notification Preferences</h3>
                  <p>Configure automated placement and intervention dispatches</p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={notifEmailDrives}
                    onChange={(e) => setNotifEmailDrives(e.target.checked)}
                  />
                  <div>
                    <b style={{ fontSize: 13, color: "var(--cp-black)", display: "block" }}>
                      Placement Drive Publishing Alerts
                    </b>
                    <span style={{ fontSize: 11, color: "var(--cp-grey-500)" }}>
                      Send email notification when new corporate recruitment drives match eligibility criteria.
                    </span>
                  </div>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={notifWorkshops}
                    onChange={(e) => setNotifWorkshops(e.target.checked)}
                  />
                  <div>
                    <b style={{ fontSize: 13, color: "var(--cp-black)", display: "block" }}>
                      Workshop Intervention Enrollments
                    </b>
                    <span style={{ fontSize: 11, color: "var(--cp-grey-500)" }}>
                      Notify immediately when placement officer creates a targeted cohort workshop for measured skill gaps.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
