import React, { useState, useRef, useEffect } from "react";
import {
  Menu, Search, Bell, ChevronDown, User, Shield, LogOut,
  SlidersHorizontal, CheckCircle2
} from "lucide-react";
import { Page, Role } from "../../types";

interface HeaderProps {
  currentPage: Page;
  role: Role;
  onRoleChange: (role: Role) => void;
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
  onOpenLogoutModal: () => void;
  onSelectPage: (page: Page) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  role,
  onRoleChange,
  onToggleSidebar,
  onOpenSearch,
  onOpenNotifications,
  unreadNotificationsCount,
  onOpenLogoutModal,
  onSelectPage
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="top-header" role="banner">
      <div className="header-left">
        <button
          className="toggle-sidebar-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation sidebar"
        >
          <Menu size={18} />
        </button>

        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <span>CampusPulse</span>
          <span>/</span>
          <strong>{currentPage}</strong>
        </nav>

        <div
          className="search-trigger-bar"
          onClick={onOpenSearch}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpenSearch()}
          aria-label="Search students, companies, drives"
        >
          <Search size={15} />
          <span>Search students, companies, drives...</span>
          <kbd>Ctrl+K</kbd>
        </div>
      </div>

      <div className="header-right">
        {/* Role Switcher */}
        <div className="role-segment" role="group" aria-label="Role Switcher">
          {(["Student", "Placement Admin", "Recruiter"] as Role[]).map((r) => (
            <button
              key={r}
              className={role === r ? "active" : ""}
              onClick={() => onRoleChange(r)}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Notifications Button */}
        <button
          className="icon-action-btn"
          onClick={onOpenNotifications}
          aria-label={`Notifications (${unreadNotificationsCount} unread)`}
        >
          <Bell size={18} />
          {unreadNotificationsCount > 0 && <span className="badge-dot" />}
        </button>

        {/* Profile Menu */}
        <div className="profile-menu-container" ref={dropdownRef}>
          <button
            className="profile-trigger"
            onClick={() => setProfileOpen((prev) => !prev)}
            aria-expanded={profileOpen}
            aria-haspopup="true"
          >
            <div className="user-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
              {role === "Student" ? "PD" : role === "Recruiter" ? "TC" : "PO"}
            </div>
            <ChevronDown size={14} style={{ color: "var(--cp-grey-600)" }} />
          </button>

          {profileOpen && (
            <div className="profile-menu-popover" role="menu">
              <div style={{ padding: "8px 12px 10px", borderBottom: "1px solid var(--cp-grey-200)" }}>
                <b style={{ display: "block", fontSize: 13, color: "var(--cp-black)" }}>
                  {role === "Student" ? "Priyanshu Dash" : role === "Recruiter" ? "TCS Campus Lead" : "Prof. S. Tripathy"}
                </b>
                <span style={{ fontSize: 11, color: "var(--cp-grey-500)" }}>
                  {role === "Student" ? "priyanshu.d@campus.edu" : "officer@campuspulse.edu"}
                </span>
              </div>

              <div style={{ padding: "4px 0" }}>
                <button
                  className="profile-menu-item"
                  role="menuitem"
                  onClick={() => {
                    setProfileOpen(false);
                    onSelectPage("Settings");
                  }}
                >
                  <User size={15} />
                  <span>View Profile</span>
                </button>

                <button
                  className="profile-menu-item"
                  role="menuitem"
                  onClick={() => {
                    setProfileOpen(false);
                    onSelectPage("Settings");
                  }}
                >
                  <SlidersHorizontal size={15} />
                  <span>Account Settings</span>
                </button>

                <button
                  className="profile-menu-item"
                  role="menuitem"
                  onClick={() => {
                    setProfileOpen(false);
                    onSelectPage("Settings");
                  }}
                >
                  <Shield size={15} />
                  <span>Security & Sessions</span>
                </button>
              </div>

              <div className="menu-divider" />

              <button
                className="profile-menu-item logout-danger"
                role="menuitem"
                onClick={() => {
                  setProfileOpen(false);
                  onOpenLogoutModal();
                }}
              >
                <LogOut size={15} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
