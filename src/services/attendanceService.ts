import {
  StudentAttendanceItem,
  InterviewEligibilityStatus,
  CgpaTier,
  CgpaTierDisplay
} from "../types";

const ATTENDANCE_STORAGE_KEY = "campuspulse_attendance_v2";

export const CGPA_THRESHOLDS = {
  minimum: 7.0,
  tier2: 7.5,
  tier3: 8.0,
  tier4: 8.5,
  tier5: 9.0
} as const;

export const MIN_TOTAL_ATTENDANCE = 75.0; // strict > 75.0%

export interface AttendanceKPIs {
  totalStudents: number;
  attendanceEligibleCount: number; // Attendance > 75%
  cgpaEligibleCount: number;       // CGPA >= 7.0
  interviewEligibleCount: number;  // Attendance > 75% AND CGPA >= 7.0 (Eligible + Restricted)
  notEligibleCount: number;        // Attendance <= 75% OR CGPA < 7.0
  updatesTodayCount: number;
}

export function getCgpaTier(cgpa: number): CgpaTier {
  if (cgpa < CGPA_THRESHOLDS.minimum) return "NOT_ELIGIBLE";
  if (cgpa < CGPA_THRESHOLDS.tier2) return "TIER_1";
  if (cgpa < CGPA_THRESHOLDS.tier3) return "TIER_2";
  if (cgpa < CGPA_THRESHOLDS.tier4) return "TIER_3";
  if (cgpa < CGPA_THRESHOLDS.tier5) return "TIER_4";
  return "TIER_5";
}

export function getTierDisplay(tier: CgpaTier): CgpaTierDisplay {
  switch (tier) {
    case "NOT_ELIGIBLE":
      return "Not Eligible";
    case "TIER_1":
      return "Tier 1";
    case "TIER_2":
      return "Tier 2";
    case "TIER_3":
      return "Tier 3";
    case "TIER_4":
      return "Tier 4";
    case "TIER_5":
      return "Tier 5";
  }
}

export function getTierMaxCutoff(tier: CgpaTier): number {
  switch (tier) {
    case "NOT_ELIGIBLE":
      return 0;
    case "TIER_1":
      return 7.0;
    case "TIER_2":
      return 7.5;
    case "TIER_3":
      return 8.0;
    case "TIER_4":
      return 8.5;
    case "TIER_5":
      return 9.0;
  }
}

export function isAttendanceEligible(totalAttendance: number): boolean {
  return totalAttendance > MIN_TOTAL_ATTENDANCE;
}

export interface InterviewEligibilityParams {
  cgpa: number;
  totalAttendance: number;
  interviewCgpaCutoff?: number;
  driveName?: string;
}

export interface InterviewEligibilityEvaluation {
  status: InterviewEligibilityStatus;
  tier: CgpaTier;
  tierDisplay: CgpaTierDisplay;
  tierMaxCutoff: number;
  attendancePassed: boolean;
  cgpaPassed: boolean;
  reason: string;
  eligibleForSummary: string;
  notEligibleForSummary?: string;
}

/**
 * Centralized, authoritative calculation of student interview eligibility.
 * Enforces:
 *  1. Total Attendance > 75.0% is a mandatory prerequisite.
 *  2. CGPA tiers determine eligibility for general interview pool.
 *  3. Specific drive cutoff takes precedence when evaluating a specific drive.
 */
