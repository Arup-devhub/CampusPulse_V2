import { WorkshopRequest, WorkshopRequestStatus } from "../types";

const WORKSHOP_REQ_STORAGE_KEY = "campuspulse_workshop_requests_v2";

const INITIAL_REQUESTS: WorkshopRequest[] = [
  {
    id: "wr-001",
    studentId: "std-000",
    studentName: "Arup Lenka",
    studentRegNo: "NIT2025CSE001",
    studentBranch: "Computer Science & Engineering",
    skill: "DSA & DP",
    currentScore: 54,
    requiredScore: 75,
    priority: "High",
    linkedDrive: "TCS Digital",
    reason: "Automatically generated from the detected skill gap in Data Structures & Algorithms",
    additionalMessage: "Need a hands-on review on Dynamic Programming and Graphs prior to TCS Digital Stage 2 coding round.",
    requestedOn: "09 Oct 2026",
    status: "Pending"
  },
  {
    id: "wr-002",
    studentId: "std-001",
    studentName: "Priyanshu Dash",
    studentRegNo: "2101297042",
    studentBranch: "Computer Science & Engineering",
    skill: "C++ OOP & Memory Management",
    currentScore: 57,
    requiredScore: 75,
    priority: "High",
    linkedDrive: "TCS Digital",
    reason: "Pointers and concurrency deficits detected in screening assessment",
    additionalMessage: "Requesting practical lab on smart pointers and memory leaks.",
    requestedOn: "08 Oct 2026",
    status: "Approved"
  },
  {
    id: "wr-003",
    studentId: "std-004",
    studentName: "Rohan Verma",
    studentRegNo: "2101297055",
    studentBranch: "Electronics & Communication",
    skill: "SQL Complex Joins & Indexing",
    currentScore: 64,
    requiredScore: 70,
    priority: "Medium",
    linkedDrive: "Infosys",
    reason: "Query optimization deficit below Infosys Specialist Programmer cutoff",
    requestedOn: "07 Oct 2026",
    status: "Pending"
  }
];

class WorkshopRequestService {
  private requests: WorkshopRequest[] = [];
  private listeners: Array<(reqs: WorkshopRequest[]) => void> = [];

  constructor() {
    this.initData();
  }

  private initData() {
    try {
      const stored = localStorage.getItem(WORKSHOP_REQ_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as WorkshopRequest[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.requests = parsed;
          return;
        }
      }
    } catch (e) {
      console.warn("Failed to read workshop requests", e);
    }
    this.requests = INITIAL_REQUESTS;
  }

  private save() {
    try {
      localStorage.setItem(WORKSHOP_REQ_STORAGE_KEY, JSON.stringify(this.requests));
    } catch (e) {
      console.warn("Failed to persist workshop requests", e);
    }
    this.notify();
  }

  public subscribe(listener: (reqs: WorkshopRequest[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.requests));
  }

  public getAllRequests(): WorkshopRequest[] {
    return [...this.requests];
  }

  public getRequestsForStudent(studentIdOrName?: string): WorkshopRequest[] {
    if (!studentIdOrName) return [...this.requests];
    const q = studentIdOrName.toLowerCase();
    return this.requests.filter(
      (r) =>
        r.studentId.toLowerCase() === q ||
        r.studentName.toLowerCase().includes(q)
    );
  }

  public submitRequest(
    req: Omit<WorkshopRequest, "id" | "requestedOn" | "status">
  ): WorkshopRequest {
    const newReq: WorkshopRequest = {
      ...req,
      id: `wr-${Date.now()}`,
      requestedOn: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
      status: "Pending"
    };
    this.requests.unshift(newReq);
    this.save();
    return newReq;
  }

  public updateRequestStatus(id: string, status: WorkshopRequestStatus): boolean {
    const index = this.requests.findIndex((r) => r.id === id);
    if (index === -1) return false;
    this.requests[index] = { ...this.requests[index], status };
    this.save();
    return true;
  }
}

export const workshopRequestService = new WorkshopRequestService();
