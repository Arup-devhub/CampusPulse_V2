import { StudentAttendanceItem } from "../types";

const ATTENDANCE_STORAGE_KEY = "campuspulse_attendance_v2";

export interface AttendanceKPIs {
  totalStudents: number;
  eligibleCount: number;
  belowThresholdCount: number;
  updatesTodayCount: number;
}

const INITIAL_ATTENDANCE: StudentAttendanceItem[] = [
  {
    studentId: "std-000",
    studentName: "Arup Lenka",
    regNo: "NIT2025CSE001",
    email: "arup.lenka@campus.edu",
    branch: "Computer Science & Engineering",
    academicAttendedSessions: 82,
    academicTotalSessions: 100,
    academicAttendance: 82.0,
    trainingAttendedSessions: 39,
    trainingTotalSessions: 50,
    trainingAttendance: 78.0,
    totalAttendedSessions: 121,
    totalScheduledSessions: 150,
    totalAttendance: 80.7,
    eligibility: "Eligible",
    lastUpdated: "Today, 10:32 AM",
    source: "COLLEGE_INTEGRATION",
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
    academicAttendedSessions: 84,
    academicTotalSessions: 100,
    academicAttendance: 84.0,
    trainingAttendedSessions: 38,
    trainingTotalSessions: 50,
    trainingAttendance: 76.0,
    totalAttendedSessions: 122,
    totalScheduledSessions: 150,
    totalAttendance: 81.3,
    eligibility: "Eligible",
    lastUpdated: "Today, 09:45 AM",
    source: "COLLEGE_INTEGRATION",
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
    academicAttendedSessions: 92,
    academicTotalSessions: 100,
    academicAttendance: 92.0,
    trainingAttendedSessions: 46,
    trainingTotalSessions: 50,
    trainingAttendance: 92.0,
    totalAttendedSessions: 138,
    totalScheduledSessions: 150,
    totalAttendance: 92.0,
    eligibility: "Eligible",
    lastUpdated: "Today, 10:15 AM",
    source: "COLLEGE_INTEGRATION",
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
    academicAttendedSessions: 76,
    academicTotalSessions: 100,
    academicAttendance: 76.0,
    trainingAttendedSessions: 38,
    trainingTotalSessions: 50,
    trainingAttendance: 76.0,
    totalAttendedSessions: 114,
    totalScheduledSessions: 150,
    totalAttendance: 76.0,
    eligibility: "Eligible",
    lastUpdated: "Today, 09:10 AM",
    source: "COLLEGE_INTEGRATION",
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
    academicAttendedSessions: 75,
    academicTotalSessions: 100,
    academicAttendance: 75.0,
    trainingAttendedSessions: 37,
    trainingTotalSessions: 50,
    trainingAttendance: 74.0,
    totalAttendedSessions: 112,
    totalScheduledSessions: 150,
    totalAttendance: 74.7,
    eligibility: "Not Eligible",
    eligibilityReason: "Total attendance (74.7%) is below the mandatory 75% threshold",
    lastUpdated: "Today, 08:30 AM",
    source: "COLLEGE_INTEGRATION",
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
    academicAttendedSessions: 72,
    academicTotalSessions: 100,
    academicAttendance: 72.0,
    trainingAttendedSessions: 34,
    trainingTotalSessions: 50,
    trainingAttendance: 68.0,
    totalAttendedSessions: 106,
    totalScheduledSessions: 150,
    totalAttendance: 70.7,
    eligibility: "Not Eligible",
    eligibilityReason: "Attendance below 75% threshold (70.7% total)",
    lastUpdated: "Today, 08:45 AM",
    source: "COLLEGE_INTEGRATION",
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
    academicAttendedSessions: 75,
    academicTotalSessions: 100,
    academicAttendance: 75.0,
    trainingAttendedSessions: 37,
    trainingTotalSessions: 50,
    trainingAttendance: 74.0,
    totalAttendedSessions: 112,
    totalScheduledSessions: 150,
    totalAttendance: 74.7,
    eligibility: "Not Eligible",
    eligibilityReason: "Total attendance (74.7%) below 75% cutoff",
    lastUpdated: "Today, 09:20 AM",
    source: "COLLEGE_INTEGRATION",
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
    academicAttendedSessions: 75,
    academicTotalSessions: 100,
    academicAttendance: 75.0,
    trainingAttendedSessions: 30,
    trainingTotalSessions: 40,
    trainingAttendance: 75.0,
    totalAttendedSessions: 105,
    totalScheduledSessions: 140,
    totalAttendance: 75.0, // Exactly 75% -> MUST BE NOT ELIGIBLE under rule > 75%
    eligibility: "Not Eligible",
    eligibilityReason: "Total attendance (75.0%) does not exceed the mandatory >75% threshold",
    lastUpdated: "Today, 10:05 AM",
    source: "COLLEGE_INTEGRATION",
    status: "At Risk",
    recentSessions: [
      { date: "08 Oct 2026", type: "Academic", subject: "Operating Systems", attended: true },
      { date: "07 Oct 2026", type: "Training", subject: "Aptitude Quantitative Analysis", attended: false }
    ]
  }
];