export function calculateInterviewEligibility(
  params: InterviewEligibilityParams
): InterviewEligibilityEvaluation {
  const { cgpa, totalAttendance, interviewCgpaCutoff, driveName } = params;
  const attendancePassed = isAttendanceEligible(totalAttendance);
  const tier = getCgpaTier(cgpa);
  const tierDisplay = getTierDisplay(tier);
  const tierMaxCutoff = getTierMaxCutoff(tier);

  // 1. Attendance prerequisite failed (hard block)
  if (!attendancePassed) {
    const reason =
      totalAttendance === 75.0
        ? "Total attendance (75.0%) does not exceed the mandatory >75% threshold."
        : `Total attendance must be greater than 75% (currently ${totalAttendance}%).`;

    return {
      status: "Not Eligible",
      tier,
      tierDisplay,
      tierMaxCutoff,
      attendancePassed: false,
      cgpaPassed: interviewCgpaCutoff ? cgpa >= interviewCgpaCutoff : cgpa >= CGPA_THRESHOLDS.minimum,
      reason,
      eligibleForSummary: "None — Attendance prerequisite failed",
      notEligibleForSummary: "Not eligible for placement interviews until total attendance exceeds 75%"
    };
  }

  // 2. Specific company/drive evaluation
  if (interviewCgpaCutoff !== undefined) {
    const cgpaPassed = cgpa >= interviewCgpaCutoff;
    if (!cgpaPassed) {
      return {
        status: "Not Eligible",
        tier,
        tierDisplay,
        tierMaxCutoff,
        attendancePassed: true,
        cgpaPassed: false,
        reason: `CGPA (${cgpa}) is below the required cutoff (${interviewCgpaCutoff}) for ${driveName || "this drive"}.`,
        eligibleForSummary: tierMaxCutoff > 0 ? `Interviews with CGPA cutoff ≤ ${tierMaxCutoff}` : "None",
        notEligibleForSummary: `Not eligible for ${driveName || "this drive"} (requires ≥ ${interviewCgpaCutoff} CGPA)`
      };
    }

    return {
      status: "Eligible",
      tier,
      tierDisplay,
      tierMaxCutoff,
      attendancePassed: true,
      cgpaPassed: true,
      reason: `Satisfies both mandatory attendance (>75%) and CGPA requirement (≥ ${interviewCgpaCutoff}) for ${driveName || "this drive"}.`,
      eligibleForSummary: `Eligible for ${driveName || "this drive"} and interviews with cutoff ≤ ${tierMaxCutoff}`,
      notEligibleForSummary: undefined
    };
  }

  // 3. General interview eligibility
  if (cgpa < CGPA_THRESHOLDS.minimum) {
    return {
      status: "Not Eligible",
      tier,
      tierDisplay,
      tierMaxCutoff,
      attendancePassed: true,
      cgpaPassed: false,
      reason: `CGPA (${cgpa}) is below the minimum CampusPulse interview threshold of 7.0.`,
      eligibleForSummary: "None — CGPA below minimum 7.0 threshold",
      notEligibleForSummary: "Not eligible for interviews requiring ≥ 7.0 CGPA"
    };
  }

  if (cgpa >= CGPA_THRESHOLDS.tier5) {
    return {
      status: "Eligible",
      tier,
      tierDisplay,
      tierMaxCutoff,
      attendancePassed: true,
      cgpaPassed: true,
      reason: "Top CGPA Tier (Tier 5) with passed attendance requirement.",
      eligibleForSummary: "Eligible for all interviews with CGPA cutoff ≤ 9.0",
      notEligibleForSummary: undefined
    };
  }

  // Tier 1 to Tier 4: Restricted to interviews within their tier cutoff
  return {
    status: "Restricted",
    tier,
    tierDisplay,
    tierMaxCutoff,
    attendancePassed: true,
    cgpaPassed: true,
    reason: `Eligible for interviews within ${tierDisplay} (CGPA cutoff ≤ ${tierMaxCutoff}).`,
    eligibleForSummary: `Interviews with CGPA cutoff ≤ ${tierMaxCutoff}`,
    notEligibleForSummary: `Interviews requiring > ${tierMaxCutoff} CGPA`
  };
}

