import React, { useState, useEffect } from "react";
import { Page, Role, AssessmentItem, AIInterviewSession, WorkshopCohort, NotificationItem } from "./types";
import {
  initialWorkshops, initialAssessments, initialInterviews,
  initialNotifications
} from "./data/mockData";
import { LayoutDashboard, Target, Video, ClipboardCheck, Briefcase, User } from "lucide-react";

// Layout components
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { NotificationDrawer } from "./components/layout/NotificationDrawer";
import { SearchModal } from "./components/layout/SearchModal";

// Auth modals
import { AuthModal } from "./components/auth/AuthModal";
import { LogoutModal } from "./components/auth/LogoutModal";

// Assessment & Interview modals
import { AssessmentSessionModal } from "./components/assessment/AssessmentSessionModal";
import { ProctoringModal } from "./components/assessment/ProctoringModal";
import { LiveInterviewModal } from "./components/interview/LiveInterviewModal";
import { InterviewResultModal } from "./components/interview/InterviewResultModal";

// Workshop modals
import { WorkshopBuilderModal } from "./components/workshop/WorkshopBuilderModal";
import { WorkshopAttendanceModal } from "./components/workshop/WorkshopAttendanceModal";

// Domain Pages
import { DashboardPage } from "./pages/DashboardPage";
import { ReadinessPage } from "./pages/ReadinessPage";
import { SkillGapsPage } from "./pages/SkillGapsPage";
import { RecommendationsPage } from "./pages/RecommendationsPage";
import { AIInterviewsPage } from "./pages/AIInterviewsPage";
import { AssessmentsPage } from "./pages/AssessmentsPage";
import { WorkshopsPage } from "./pages/WorkshopsPage";
import { DrivesPage } from "./pages/DrivesPage";
import { AIMatchingPage } from "./pages/AIMatchingPage";
import { StudentsPage } from "./pages/StudentsPage";
import { RecruitersPage } from "./pages/RecruitersPage";
import { ResumePage } from "./pages/ResumePage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";

