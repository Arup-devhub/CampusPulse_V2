import React from "react";
import {
  LayoutDashboard, Users, Building2, Briefcase, ClipboardCheck,
  Video, Sparkles, Target, AlertTriangle, Lightbulb, FileText,
  BarChart3, BookOpen, Settings, ChevronRight, LogOut
} from "lucide-react";
import { Page, Role } from "../../types";
import { UserProfile } from "../../services/authService";

interface SidebarProps {
  currentPage: Page;
  onSelectPage: (page: Page) => void;
  collapsed: boolean;
  mobileOpen: boolean;
  currentUser: UserProfile;
  onOpenSettings: () => void;
  onOpenLogoutModal: () => void;
}

interface NavItemDef {
  label: Page;
  displayLabel?: string;
  icon: any;
  badge?: string;
  roles: Role[];
}

const navItems: NavItemDef[] = [
  { label: "Dashboard", displayLabel: "Dashboard", icon: LayoutDashboard, roles: ["Student", "Placement Admin", "Recruiter"] },
  { label: "Readiness", displayLabel: "Readiness Hub", icon: Target, badge: "Core", roles: ["Student", "Placement Admin"] },
  { label: "Skill Gaps", displayLabel: "Skill Gaps", icon: AlertTriangle, roles: ["Student", "Placement Admin"] },
  { label: "Recommendations", displayLabel: "Action Plan", icon: Lightbulb, roles: ["Student", "Placement Admin"] },
  { label: "AI Interviews", displayLabel: "AI Interviews", icon: Video, badge: "AI", roles: ["Student", "Placement Admin", "Recruiter"] },
  { label: "Assessments", displayLabel: "Assessments", icon: ClipboardCheck, roles: ["Student", "Placement Admin", "Recruiter"] },
  { label: "Workshops", displayLabel: "Workshops & Interventions", icon: BookOpen, badge: "Intervention", roles: ["Student", "Placement Admin"] },
  { label: "Placement Drives", displayLabel: "Placement Drives", icon: Briefcase, roles: ["Student", "Placement Admin", "Recruiter"] },
  { label: "AI Matching", displayLabel: "AI Matching", icon: Sparkles, roles: ["Placement Admin", "Recruiter"] },
  { label: "Students", displayLabel: "Candidates & Students", icon: Users, roles: ["Placement Admin", "Recruiter"] },
  { label: "Recruiters", displayLabel: "Corporate Partners", icon: Building2, roles: ["Placement Admin"] },
  { label: "Resumes", displayLabel: "My Resumes", icon: FileText, roles: ["Student", "Placement Admin"] },
  { label: "Reports", displayLabel: "Analytics & Reports", icon: BarChart3, roles: ["Placement Admin", "Recruiter"] },
  { label: "Settings", displayLabel: "Settings & Security", icon: Settings, roles: ["Student", "Placement Admin", "Recruiter"] }
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  collapsed,
  mobileOpen,
  currentUser,
  onOpenSettings,
  onOpenLogoutModal
}) => {
  const filteredNav = navItems.filter((item) => item.roles.includes(currentUser.role));

  return (
    <aside
      className={`sidebar ${collapsed ? "closed" : ""} ${mobileOpen ? "mobile-open" : ""}`}
      aria-label="Main Application Navigation"
    >
      <div className="sidebar-header">
        <button
          type="button"
          className={`sidebar-brand-link ${collapsed ? "collapsed" : "expanded"}`}
          onClick={() => onSelectPage("Dashboard")}
          aria-label="CampusPulse Dashboard"
        >
          {collapsed ? (
            <img
              src="/campuspulse-mark-transparent.png"
              alt="CampusPulse"
              className="sidebar-brand-mark"
            />
          ) : (
            <img
              src="/campuspulse-logo-transparent.png"
              alt="CampusPulse"
              className="sidebar-brand-full-logo"
            />
          )}
        </button>
      </div>

      {!collapsed && (
        <div className="role-badge-pill">
          <div>
            <span className="role-indicator-dot" />
            <span>{currentUser.role}</span>
          </div>
          {currentUser.companyName && (
            <span style={{ fontSize: 11, color: "var(--cp-grey-400)" }}>
              {currentUser.companyName.split(" ")[0]}
            </span>
          )}
        </div>
      )}

      <nav className="sidebar-nav">
        {filteredNav.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.label;

          return (
            <button
              key={item.label}
              className={`nav-link-btn ${isActive ? "active" : ""}`}
              onClick={() => onSelectPage(item.label)}
              title={collapsed ? item.displayLabel || item.label : undefined}
            >
              <Icon size={18} />
              {!collapsed && <span>{item.displayLabel || item.label}</span>}
              {!collapsed && item.badge && (
                <span className="nav-badge-pill">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-cell">
          <div className="user-avatar">
            {currentUser.avatarInitials}
          </div>
          {!collapsed && (
            <div className="user-details">
              <b>{currentUser.name}</b>
              <span>
                {currentUser.role === "Student"
                  ? currentUser.branch?.split(" ")[0] || "Student"
                  : currentUser.role === "Recruiter"
                  ? currentUser.companyName || "Recruiter"
                  : "Placement Admin"}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