const INITIAL_ATTENDANCE_RAW: Array<Omit<StudentAttendanceItem, "eligibility" | "eligibilityTier" | "tierMaxCutoff" | "eligibilityReason" | "eligibleForSummary" | "notEligibleForSummary">> = [
  {
    studentId: "std-000",
    studentName: "Arup Lenka",
    regNo: "NIT2025CSE001",
    email: "arup.lenka@campus.edu",
    branch: "Computer Science & Engineering",
    cgpa: 8.4,
    academicAttendedSessions: 82,
    academicTotalSessions: 100,
    academicAttendance: 82.0,
    trainingAttendedSessions: 39,
    trainingTotalSessions: 50,
    trainingAttendance: 78.0,
    totalAttendedSessions: 121,
    totalScheduledSessions: 150,
    totalAttendance: 80.7,
    lastUpdated: "Today, 10:32 AM",
    source: "DEMO",
    status: "Normal",
    recentSessions: [
      { date: "08 Oct 2026", type: "Academic", subject: "Compiler Design Lab", attended: true },
      { date: "07 Oct 2026", type: "Training", subject: "TCS Advanced Coding Bootcamp", attended: true },
      { date: "06 Oct 2026", type: "Academic", subject: "Distributed Systems Lecture", attended: true },
      { date: "05 Oct 2026", type: "Training", subject: "Aptitude Fast Track Session", attended: true }
    ]
  },
  {
    studentId: "std-001",
    studentName: "Priyanshu Dash",
    regNo: "2101297042",
    email: "priyanshu.d@campus.edu",
    branch: "Computer Science & Engineering",
    cgpa: 8.42,
    academicAttendedSessions: 84,
    academicTotalSessions: 100,
    academicAttendance: 84.0,
    trainingAttendedSessions: 38,
    trainingTotalSessions: 50,
    trainingAttendance: 76.0,
    totalAttendedSessions: 122,
    totalScheduledSessions: 150,
    totalAttendance: 81.3,
    lastUpdated: "Today, 09:45 AM",
    source: "DEMO",
    status: "Normal",
    recentSessions: [
      { date: "08 Oct 2026", type: "Academic", subject: "Network Security", attended: true },
      { date: "07 Oct 2026", type: "Training", subject: "Mock Technical Defense", attended: true }
    ]
  },
  {
    studentId: "std-003",
    studentName: "Sneha Mohanty",
    regNo: "2101297089",
    email: "sneha.m@campus.edu",
    branch: "Information Technology",
    cgpa: 9.12,
    academicAttendedSessions: 92,
    academicTotalSessions: 100,
    academicAttendance: 92.0,
    trainingAttendedSessions: 46,
    trainingTotalSessions: 50,
    trainingAttendance: 92.0,
    totalAttendedSessions: 138,
    totalScheduledSessions: 150,
    totalAttendance: 92.0,
    lastUpdated: "Today, 10:15 AM",
    source: "DEMO",
    status: "Normal",
    recentSessions: [
      { date: "08 Oct 2026", type: "Academic", subject: "Cloud Computing Lab", attended: true },
      { date: "07 Oct 2026", type: "Training", subject: "System Design Masterclass", attended: true }
    ]
  },
  {
    studentId: "std-002",
    studentName: "Aarav Sharma",
    regNo: "2101297011",
    email: "aarav.s@campus.edu",
    branch: "Computer Science & Engineering",
    cgpa: 7.85,
    academicAttendedSessions: 76,
    academicTotalSessions: 100,
    academicAttendance: 76.0,
    trainingAttendedSessions: 38,
    trainingTotalSessions: 50,
    trainingAttendance: 76.0,
    totalAttendedSessions: 114,
    totalScheduledSessions: 150,
    totalAttendance: 76.0,
    lastUpdated: "Today, 09:10 AM",
    source: "DEMO",
    status: "Normal",
    recentSessions: [
      { date: "08 Oct 2026", type: "Academic", subject: "Web Technologies", attended: true },
      { date: "07 Oct 2026", type: "Training", subject: "DSA Problem Solving", attended: false }
    ]
  },
  {
    studentId: "std-005",
    studentName: "Ananya Patnaik",
    regNo: "2101297023",
    email: "ananya.p@campus.edu",
    branch: "Computer Science & Engineering",
    cgpa: 8.65,
    academicAttendedSessions: 75,
    academicTotalSessions: 100,
    academicAttendance: 75.0,
    trainingAttendedSessions: 37,
    trainingTotalSessions: 50,
    trainingAttendance: 74.0,
    totalAttendedSessions: 112,
    totalScheduledSessions: 150,
    totalAttendance: 74.7,
    lastUpdated: "Today, 08:30 AM",
    source: "DEMO",
    status: "At Risk",
    recentSessions: [
      { date: "08 Oct 2026", type: "Academic", subject: "Software Engineering", attended: false },
      { date: "07 Oct 2026", type: "Training", subject: "Java Microservices", attended: true }
    ]
  },
  {
    studentId: "std-004",
    studentName: "Rohan Verma",
    regNo: "2101297055",
    email: "rohan.v@campus.edu",
    branch: "Electronics & Communication",
    cgpa: 6.94,
    academicAttendedSessions: 72,
    academicTotalSessions: 100,
    academicAttendance: 72.0,
    trainingAttendedSessions: 34,
    trainingTotalSessions: 50,
    trainingAttendance: 68.0,
    totalAttendedSessions: 106,
    totalScheduledSessions: 150,
    totalAttendance: 70.7,
    lastUpdated: "Today, 08:45 AM",
    source: "DEMO",
    status: "Critical",
    recentSessions: [
      { date: "08 Oct 2026", type: "Academic", subject: "VLSI Circuit Design", attended: false },
      { date: "07 Oct 2026", type: "Training", subject: "Core Electronics Placement Prep", attended: false }
    ]
  },
  {
    studentId: "std-006",
    studentName: "Debashis Nayak",
    regNo: "2101297034",
    email: "debashis.n@campus.edu",
    branch: "Electrical & Electronics",
    cgpa: 6.55,
    academicAttendedSessions: 75,
    academicTotalSessions: 100,
    academicAttendance: 75.0,
    trainingAttendedSessions: 37,
    trainingTotalSessions: 50,
    trainingAttendance: 74.0,
    totalAttendedSessions: 112,
    totalScheduledSessions: 150,
    totalAttendance: 74.7,
    lastUpdated: "Today, 09:20 AM",
    source: "DEMO",
    status: "Critical",
    recentSessions: [
      { date: "08 Oct 2026", type: "Academic", subject: "Power Systems II", attended: false },
      { date: "07 Oct 2026", type: "Training", subject: "C++ Programming Refresher", attended: true }
    ]
  },
  {
    studentId: "std-007",
    studentName: "Pooja Mohapatra",
    regNo: "2101297062",
    email: "pooja.m@campus.edu",
    branch: "Computer Science & Engineering",
    cgpa: 7.60,
    academicAttendedSessions: 75,
    academicTotalSessions: 100,
    academicAttendance: 75.0,
    trainingAttendedSessions: 30,
    trainingTotalSessions: 40,
    trainingAttendance: 75.0,
    totalAttendedSessions: 105,
    totalScheduledSessions: 140,
    totalAttendance: 75.0, // Exactly 75.0% -> NOT ELIGIBLE under rule > 75%
    lastUpdated: "Today, 10:05 AM",
    source: "DEMO",
    status: "At Risk",
    recentSessions: [
      { date: "08 Oct 2026", type: "Academic", subject: "Operating Systems", attended: true },
      { date: "07 Oct 2026", type: "Training", subject: "Aptitude Quantitative Analysis", attended: false }
    ]
  },
  {
    studentId: "std-008",
    studentName: "Vikram Mishra",
    regNo: "2101297077",
    email: "vikram.m@campus.edu",
    branch: "Information Technology",
    cgpa: 7.30,
    academicAttendedSessions: 86,
    academicTotalSessions: 100,
    academicAttendance: 86.0,
    trainingAttendedSessions: 43,
    trainingTotalSessions: 50,
    trainingAttendance: 86.0,
    totalAttendedSessions: 129,
    totalScheduledSessions: 150,
    totalAttendance: 86.0,
    lastUpdated: "Today, 11:00 AM",
    source: "DEMO",
    status: "Normal",
    recentSessions: [
      { date: "08 Oct 2026", type: "Academic", subject: "Data Structures Lab", attended: true },
      { date: "07 Oct 2026", type: "Training", subject: "Verbal Ability Workshop", attended: true }
    ]
  },
  {
    studentId: "std-009",
    studentName: "Tanmay Sahoo",
    regNo: "2101297095",
    email: "tanmay.s@campus.edu",
    branch: "Computer Science & Engineering",
    cgpa: 9.50, // High CGPA (9.5) but Attendance <= 75% -> MUST be Not Eligible
    academicAttendedSessions: 74,
    academicTotalSessions: 100,
    academicAttendance: 74.0,
    trainingAttendedSessions: 37,
    trainingTotalSessions: 50,
    trainingAttendance: 74.0,
    totalAttendedSessions: 111,
    totalScheduledSessions: 150,
    totalAttendance: 74.0,
    lastUpdated: "Today, 10:45 AM",
    source: "DEMO",
    status: "At Risk",
    recentSessions: [
      { date: "08 Oct 2026", type: "Academic", subject: "Machine Learning Seminar", attended: true },
      { date: "07 Oct 2026", type: "Training", subject: "Competitive Coding Contest", attended: false }
    ]
  }
];

