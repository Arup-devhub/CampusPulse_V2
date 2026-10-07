import { Role } from "../types";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  regNo?: string;
  college?: string;
  degree?: string;
  branch?: string;
  semester?: number;
  cgpa?: number;
  backlogs?: number;
  githubUrl?: string;
  linkedinUrl?: string;
  companyName?: string;
  companyWebsite?: string;
  designation?: string;
  department?: string;
  phone?: string;
  avatarInitials: string;
}

export interface AuthSession {
  isAuthenticated: boolean;
  user: UserProfile;
  accessToken: string;
  refreshToken?: string;
}

export interface StudentRegistrationData {
  name: string;
  regNo: string;
  email: string;
  password: string;
  confirmPassword?: string;
  githubUrl: string;
  linkedinUrl: string;
  college?: string;
  degree?: string;
  branch?: string;
  semester?: number;
  cgpa?: number;
  phone?: string;
}

export interface PlacementAdminRegistrationData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  college: string;
  designation?: string;
  department?: string;
  phone?: string;
}

export interface RecruiterRegistrationData {
  name: string;
  email: string;
  companyName: string;
  password: string;
  confirmPassword?: string;
  designation?: string;
  companyWebsite?: string;
  phone?: string;
}

const STORAGE_KEY = "campuspulse_auth_session_v2";

// Default seed accounts for institutional roles
export const DEFAULT_USERS: Record<Role, UserProfile> = {
  Student: {
    id: "usr-std-001",
    name: "Arup Lenka",
    email: "arup.lenka@campus.edu",
    role: "Student",
    regNo: "2101297042",
    college: "National Institute of Technology",
    degree: "B.Tech",
    branch: "Computer Science & Engineering",
    semester: 7,
    cgpa: 8.42,
    backlogs: 0,
    githubUrl: "https://github.com/aruplenka",
    linkedinUrl: "https://linkedin.com/in/aruplenka",
    avatarInitials: "AL"
  },
  "Placement Admin": {
    id: "usr-adm-001",
    name: "Arup Lenka",
    email: "officer@campuspulse.edu",
    role: "Placement Admin",
    college: "National Institute of Technology",
    designation: "Training & Placement Officer",
    department: "University Placement & Training Directorate",
    avatarInitials: "AL"
  },
  Recruiter: {
    id: "usr-rec-001",
    name: "Pooja Nair",
    email: "pooja.nair@tcs.com",
    role: "Recruiter",
    companyName: "Tata Consultancy Services (TCS)",
    designation: "Lead Campus Recruiter",
    department: "Campus Talent Acquisition",
    avatarInitials: "PN"
  }
};

class AuthService {
  private currentSession: AuthSession | null = null;
  private listeners: Array<(session: AuthSession | null) => void> = [];

  constructor() {
    this.initSession();
  }

