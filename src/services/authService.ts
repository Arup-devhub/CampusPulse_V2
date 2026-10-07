import { Role } from "../types";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  regNo?: string;
  branch?: string;
  semester?: number;
  cgpa?: number;
  backlogs?: number;
  githubUrl?: string;
  linkedinUrl?: string;
  companyName?: string;
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

const STORAGE_KEY = "campuspulse_auth_session_v2";

// Default seed accounts for institutional roles
export const DEFAULT_USERS: Record<Role, UserProfile> = {
  Student: {
    id: "usr-std-001",
    name: "Arup Lenka",
    email: "arup.lenka@campus.edu",
    role: "Student",
    regNo: "2101297042",
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
    department: "University Placement & Training Directorate",
    avatarInitials: "AL"
  },
  Recruiter: {
    id: "usr-rec-001",
    name: "Pooja Nair",
    email: "pooja.nair@tcs.com",
    role: "Recruiter",
    companyName: "Tata Consultancy Services (TCS)",
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
    // Basic verification
    if (!params.email || !params.password) {
      return { success: false, error: "Please enter both email/username and password." };
    }
    if (params.password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." };
    }

    // Determine user profile
    const template = DEFAULT_USERS[params.role];
    const name = params.name && params.name.trim() ? params.name.trim() : template.name;
    const initials = name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || template.avatarInitials;

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
   * Aligned with POST /api/v1/auth/register
   */
  public async registerStudent(data: {
    name: string;
    regNo: string;
    email: string;
    password: string;
    githubUrl: string;
    linkedinUrl: string;
    branch?: string;
    cgpa?: number;
    phone?: string;
  }): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
    if (!data.name || !data.regNo || !data.email || !data.password || !data.githubUrl || !data.linkedinUrl) {
      return {
        success: false,
        error: "Please complete all mandatory fields: Name, Reg No, College Email, Password, GitHub and LinkedIn."
      };
    }

    if (!data.email.includes("@")) {
      return { success: false, error: "Please provide a valid institutional email address." };
    }

    const initials = data.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const user: UserProfile = {
      id: `usr-std-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: "Student",
      regNo: data.regNo,
      branch: data.branch || "Computer Science & Engineering",
      semester: 7,
      cgpa: data.cgpa ? Number(data.cgpa) : 8.0,
      backlogs: 0,
      githubUrl: data.githubUrl,
      linkedinUrl: data.linkedinUrl,
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