function buildStudentItem(
  raw: typeof INITIAL_ATTENDANCE_RAW[0]
): StudentAttendanceItem {
  const evalResult = calculateInterviewEligibility({
    cgpa: raw.cgpa,
    totalAttendance: raw.totalAttendance
  });

  return {
    ...raw,
    eligibility: evalResult.status,
    eligibilityTier: evalResult.tierDisplay,
    tierMaxCutoff: evalResult.tierMaxCutoff,
    eligibilityReason: evalResult.reason,
    eligibleForSummary: evalResult.eligibleForSummary,
    notEligibleForSummary: evalResult.notEligibleForSummary
  };
}

const INITIAL_ATTENDANCE: StudentAttendanceItem[] = INITIAL_ATTENDANCE_RAW.map(buildStudentItem);

class AttendanceService {
  private records: StudentAttendanceItem[] = [];
  private listeners: Array<(records: StudentAttendanceItem[]) => void> = [];
  private lastSyncTime: Date = new Date();

  constructor() {
    this.initData();
  }

  private initData() {
    try {
      if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
        const stored = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as StudentAttendanceItem[];
          // Validate that parsed items have cgpa and eligibilityTier
          if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0].cgpa === "number") {
            this.records = parsed;
            return;
          }
        }
      }
    } catch (e) {
      console.warn("Failed to read attendance storage", e);
    }
    this.records = INITIAL_ATTENDANCE;
  }

  private save() {
    try {
      if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
        localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(this.records));
      }
    } catch (e) {
      console.warn("Failed to persist attendance", e);
    }
    this.notify();
  }

  public subscribe(listener: (records: StudentAttendanceItem[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.records));
  }

  public getStudentsAttendance(): StudentAttendanceItem[] {
    return [...this.records];
  }

  public getStudentAttendance(studentId: string): StudentAttendanceItem | undefined {
    return this.records.find((r) => r.studentId === studentId);
  }

  public getAttendanceKPIs(): AttendanceKPIs {
    const totalStudents = this.records.length;
    const attendanceEligibleCount = this.records.filter((r) => r.totalAttendance > MIN_TOTAL_ATTENDANCE).length;
    const cgpaEligibleCount = this.records.filter((r) => r.cgpa >= CGPA_THRESHOLDS.minimum).length;
    // Interview Eligible = Satisfies BOTH Attendance > 75% and CGPA >= 7.0 (Eligible or Restricted)
    const interviewEligibleCount = this.records.filter(
      (r) => r.totalAttendance > MIN_TOTAL_ATTENDANCE && r.cgpa >= CGPA_THRESHOLDS.minimum
    ).length;
    // Not Eligible = Fails attendance or fails CGPA
    const notEligibleCount = this.records.filter(
      (r) => r.totalAttendance <= MIN_TOTAL_ATTENDANCE || r.cgpa < CGPA_THRESHOLDS.minimum
    ).length;
    const updatesTodayCount = this.records.length;

    return {
      totalStudents,
      attendanceEligibleCount,
      cgpaEligibleCount,
      interviewEligibleCount,
      notEligibleCount,
      updatesTodayCount
    };
  }

  /**
   * Strictly evaluates the attendance percentage rule:
   * Total Attendance = totalAttended / totalScheduled * 100
   * Is eligible only if > 75.0%
   */
  public evaluateAttendancePercentage(totalAttended: number, totalScheduled: number): {
    totalPercentage: number;
    isEligible: boolean;
    reason?: string;
  } {
    if (totalScheduled === 0) {
      return { totalPercentage: 0, isEligible: false, reason: "No sessions recorded" };
    }
    const raw = (totalAttended / totalScheduled) * 100;
    const rounded = Math.round(raw * 10) / 10;
    const isEligible = rounded > MIN_TOTAL_ATTENDANCE;
    return {
      totalPercentage: rounded,
      isEligible,
      reason: isEligible
        ? undefined
        : rounded === 75.0
        ? "Total attendance (75.0%) does not exceed the mandatory >75% cutoff"
        : `Total attendance (${rounded}%) is below the mandatory 75% threshold`
    };
  }

  public getLastSyncTime(): Date {
    return this.lastSyncTime;
  }

  /**
   * Simulates an automatic live sync from university ERP/attendance gateway.
   * Demonstrates the requirement (§22):
   * Attendance updated -> Total Attendance recalculated -> Attendance Eligibility recalculated -> Interview Eligibility recalculated -> UI updated
   */
  public simulateLiveUpdate(): { updatedCount: number; message: string } {
    this.lastSyncTime = new Date();

    // Simulate updating Ananya's attendance (+2 training sessions attended) so attendance crosses 75%
    this.records = this.records.map((r) => {
      if (r.studentId === "std-005") {
        const newTrainingAttended = r.trainingAttendedSessions + 2;
        const newTotalAttended = r.academicAttendedSessions + newTrainingAttended;
        const newTotalSched = r.totalScheduledSessions;
        const attEval = this.evaluateAttendancePercentage(newTotalAttended, newTotalSched);

        // Recalculate full interview eligibility
        const eligibilityEval = calculateInterviewEligibility({
          cgpa: r.cgpa,
          totalAttendance: attEval.totalPercentage
        });

        return {
          ...r,
          trainingAttendedSessions: newTrainingAttended,
          trainingAttendance: Math.round((newTrainingAttended / r.trainingTotalSessions) * 1000) / 10,
          totalAttendedSessions: newTotalAttended,
          totalAttendance: attEval.totalPercentage,
          eligibility: eligibilityEval.status,
          eligibilityTier: eligibilityEval.tierDisplay,
          tierMaxCutoff: eligibilityEval.tierMaxCutoff,
          eligibilityReason: eligibilityEval.reason,
          eligibleForSummary: eligibilityEval.eligibleForSummary,
          notEligibleForSummary: eligibilityEval.notEligibleForSummary,
          status: eligibilityEval.status === "Not Eligible" ? "At Risk" : "Normal",
          lastUpdated: "Updated just now",
          recentSessions: [
            { date: "09 Oct 2026", type: "Training", subject: "Verified Attendance Recovery Session", attended: true },
            ...(r.recentSessions || [])
          ]
        };
      }
      return {
        ...r,
        lastUpdated: "Updated just now"
      };
    });

    this.save();
    return {
      updatedCount: this.records.length,
      message: "Synced 10 attendance records from University ERP gateway."
    };
  }
}

export const attendanceService = new AttendanceService();