class AttendanceService {
  private records: StudentAttendanceItem[] = [];
  private listeners: Array<(records: StudentAttendanceItem[]) => void> = [];
  private lastSyncTime: Date = new Date();

  constructor() {
    this.initData();
  }

  private initData() {
    try {
      const stored = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StudentAttendanceItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.records = parsed;
          return;
        }
      }
    } catch (e) {
      console.warn("Failed to read attendance storage", e);
    }
    this.records = INITIAL_ATTENDANCE;
  }

  private save() {
    try {
      localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(this.records));
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
    const eligibleCount = this.records.filter((r) => r.eligibility === "Eligible").length;
    const belowThresholdCount = this.records.filter((r) => r.eligibility === "Not Eligible").length;
    const updatesTodayCount = this.records.length; // all records refreshed in current daily batch

    return {
      totalStudents,
      eligibleCount,
      belowThresholdCount,
      updatesTodayCount
    };
  }

  /**
   * Strictly evaluates the interview eligibility rule:
   * Total Attendance > 75%
   * (Total attended sessions / Total scheduled sessions > 0.75)
   */
  public evaluateEligibility(totalAttended: number, totalScheduled: number): {
    totalPercentage: number;
    isEligible: boolean;
    reason?: string;
  } {
    if (totalScheduled === 0) {
      return { totalPercentage: 0, isEligible: false, reason: "No sessions recorded" };
    }
    const raw = (totalAttended / totalScheduled) * 100;
    const rounded = Math.round(raw * 10) / 10;
    // Strict rule: MUST be strictly greater than 75%
    const isEligible = rounded > 75.0;
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
   * Simulates an automatic live sync from college ERP/attendance system.
   * Demonstrates the requirement:
   * Attendance updated -> Total attendance recalculated -> Eligibility recalculated -> UI updated
   */
  public simulateLiveUpdate(): { updatedCount: number; message: string } {
    this.lastSyncTime = new Date();
    // Simulate updating Ananya's attendance (+2 training sessions attended) to cross 75%
    this.records = this.records.map((r) => {
      if (r.studentId === "std-005") {
        const newTrainingAttended = r.trainingAttendedSessions + 2;
        const newTotalAttended = r.academicAttendedSessions + newTrainingAttended;
        const newTotalSched = r.totalScheduledSessions;
        const evaluation = this.evaluateEligibility(newTotalAttended, newTotalSched);

        return {
          ...r,
          trainingAttendedSessions: newTrainingAttended,
          trainingAttendance: Math.round((newTrainingAttended / r.trainingTotalSessions) * 1000) / 10,
          totalAttendedSessions: newTotalAttended,
          totalAttendance: evaluation.totalPercentage,
          eligibility: evaluation.isEligible ? "Eligible" : "Not Eligible",
          eligibilityReason: evaluation.reason,
          status: evaluation.isEligible ? "Normal" : "At Risk",
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
      message: "Synced 8 attendance records from University LMS/ERP gateway."
    };
  }
}

export const attendanceService = new AttendanceService();
