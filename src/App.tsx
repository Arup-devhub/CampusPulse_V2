import React, { useState, useEffect } from "react";
import { Page, Role, AssessmentItem, AIInterviewSession, WorkshopCohort, NotificationItem } from "./types";
import {
  initialWorkshops, initialAssessments, initialInterviews,
  initialNotifications
} from "./data/mockData";
import {
  LayoutDashboard, Target, Video, ClipboardCheck, Briefcase,
  User, Sparkles, Users, BookOpen
} from "lucide-react";

// Auth & Services
import { authService, UserProfile, AuthSession } from "./services/authService";
import { LoginPage } from "./pages/LoginPage";
import { StudentSignupPage } from "./pages/auth/StudentSignupPage";
import { PlacementAdminSignupPage } from "./pages/auth/PlacementAdminSignupPage";
import { RecruiterSignupPage } from "./pages/auth/RecruiterSignupPage";

// Layout components
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { NotificationDrawer } from "./components/layout/NotificationDrawer";
import { SearchModal } from "./components/layout/SearchModal";
import { AccessDenied } from "./components/layout/AccessDenied";

// Modals
import { LogoutModal } from "./components/auth/LogoutModal";
import { AssessmentSessionModal } from "./components/assessment/AssessmentSessionModal";
import { ProctoringModal } from "./components/assessment/ProctoringModal";
import { LiveInterviewModal } from "./components/interview/LiveInterviewModal";
import { InterviewResultModal } from "./components/interview/InterviewResultModal";
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

// Role-based Access Control matrix conforming strictly to PRD §38 & Architecture
const ROLE_PERMITTED_PAGES: Record<Role, Page[]> = {
  Student: [
    "Dashboard",
    "Readiness",
    "Skill Gaps",
    "Recommendations",
    "AI Interviews",
    "Assessments",
    "Workshops",
    "Placement Drives",
    "Resumes",
    "Settings"
  ],
  "Placement Admin": [
    "Dashboard",
    "Students",
    "Recruiters",
    "Placement Drives",
    "Assessments",
    "AI Interviews",
    "AI Matching",
    "Readiness",
    "Skill Gaps",
    "Workshops",
    "Resumes",
    "Reports",
    "Settings"
  ],
  Recruiter: [
    "Dashboard",
    "Students",
    "Placement Drives",
    "AI Matching",
    "Assessments",
    "AI Interviews",
    "Reports",
    "Settings"
  ]
};

type AuthRoute = "/login" | "/signup/student" | "/signup/placement-admin" | "/signup/recruiter";

