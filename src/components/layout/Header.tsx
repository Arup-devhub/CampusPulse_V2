import React, { useState, useRef, useEffect } from "react";
import {
  Menu, Search, Bell, ChevronDown, User, Shield, LogOut,
  SlidersHorizontal, CheckCircle2, Building2, Sun, Moon
} from "lucide-react";
import { Page, Role } from "../../types";
import { UserProfile } from "../../services/authService";

interface HeaderProps {
  currentPage: Page;
  currentUser: UserProfile;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
  onOpenLogoutModal: () => void;
  onSelectPage: (page: Page) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  currentUser,
  theme,
  onToggleTheme,
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

        <button
          type="button"
          className="header-brand-logo-btn"
          onClick={() => onSelectPage("Dashboard")}
          aria-label="CampusPulse Dashboard"
        >
          <img
            src="/campuspulse-logo.png"
            alt="CampusPulse"
            className="header-official-logo"
          />
        </button>

        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <button
            type="button"
            className="breadcrumb-root-btn"
            onClick={() => onSelectPage("Dashboard")}
            aria-label="CampusPulse Dashboard"
          >
            CampusPulse
          </button>
          <span className="breadcrumb-separator">/</span>
          <strong>
            {currentPage === "Resumes"
              ? currentUser.role === "Student"
                ? "My Resume"
                : currentUser.role === "Placement Admin"
                ? "Student Resumes"
                : "Candidate Resumes"
              : currentPage}
          </strong>
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
        {/* Notifications Button */}
        <button
          className="icon-action-btn"
          onClick={onOpenNotifications}
          aria-label={`Notifications (${unreadNotificationsCount} unread)`}
        >
          <Bell size={18} />
          {unreadNotificationsCount > 0 && <span className="badge-dot" />}
        </button>

        {/* Theme Toggle Button (Light ↔ Dark) */}
        <button
          className="icon-action-btn theme-toggle-btn"
          onClick={onToggleTheme}
          aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
        </button>

        {/* Dynamic Authenticated User Identity Trigger & Popover */}
        <div className="profile-menu-container" ref={dropdownRef}>
          <button
            className="profile-trigger dynamic-identity-trigger"
            onClick={() => setProfileOpen((prev) => !prev)}
            aria-expanded={profileOpen}
            aria-haspopup="true"
            aria-label={`User menu for ${currentUser.name}`}
          >
            <div className="user-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>
              {currentUser.avatarInitials}
            </div>

            <div className="header-identity-text">
              <span className="header-user-name">{currentUser.name}</span>
              <span className="header-user-role">
                {currentUser.role}
                {currentUser.role === "Recruiter" && currentUser.companyName ? ` · ${currentUser.companyName.split(" ")[0]}` : ""}
              </span>
            </div>

            <ChevronDown size={14} style={{ color: "var(--cp-grey-500)", marginLeft: 2 }} />
          </button>

          {profileOpen && (
            <div className="profile-menu-popover" role="menu">
              <div style={{ padding: "10px 14px 12px", borderBottom: "1px solid var(--cp-grey-200)" }}>
                <b style={{ display: "block", fontSize: 13, color: "var(--cp-black)" }}>
                  {currentUser.name}
                </b>
                <span style={{ fontSize: 11, color: "var(--cp-grey-600)", display: "block" }}>
                  {currentUser.email}
                </span>
                <span className="badge badge-neutral" style={{ marginTop: 6, fontSize: 10, display: "inline-block" }}>
                  {currentUser.role}
                  {currentUser.companyName ? ` · ${currentUser.companyName}` : ""}
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

                <button
                  className="profile-menu-item"
                  role="menuitem"
                  onClick={() => {
                    onToggleTheme();
                    setProfileOpen(false);
                  }}
                  aria-label={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                >
                  {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
                  <span>{theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}</span>
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