  private initSession() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AuthSession;
        if (parsed && parsed.isAuthenticated && parsed.user) {
          this.currentSession = parsed;
          return;
        }
      }
    } catch (e) {
      console.warn("Failed to read auth session from storage", e);
    }
    // Default: Start unauthenticated so user sees the login workflow
    this.currentSession = null;
  }

  public getSession(): AuthSession | null {
    return this.currentSession;
  }

  public getCurrentUser(): UserProfile | null {
    return this.currentSession?.user || null;
  }

  public isAuthenticated(): boolean {
    return !!this.currentSession?.isAuthenticated;
  }

  public subscribe(listener: (session: AuthSession | null) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.currentSession));
  }

  private getInitials(name: string, fallback: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0 || !parts[0]) return fallback;
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  /**
   * Aligned with POST /api/v1/auth/login
   */
  public async login(params: {
    email: string;
    password: string;
    role: Role;
    companyName?: string;
    name?: string;
  }): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
    if (!params.email || !params.password) {
      return { success: false, error: "Please enter both email/username and password." };
    }
    if (params.password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." };
    }

    const template = DEFAULT_USERS[params.role];
    const name = params.name && params.name.trim() ? params.name.trim() : template.name;
    const initials = this.getInitials(name, template.avatarInitials);

    const user: UserProfile = {
      ...template,
      id: `usr-${Date.now()}`,
      name,
      email: params.email,
      role: params.role,
      avatarInitials: initials,
      companyName: params.role === "Recruiter" ? (params.companyName || template.companyName) : undefined
    };

    const session: AuthSession = {
      isAuthenticated: true,
      user,
      accessToken: `cp_jwt_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      refreshToken: `cp_ref_${Date.now()}_${Math.random().toString(36).substring(2)}`
    };

    this.currentSession = session;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.warn("Failed to persist auth session", e);
    }
    this.notify();

    return { success: true, session };
  }

  /**
   * Aligned with POST /api/v1/auth/register (Role: STUDENT)
   */
  public async registerStudent(data: StudentRegistrationData): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
    if (!data.name || !data.name.trim()) {
      return { success: false, error: "Full Name is required." };
    }
    if (!data.regNo || !data.regNo.trim()) {
      return { success: false, error: "Registration Number is required." };
    }
    if (!data.email || !data.email.trim() || !data.email.includes("@")) {
      return { success: false, error: "A valid institutional email address is required." };
    }
    if (!data.password || data.password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." };
    }
    if (data.confirmPassword && data.password !== data.confirmPassword) {
      return { success: false, error: "Password confirmation does not match password." };
    }
    if (!data.githubUrl || !data.githubUrl.trim()) {
      return { success: false, error: "GitHub Profile URL is required for verified technical evaluation." };
    }
    if (!data.linkedinUrl || !data.linkedinUrl.trim()) {
      return { success: false, error: "LinkedIn Profile URL is required for placement verification." };
    }

    if (data.cgpa !== undefined && (isNaN(Number(data.cgpa)) || Number(data.cgpa) < 0 || Number(data.cgpa) > 10)) {
      return { success: false, error: "CGPA must be a valid number between 0.00 and 10.00." };
    }

    const initials = this.getInitials(data.name, "ST");

    const user: UserProfile = {
      id: `usr-std-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim(),
      role: "Student",
      regNo: data.regNo.trim(),
      college: data.college || "University Institute of Technology",
      degree: data.degree || "B.Tech",
      branch: data.branch || "Computer Science & Engineering",
      semester: data.semester || 7,
      cgpa: data.cgpa ? Number(data.cgpa) : 8.0,
      backlogs: 0,
      githubUrl: data.githubUrl.trim(),
      linkedinUrl: data.linkedinUrl.trim(),
      phone: data.phone,
      avatarInitials: initials
    };

    const session: AuthSession = {
      isAuthenticated: true,
      user,
      accessToken: `cp_jwt_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      refreshToken: `cp_ref_${Date.now()}_${Math.random().toString(36).substring(2)}`
    };

    this.currentSession = session;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.warn("Failed to persist auth session", e);
    }
    this.notify();

    return { success: true, session };
  }

  /**
   * Aligned with POST /api/v1/auth/register (Role: PLACEMENT_ADMIN)
   */
  public async registerPlacementAdmin(data: PlacementAdminRegistrationData): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
    if (!data.name || !data.name.trim()) {
      return { success: false, error: "Full Name is required." };
    }
    if (!data.email || !data.email.trim() || !data.email.includes("@")) {
      return { success: false, error: "Official institutional email is required." };
    }
    if (!data.college || !data.college.trim()) {
      return { success: false, error: "College or Organization name is required." };
    }
    if (!data.password || data.password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." };
    }
    if (data.confirmPassword && data.password !== data.confirmPassword) {
      return { success: false, error: "Password confirmation does not match password." };
    }

    const initials = this.getInitials(data.name, "PO");

    const user: UserProfile = {
      id: `usr-adm-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim(),
      role: "Placement Admin",
      college: data.college.trim(),
      designation: data.designation || "Placement Officer",
      department: data.department || "Placement & Training Directorate",
      phone: data.phone,
      avatarInitials: initials
    };

    const session: AuthSession = {
      isAuthenticated: true,
      user,
      accessToken: `cp_jwt_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      refreshToken: `cp_ref_${Date.now()}_${Math.random().toString(36).substring(2)}`
    };

    this.currentSession = session;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.warn("Failed to persist auth session", e);
    }
    this.notify();

    return { success: true, session };
  }

  /**
   * Aligned with POST /api/v1/auth/register (Role: RECRUITER)
   */
  public async registerRecruiter(data: RecruiterRegistrationData): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
    if (!data.name || !data.name.trim()) {
      return { success: false, error: "Full Name is required." };
    }
    if (!data.email || !data.email.trim() || !data.email.includes("@")) {
      return { success: false, error: "Work corporate email is required." };
    }
    if (!data.companyName || !data.companyName.trim()) {
      return { success: false, error: "Company Name is required." };
    }
    if (!data.password || data.password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." };
    }
    if (data.confirmPassword && data.password !== data.confirmPassword) {
      return { success: false, error: "Password confirmation does not match password." };
    }

    const initials = this.getInitials(data.name, "RC");

    const user: UserProfile = {
      id: `usr-rec-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim(),
      role: "Recruiter",
      companyName: data.companyName.trim(),
      companyWebsite: data.companyWebsite?.trim(),
      designation: data.designation || "Campus Talent Acquisition Lead",
      department: "University Relations & Hiring",
      phone: data.phone,
      avatarInitials: initials
    };

    const session: AuthSession = {
      isAuthenticated: true,
      user,
      accessToken: `cp_jwt_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      refreshToken: `cp_ref_${Date.now()}_${Math.random().toString(36).substring(2)}`
    };

    this.currentSession = session;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.warn("Failed to persist auth session", e);
    }
    this.notify();

    return { success: true, session };
  }

  /**
   * Aligned with POST /api/v1/auth/logout
   */
  public async logout(): Promise<void> {
    this.currentSession = null;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Failed to remove auth session", e);
    }
    this.notify();
  }

  public updateProfile(updates: Partial<UserProfile>): void {
    if (!this.currentSession) return;
    const updatedUser = { ...this.currentSession.user, ...updates };
    this.currentSession = { ...this.currentSession, user: updatedUser };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentSession));
    } catch (e) {
      console.warn("Failed to update auth session", e);
    }
    this.notify();
  }
}

export const authService = new AuthService();
