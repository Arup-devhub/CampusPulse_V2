import React from "react";
import {
  LayoutDashboard, Users, Building2, Briefcase, ClipboardCheck,
  Video, Sparkles, Target, AlertTriangle, Lightbulb, FileText,
  BarChart3, BookOpen, Settings, ChevronRight, GraduationCap
} from "lucide-react";
import { Page, Role } from "../../types";

interface SidebarProps {
  currentPage: Page;
  onSelectPage: (page: Page) => void;
  collapsed: boolean;
  mobileOpen: boolean;
  role: Role;
  onOpenSettings: () => void;
}

interface NavItemDef {
  label: Page;
  icon: any;
  badge?: string;
  roles: Role[];
}

const navItems: NavItemDef[] = [
  { label: "Dashboard", icon: LayoutDashboard, roles: ["Student", "Placement Admin", "Recruiter"] },
  { label: "Readiness", icon: Target, badge: "Core", roles: ["Student", "Placement Admin", "Recruiter"] },
  { label: "Skill Gaps", icon: AlertTriangle, roles: ["Student", "Placement Admin"] },
  { label: "Recommendations", icon: Lightbulb, roles: ["Student", "Placement Admin"] },
  { label: "AI Interviews", icon: Video, badge: "AI", roles: ["Student", "Placement Admin", "Recruiter"] },
  { label: "Assessments", icon: ClipboardCheck, roles: ["Student", "Placement Admin", "Recruiter"] },
  { label: "Workshops", icon: BookOpen, badge: "Intervention", roles: ["Student", "Placement Admin"] },
  { label: "Placement Drives", icon: Briefcase, roles: ["Student", "Placement Admin", "Recruiter"] },
  { label: "AI Matching", icon: Sparkles, roles: ["Placement Admin", "Recruiter"] },
  { label: "Students", icon: Users, roles: ["Placement Admin", "Recruiter"] },
  { label: "Recruiters", icon: Building2, roles: ["Placement Admin"] },
  { label: "Resumes", icon: FileText, roles: ["Student", "Placement Admin"] },
  { label: "Reports", icon: BarChart3, roles: ["Student", "Placement Admin", "Recruiter"] },
  { label: "Settings", icon: Settings, roles: ["Student", "Placement Admin", "Recruiter"] }
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  collapsed,
  mobileOpen,
  role,
  onOpenSettings
}) => {
  const filteredNav = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside
      className={`sidebar ${collapsed ? "closed" : ""} ${mobileOpen ? "mobile-open" : ""}`}
      aria-label="Main Application Navigation"
    >
      <div className="sidebar-header">
        <div className="brand-wrapper">
          <div className="brand-icon">
            <GraduationCap size={18} />
          </div>
          {!collapsed && (
            <div className="brand-text">
              <strong>CampusPulse</strong>
              <span>Placement Intelligence</span>
            </div>
          )}
        </div>
      </div>

      {!collapsed && (
        <div className="role-badge-pill">
          <div>
            <span className="role-indicator-dot" />
            <span>{role}</span>
          </div>
          <ChevronRight size={13} style={{ color: "var(--cp-grey-500)" }} />
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
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} />
              {!collapsed && <span>{item.label}</span>}
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
            {role === "Student" ? "PD" : role === "Recruiter" ? "TC" : "PO"}
          </div>
          {!collapsed && (
            <div className="user-details">
              <b>{role === "Student" ? "Priyanshu Dash" : role === "Recruiter" ? "TCS Talent Team" : "Placement Officer"}</b>
              <span>{role === "Student" ? "CSE · 7th Sem" : role === "Recruiter" ? "Recruiter" : "Admin Cell"}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