export default function App() {
  // Authentication session state
  const [session, setSession] = useState<AuthSession | null>(authService.getSession());
  const currentUser: UserProfile | null = session?.user || null;
  const isAuthenticated = !!session?.isAuthenticated;

  // Unauthenticated Route Navigation State
  const [authRoute, setAuthRoute] = useState<AuthRoute>(() => {
    const path = window.location.pathname;
    if (path.includes("/signup/student")) return "/signup/student";
    if (path.includes("/signup/placement-admin")) return "/signup/placement-admin";
    if (path.includes("/signup/recruiter")) return "/signup/recruiter";
    return "/login";
  });
  const [selectedAuthRole, setSelectedAuthRole] = useState<Role>("Student");

  const [page, setPage] = useState<Page>("Dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // App data state
  const [workshops, setWorkshops] = useState<WorkshopCohort[]>(initialWorkshops);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  // Global Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
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

  // Synchronize browser history and popstate
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes("/signup/student")) {
        setAuthRoute("/signup/student");
        setSelectedAuthRole("Student");
      } else if (path.includes("/signup/placement-admin")) {
        setAuthRoute("/signup/placement-admin");
        setSelectedAuthRole("Placement Admin");
      } else if (path.includes("/signup/recruiter")) {
        setAuthRoute("/signup/recruiter");
        setSelectedAuthRole("Recruiter");
      } else if (!authService.isAuthenticated()) {
        setAuthRoute("/login");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Subscribe to auth session changes
  useEffect(() => {
    const unsubscribe = authService.subscribe((newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        setPage("Dashboard");
        try {
          window.history.pushState(null, "", "/dashboard");
        } catch (e) {
          // ignore in restricted environments
        }
      }
    });
    return unsubscribe;
  }, []);

  // Dynamic page-specific document.title management (Section 10)
  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      if (authRoute === "/signup/student") {
        document.title = "CampusPulse — Student Registration";
      } else if (authRoute === "/signup/placement-admin") {
        document.title = "CampusPulse — Placement Admin Registration";
      } else if (authRoute === "/signup/recruiter") {
        document.title = "CampusPulse — Recruiter Registration";
      } else {
        document.title = "CampusPulse — Sign In";
      }
      return;
    }

    const titleMap: Record<Page, string> = {
      Dashboard: "CampusPulse — Dashboard",
      Readiness: "CampusPulse — Readiness",
      "Skill Gaps": "CampusPulse — Skill Gaps",
      Recommendations: "CampusPulse — Recommendations",
      "AI Interviews": "CampusPulse — AI Interview",
      Assessments: "CampusPulse — Assessments",
      Workshops: "CampusPulse — Workshops",
      "Placement Drives": "CampusPulse — Placement Drives",
      "AI Matching": "CampusPulse — AI Matching",
      Students: "CampusPulse — Candidates & Students",
      Recruiters: "CampusPulse — Corporate Partners",
      Resumes: "CampusPulse — Resume",
      Reports: "CampusPulse — Analytics & Reports",
      Settings: "CampusPulse — Settings"
    };

    document.title = titleMap[page] || "CampusPulse";
  }, [isAuthenticated, currentUser, authRoute, page]);

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

  // Routing helper for unauthenticated flows
  const navigateToAuthRoute = (targetRoute: AuthRoute, role?: Role) => {
    setAuthRoute(targetRoute);
    if (role) {
      setSelectedAuthRole(role);
    }
    try {
      window.history.pushState(null, "", targetRoute);
    } catch (e) {
      // ignore
    }
  };

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

  const handleConfirmLogout = async () => {
    setIsLogoutModalOpen(false);
    await authService.logout();
    navigateToAuthRoute("/login", currentUser?.role || "Student");
  };

  // 1. UNAUTHENTICATED STATE -> Render dedicated Role-Specific Signup or Unified /login
  if (!isAuthenticated || !currentUser) {
    if (authRoute === "/signup/student") {
      return (
        <StudentSignupPage
          onSuccess={() => {
            setPage("Dashboard");
          }}
          onNavigateLogin={() => navigateToAuthRoute("/login", "Student")}
        />
      );
    }

    if (authRoute === "/signup/placement-admin") {
      return (
        <PlacementAdminSignupPage
          onSuccess={() => {
            setPage("Dashboard");
          }}
          onNavigateLogin={() => navigateToAuthRoute("/login", "Placement Admin")}
        />
      );
    }

    if (authRoute === "/signup/recruiter") {
      return (
        <RecruiterSignupPage
          onSuccess={() => {
            setPage("Dashboard");
          }}
          onNavigateLogin={() => navigateToAuthRoute("/login", "Recruiter")}
        />
      );
    }

    // Default: /login
    return (
      <LoginPage
        initialRole={selectedAuthRole}
        onLoginSuccess={() => {
          setPage("Dashboard");
        }}
        onNavigateSignup={(role) => {
          if (role === "Student") {
            navigateToAuthRoute("/signup/student", "Student");
          } else if (role === "Placement Admin") {
            navigateToAuthRoute("/signup/placement-admin", "Placement Admin");
          } else {
            navigateToAuthRoute("/signup/recruiter", "Recruiter");
          }
        }}
      />
    );
  }

  // 2. CHECK ROUTE AUTHORIZATION FOR CURRENT ROLE
  const isAuthorized = ROLE_PERMITTED_PAGES[currentUser.role]?.includes(page);

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
        currentUser={currentUser}
        onOpenSettings={() => {
          setPage("Settings");
          setMobileSidebarOpen(false);
        }}
        onOpenLogoutModal={() => setIsLogoutModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className={`main-shell ${sidebarCollapsed ? "collapsed" : ""}`}>
        <Header
          currentPage={page}
          currentUser={currentUser}
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
          {/* ACCESS CONTROL CHECK */}
          {!isAuthorized ? (
            <AccessDenied
              attemptedPage={page}
              userRole={currentUser.role}
              onGoToDashboard={() => setPage("Dashboard")}
            />
          ) : (
            <>
              {page === "Dashboard" && (
                <DashboardPage
                  role={currentUser.role}
                  currentUser={currentUser}
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
                  onViewResult={(sessionResult) => {
                    setActiveInterviewSession(sessionResult);
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
                  role={currentUser.role}
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

              {page === "Resumes" && <ResumePage currentUser={currentUser} />}

              {page === "Reports" && <ReportsPage />}

              {page === "Settings" && (
                <SettingsPage
                  role={currentUser.role}
                  currentUser={currentUser}
                  onOpenLogoutModal={() => setIsLogoutModalOpen(true)}
                />
              )}
            </>
          )}
        </main>

        {/* Mobile Bottom Navigation Bar (Role-Adaptive) */}
        <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
          <button
            className={`mobile-nav-btn ${page === "Dashboard" ? "active" : ""}`}
            onClick={() => setPage("Dashboard")}
          >
            <LayoutDashboard size={17} />
            <span>Home</span>
          </button>

          {currentUser.role === "Student" && (
            <>
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
                className={`mobile-nav-btn ${page === "Resumes" ? "active" : ""}`}
                onClick={() => setPage("Resumes")}
              >
                <Briefcase size={17} />
                <span>Resume</span>
              </button>
            </>
          )}

          {currentUser.role === "Placement Admin" && (
            <>
              <button
                className={`mobile-nav-btn ${page === "Students" ? "active" : ""}`}
                onClick={() => setPage("Students")}
              >
                <Users size={17} />
                <span>Students</span>
              </button>
              <button
                className={`mobile-nav-btn ${page === "Workshops" ? "active" : ""}`}
                onClick={() => setPage("Workshops")}
              >
                <BookOpen size={17} />
                <span>Workshops</span>
              </button>
              <button
                className={`mobile-nav-btn ${page === "AI Matching" ? "active" : ""}`}
                onClick={() => setPage("AI Matching")}
              >
                <Sparkles size={17} />
                <span>Match</span>
              </button>
            </>
          )}

          {currentUser.role === "Recruiter" && (
            <>
              <button
                className={`mobile-nav-btn ${page === "Students" ? "active" : ""}`}
                onClick={() => setPage("Students")}
              >
                <Users size={17} />
                <span>Candidates</span>
              </button>
              <button
                className={`mobile-nav-btn ${page === "AI Matching" ? "active" : ""}`}
                onClick={() => setPage("AI Matching")}
              >
                <Sparkles size={17} />
                <span>Match AI</span>
              </button>
              <button
                className={`mobile-nav-btn ${page === "Placement Drives" ? "active" : ""}`}
                onClick={() => setPage("Placement Drives")}
              >
                <Briefcase size={17} />
                <span>Drives</span>
              </button>
            </>
          )}

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