export default function App() {
  const [page, setPage] = useState<Page>("Dashboard");
  const [role, setRole] = useState<Role>("Student");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // App data state
  const [workshops, setWorkshops] = useState<WorkshopCohort[]>(initialWorkshops);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Assessment session modal
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [activeAssessment, setActiveAssessment] = useState<AssessmentItem>(initialAssessments[0]);

  // Proctoring modal
  const [isProctoringOpen, setIsProctoringOpen] = useState(false);

  // AI Interview modals
  const [isLiveInterviewOpen, setIsLiveInterviewOpen] = useState(false);
  const [interviewCompany, setInterviewCompany] = useState("TCS");
  const [interviewRoleTitle, setInterviewRoleTitle] = useState("Digital Software Engineer");
  const [isInterviewResultOpen, setIsInterviewResultOpen] = useState(false);
  const [activeInterviewSession, setActiveInterviewSession] = useState<AIInterviewSession>(initialInterviews[0]);

  // Workshop modals
  const [isWorkshopBuilderOpen, setIsWorkshopBuilderOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [selectedWorkshopForAttendance, setSelectedWorkshopForAttendance] = useState<WorkshopCohort>(initialWorkshops[0]);

  // Global Ctrl+K / Cmd+K shortcut for search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handlers
  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleToggleWorkshopRegistration = (workshopId: string) => {
    setWorkshops((prev) =>
      prev.map((ws) =>
        ws.id === workshopId
          ? {
              ...ws,
              userRegistered: !ws.userRegistered,
              registeredCount: ws.userRegistered ? ws.registeredCount - 1 : ws.registeredCount + 1
            }
          : ws
      )
    );
  };

  const handleStartLiveInterview = (company: string, roleTitle: string) => {
    setInterviewCompany(company);
    setInterviewRoleTitle(roleTitle);
    setIsLiveInterviewOpen(true);
  };

  const handleFinishLiveInterview = () => {
    setIsLiveInterviewOpen(false);
    setActiveInterviewSession(initialInterviews[0]);
    setIsInterviewResultOpen(true);
  };

  const handleTakeAssessment = (asm: AssessmentItem) => {
    setActiveAssessment(asm);
    setIsAssessmentOpen(true);
  };

  const handleOpenProctoringInspector = (asm: AssessmentItem) => {
    setActiveAssessment(asm);
    setIsProctoringOpen(true);
  };

  const handleCreateWorkshop = (newWorkshop: WorkshopCohort) => {
    setWorkshops((prev) => [newWorkshop, ...prev]);
  };

  const handleOpenAttendanceModal = (ws: WorkshopCohort) => {
    setSelectedWorkshopForAttendance(ws);
    setIsAttendanceModalOpen(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="app-shell">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={page}
        onSelectPage={(p) => {
          setPage(p);
          setMobileSidebarOpen(false);
        }}
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        role={role}
        onOpenSettings={() => {
          setPage("Settings");
          setMobileSidebarOpen(false);
        }}
      />

      {/* Main Content Area */}
      <div className={`main-shell ${sidebarCollapsed ? "collapsed" : ""}`}>
        <Header
          currentPage={page}
          role={role}
          onRoleChange={(newRole) => {
            setRole(newRole);
            setPage("Dashboard");
          }}
          onToggleSidebar={() => {
            if (window.innerWidth <= 768) {
              setMobileSidebarOpen((prev) => !prev);
            } else {
              setSidebarCollapsed((prev) => !prev);
            }
          }}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          unreadNotificationsCount={notifications.filter((n) => !n.read).length}
          onOpenLogoutModal={() => setIsLogoutModalOpen(true)}
          onSelectPage={(p) => setPage(p)}
        />

        <main className="page-content-wrapper">
          {page === "Dashboard" && (
            <DashboardPage
              role={role}
              onNavigate={(p) => setPage(p)}
              onOpenWorkshopBuilder={() => setIsWorkshopBuilderOpen(true)}
              onStartInterview={() => handleStartLiveInterview("TCS", "Digital Software Engineer")}
              onStartAssessment={() => handleTakeAssessment(initialAssessments[0])}
            />
          )}

          {page === "Readiness" && (
            <ReadinessPage
              onNavigate={(p) => setPage(p)}
              onOpenWorkshop={() => setIsWorkshopBuilderOpen(true)}
            />
          )}

          {page === "Skill Gaps" && (
            <SkillGapsPage
              onOpenWorkshopBuilder={() => setIsWorkshopBuilderOpen(true)}
              onNavigate={(p) => setPage(p)}
            />
          )}

          {page === "Recommendations" && (
            <RecommendationsPage
              onNavigate={(p) => setPage(p)}
              onStartAssessment={() => handleTakeAssessment(initialAssessments[0])}
              onStartInterview={() => handleStartLiveInterview("TCS", "Digital Software Engineer")}
            />
          )}

          {page === "AI Interviews" && (
            <AIInterviewsPage
              onStartLiveInterview={handleStartLiveInterview}
              onViewResult={(session) => {
                setActiveInterviewSession(session);
                setIsInterviewResultOpen(true);
              }}
            />
          )}

          {page === "Assessments" && (
            <AssessmentsPage
              onTakeAssessment={handleTakeAssessment}
              onOpenProctoringInspector={handleOpenProctoringInspector}
            />
          )}

          {page === "Workshops" && (
            <WorkshopsPage
              workshops={workshops}
              role={role}
              onOpenCreateModal={() => setIsWorkshopBuilderOpen(true)}
              onOpenAttendanceModal={handleOpenAttendanceModal}
              onToggleRegister={handleToggleWorkshopRegistration}
            />
          )}

          {page === "Placement Drives" && (
            <DrivesPage onNavigate={(p) => setPage(p)} />
          )}

          {page === "AI Matching" && <AIMatchingPage />}

          {page === "Students" && <StudentsPage />}

          {page === "Recruiters" && <RecruitersPage />}

          {page === "Resumes" && <ResumePage />}

          {page === "Reports" && <ReportsPage />}

          {page === "Settings" && (
            <SettingsPage
              role={role}
              onOpenLogoutModal={() => setIsLogoutModalOpen(true)}
            />
          )}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
          <button
            className={`mobile-nav-btn ${page === "Dashboard" ? "active" : ""}`}
            onClick={() => setPage("Dashboard")}
          >
            <LayoutDashboard size={17} />
            <span>Home</span>
          </button>
          <button
            className={`mobile-nav-btn ${page === "Readiness" ? "active" : ""}`}
            onClick={() => setPage("Readiness")}
          >
            <Target size={17} />
            <span>Readiness</span>
          </button>
          <button
            className={`mobile-nav-btn ${page === "AI Interviews" ? "active" : ""}`}
            onClick={() => setPage("AI Interviews")}
          >
            <Video size={17} />
            <span>Interview</span>
          </button>
          <button
            className={`mobile-nav-btn ${page === "Assessments" ? "active" : ""}`}
            onClick={() => setPage("Assessments")}
          >
            <ClipboardCheck size={17} />
            <span>Assess</span>
          </button>
          <button
            className={`mobile-nav-btn ${page === "Placement Drives" ? "active" : ""}`}
            onClick={() => setPage("Placement Drives")}
          >
            <Briefcase size={17} />
            <span>Drives</span>
          </button>
          <button
            className={`mobile-nav-btn ${page === "Settings" ? "active" : ""}`}
            onClick={() => setPage("Settings")}
          >
            <User size={17} />
            <span>Profile</span>
          </button>
        </nav>
      </div>

      {/* Global Modals & Drawers */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(p) => setPage(p)}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onSelectNotification={(p) => setPage(p)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(newRole) => {
          setRole(newRole);
          setPage("Dashboard");
        }}
      />

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirmLogout={handleConfirmLogout}
      />

      <AssessmentSessionModal
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
        title={activeAssessment.title}
        company={activeAssessment.company}
        onFinish={(score) => {
          // Score recorded in assessment state
        }}
      />

      <ProctoringModal
        isOpen={isProctoringOpen}
        onClose={() => setIsProctoringOpen(false)}
        sessionId={activeAssessment.id}
      />

      <LiveInterviewModal
        isOpen={isLiveInterviewOpen}
        onClose={() => setIsLiveInterviewOpen(false)}
        company={interviewCompany}
        roleTitle={interviewRoleTitle}
        onFinishInterview={handleFinishLiveInterview}
      />

      <InterviewResultModal
        isOpen={isInterviewResultOpen}
        onClose={() => setIsInterviewResultOpen(false)}
        session={activeInterviewSession}
      />

      <WorkshopBuilderModal
        isOpen={isWorkshopBuilderOpen}
        onClose={() => setIsWorkshopBuilderOpen(false)}
        onWorkshopCreated={handleCreateWorkshop}
      />

      {selectedWorkshopForAttendance && (
        <WorkshopAttendanceModal
          isOpen={isAttendanceModalOpen}
          onClose={() => setIsAttendanceModalOpen(false)}
          workshop={selectedWorkshopForAttendance}
        />
      )}
    </div>
  );
}
