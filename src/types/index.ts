export type Role = "Student" | "Placement Admin" | "Recruiter";

export type Page =
  | "Dashboard"
  | "Students"
  | "Recruiters"
  | "Placement Drives"
  | "Assessments"
  | "AI Interviews"
  | "AI Matching"
  | "Readiness"
  | "Skill Gaps"
  | "Recommendations"
  | "Resumes"
  | "Reports"
  | "Workshops"
  | "Settings";

export type ReadinessRisk = "Ready" | "Developing" | "At Risk";

export interface Student {
  id: string;
  name: string;
  regNo: string;
  email: string;
  branch: string;
  semester: number;
  cgpa: number;
  backlogs: number;
  readiness: number;
  risk: ReadinessRisk;
  topSkills: string[];
  placementStatus: "Placed" | "In Process" | "Not Placed" | "Opted Out";
  githubUrl?: string;
  linkedinUrl?: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  openRoles: number;
  activeDrives: number;
  avgPackage: string;
  status: "Active Partner" | "Visiting Soon" | "Inactive";
  recruiterContact: string;
}

export interface PlacementDrive {
  id: string;
  company: string;
  role: string;
  package: string;
  deadline: string;
  driveDate: string;
  eligibility: string;
  minCgpa: number;
  stages: string[];
  candidatesCount: number;
  avgReadiness: number;
  status: "Active" | "Upcoming" | "Completed" | "Review";
}

export interface SkillGapItem {
  skill: string;
  required: string;
  studentLevel: string;
  score: number;
  requiredScore: number;
  gap: number;
  priority: "Critical" | "High" | "Medium" | "Low";
  studentsAffected: number;
  linkedCompany: string;
  action: string;
}

export interface Recommendation {
  id: string;
  title: string;
  category: "Coding" | "Technical" | "Interview" | "Resume" | "Aptitude";
  reason: string;
  expectedImpact: string;
  priority: "High" | "Medium" | "Low";
  estimatedEffort: string;
  companyTarget: string;
  actionText: string;
  completed?: boolean;
}

export interface WorkshopCohort {
  id: string;
  title: string;
  targetSkill: string;
  studentsAffected: number;
  avgScoreBefore: number;
  requiredScore: number;
  priority: "High" | "Critical" | "Medium";
  linkedDrive: string;
  deliveryMode: "Classroom" | "Online" | "Hybrid";
  instructor: string;
  date: string;
  time: string;
  duration: string;
  venue: string;
  capacity: number;
  registeredCount: number;
  attendedCount: number;
  status: "Registration Open" | "Full" | "Completed" | "In Progress";
  userRegistered?: boolean;
}

export interface AssessmentItem {
  id: string;
  title: string;
  type: "Aptitude" | "Technical" | "Coding" | "Company-Specific";
  company: string;
  durationMinutes: number;
  questionsCount: number;
  avgScore: number;
  attemptsCount: number;
  completionRate: string;
  status: "Live" | "Scheduled" | "Completed" | "Review";
  proctoringEventsCount: number;
  score?: number;
}

export interface AIInterviewSession {
  id: string;
  company: string;
  role: string;
  type: "Technical" | "HR" | "Behavioral";
  durationMinutes: number;
  questionsCount: number;
  status: "Ready" | "In Progress" | "Completed";
  score?: number;
  date?: string;
  technicalScore?: number;
  relevanceScore?: number;
  problemSolvingScore?: number;
  communicationScore?: number;
  feedbackSummary?: string;
  areasToImprove?: string[];
}

export interface ProctoringEvent {
  timestamp: string;
  eventType: "Candidate detected" | "Multiple person detected" | "Looking away" | "Phone detected" | "Candidate absent";
  confidence: number;
  riskLevel: "Low" | "Medium" | "High";
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "drive" | "assessment" | "interview" | "workshop" | "alert";
  read: boolean;
}
