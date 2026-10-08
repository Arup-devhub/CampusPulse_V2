import React from "react";
import {
  LayoutDashboard, Users, Building2, Briefcase, ClipboardCheck,
  Video, Sparkles, Target, AlertTriangle, Lightbulb, FileText,
  BarChart3, BookOpen, Settings, UserCheck
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
  displayLabel: string;
  icon: any;
  badge?: string;
}

// Student exact navigation order (§4)
const STUDENT_NAV: NavItemDef[] = [
  { label: "Dashboard", displayLabel: "Dashboard", icon: LayoutDashboard },
  { label: "Readiness", displayLabel: "Readiness Hub", icon: Target, badge: "Core" },
  { label: "Skill Gaps", displayLabel: "Skill Gap", icon: AlertTriangle },
  { label: "Recommendations", displayLabel: "Action Plan", icon: Lightbulb },
  { label: "Placement Drives", displayLabel: "Placement Drives", icon: Briefcase },
  { label: "Resumes", displayLabel: "My Resume", icon: FileText },
  { label: "Workshops", displayLabel: "Workshop & Interventions", icon: BookOpen, badge: "Intervention" },
  { label: "Assessments", displayLabel: "Assessment", icon: ClipboardCheck },
  { label: "AI Interviews", displayLabel: "AI Interview", icon: Video, badge: "Mock" },
  { label: "Learning Agent", displayLabel: "Learning Agent", icon: Sparkles, badge: "AI" },
  { label: "Settings", displayLabel: "Settings & Security", icon: Settings }
];

// Placement Admin exact navigation order (§18)
const PLACEMENT_ADMIN_NAV: NavItemDef[] = [
  { label: "Dashboard", displayLabel: "Dashboard", icon: LayoutDashboard },
  { label: "Skill Gaps", displayLabel: "Skill Gap", icon: AlertTriangle },
  { label: "Workshops", displayLabel: "Workshop & Intervention", icon: BookOpen, badge: "Intervention" },
  { label: "Placement Drives", displayLabel: "Placement Drives", icon: Briefcase },
  { label: "AI Matching", displayLabel: "AI Matching", icon: Sparkles },
  { label: "Students", displayLabel: "Candidates & Students", icon: Users },
  { label: "Recruiters", displayLabel: "Corporate Partners", icon: Building2 },
  { label: "Resumes", displayLabel: "Student Resumes", icon: FileText },
  { label: "Reports", displayLabel: "Analytics & Reports", icon: BarChart3 },
  { label: "Attendance", displayLabel: "Student Attendance", icon: UserCheck, badge: "Eligibility" },
  { label: "Settings", displayLabel: "Settings & Security", icon: Settings }
];

// Recruiter exact navigation order (§40)
const RECRUITER_NAV: NavItemDef[] = [
  { label: "Dashboard", displayLabel: "Dashboard", icon: LayoutDashboard },
  { label: "AI Matching", displayLabel: "AI Matching", icon: Sparkles },
  { label: "Students", displayLabel: "Candidates & Students", icon: Users },
  { label: "Reports", displayLabel: "Analytics & Reports", icon: BarChart3 },
  { label: "Settings", displayLabel: "Settings & Security", icon: Settings }
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
  const getNavItems = (): NavItemDef[] => {
    switch (currentUser.role) {
      case "Student":
        return STUDENT_NAV;
      case "Placement Admin":
        return PLACEMENT_ADMIN_NAV;
      case "Recruiter":
        return RECRUITER_NAV;
      default:
        return STUDENT_NAV;
    }
  };

  const navList = getNavItems();

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
        {navList.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.label;

          return (
            <button
              key={item.label}
              className={`nav-link-btn ${isActive ? "active" : ""}`}
              onClick={() => onSelectPage(item.label)}
              title={collapsed ? item.displayLabel : undefined}
            >
              <Icon size={18} />
              {!collapsed && <span>{item.displayLabel}</span>}
              {!collapsed && item.badge && (
                <span className="nav-badge-pill">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div
          className="user-cell"
          onClick={onOpenSettings}
          title="Click to view Settings & Security"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onOpenSettings();
            }
          }}
        >
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
