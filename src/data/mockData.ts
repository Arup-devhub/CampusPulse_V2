import {
  Student, Company, PlacementDrive, SkillGapItem,
  Recommendation, WorkshopCohort, AssessmentItem,
  AIInterviewSession, ProctoringEvent, NotificationItem
} from "../types";

export const initialStudents: Student[] = [
  {
    id: "std-001",
    name: "Priyanshu Dash",
    regNo: "2101297042",
    email: "priyanshu.d@campus.edu",
    branch: "Computer Science & Engineering",
    semester: 7,
    cgpa: 8.42,
    backlogs: 0,
    readiness: 74,
    risk: "Ready",
    topSkills: ["Python", "C++", "SQL", "Git"],
    placementStatus: "In Process",
    githubUrl: "https://github.com/priyanshu-dash",
    linkedinUrl: "https://linkedin.com/in/priyanshu-dash"
  },
  {
    id: "std-002",
    name: "Aarav Sharma",
    regNo: "2101297011",
    email: "aarav.s@campus.edu",
    branch: "Computer Science & Engineering",
    semester: 7,
    cgpa: 7.85,
    backlogs: 0,
    readiness: 61,
    risk: "Developing",
    topSkills: ["Java", "DSA", "HTML/CSS"],
    placementStatus: "In Process",
    githubUrl: "https://github.com/aarav-sharma",
    linkedinUrl: "https://linkedin.com/in/aarav-s"
  },
  {
    id: "std-003",
    name: "Sneha Mohanty",
    regNo: "2101297089",
    email: "sneha.m@campus.edu",
    branch: "Information Technology",
    semester: 7,
    cgpa: 9.12,
    backlogs: 0,
    readiness: 88,
    risk: "Ready",
    topSkills: ["Python", "DSA", "SQL", "Cloud Basics"],
    placementStatus: "Placed",
    githubUrl: "https://github.com/sneha-m",
    linkedinUrl: "https://linkedin.com/in/sneha-m"
  },
  {
    id: "std-004",
    name: "Rohan Verma",
    regNo: "2101297055",
    email: "rohan.v@campus.edu",
    branch: "Electronics & Communication",
    semester: 7,
    cgpa: 6.94,
    backlogs: 1,
    readiness: 52,
    risk: "At Risk",
    topSkills: ["C", "Embedded Systems", "Basic Python"],
    placementStatus: "Not Placed",
    githubUrl: "https://github.com/rohan-v",
    linkedinUrl: "https://linkedin.com/in/rohan-v"
  },
  {
    id: "std-005",
    name: "Ananya Patnaik",
    regNo: "2101297023",
    email: "ananya.p@campus.edu",
    branch: "Computer Science & Engineering",
    semester: 7,
    cgpa: 8.65,
    backlogs: 0,
    readiness: 79,
    risk: "Ready",
    topSkills: ["Java", "Spring Boot", "MySQL", "DSA"],
    placementStatus: "In Process",
    githubUrl: "https://github.com/ananya-p",
    linkedinUrl: "https://linkedin.com/in/ananya-p"
  },
  {
    id: "std-006",
    name: "Debashis Nayak",
    regNo: "2101297034",
    email: "debashis.n@campus.edu",
    branch: "Electrical & Electronics",
    semester: 7,
    cgpa: 6.55,
    backlogs: 0,
    readiness: 48,
    risk: "At Risk",
    topSkills: ["C++", "Circuit Analysis"],
    placementStatus: "Not Placed",
    githubUrl: "https://github.com/debashis-n",
    linkedinUrl: "https://linkedin.com/in/debashis-n"
  }
];

export const initialCompanies: Company[] = [
  {
    id: "cmp-001",
    name: "Tata Consultancy Services (TCS)",
    industry: "IT Services & Consulting",
    location: "Bhubaneswar / Pan-India",
    openRoles: 3,
    activeDrives: 1,
    avgPackage: "₹7.2 LPA (Digital) / ₹3.8 LPA (Ninja)",
    status: "Active Partner",
    recruiterContact: "campus.talent@tcs.com"
  },
  {
    id: "cmp-002",
    name: "Infosys",
    industry: "Information Technology",
    location: "Bangalore / Pune",
    openRoles: 2,
    activeDrives: 1,
    avgPackage: "₹6.5 LPA (Specialist) / ₹3.6 LPA (SE)",
    status: "Active Partner",
    recruiterContact: "freshers.hiring@infosys.com"
  },
  {
    id: "cmp-003",
    name: "Deloitte India",
    industry: "Management Consulting & Audit",
    location: "Hyderabad / Bangalore",
    openRoles: 2,
    activeDrives: 1,
    avgPackage: "₹8.0 LPA",
    status: "Visiting Soon",
    recruiterContact: "university.relations@deloitte.com"
  },
  {
    id: "cmp-004",
    name: "Wipro Technologies",
    industry: "IT & Business Services",
    location: "Kolkata / Bangalore",
    openRoles: 1,
    activeDrives: 0,
    avgPackage: "₹6.5 LPA (Turbo) / ₹3.5 LPA (Elite)",
    status: "Active Partner",
    recruiterContact: "campus.recruitment@wipro.com"
  },
  {
    id: "cmp-005",
    name: "Accenture",
    industry: "Strategy & Technology",
    location: "Gurgaon / Bangalore",
    openRoles: 2,
    activeDrives: 1,
    avgPackage: "₹7.9 LPA (Advanced ASE) / ₹4.5 LPA (ASE)",
    status: "Visiting Soon",
    recruiterContact: "india.campus@accenture.com"
  }
];

export const initialDrives: PlacementDrive[] = [
  {
    id: "drv-001",
    company: "TCS",
    role: "Digital Software Engineer",
    package: "₹7.2 LPA",
    deadline: "16 Oct 2026",
    driveDate: "18 Oct 2026",
    eligibility: "B.Tech CSE/IT/ECE with >= 7.0 CGPA & 0 Backlogs",
    minCgpa: 7.0,
    stages: ["Online Aptitude", "Coding Round", "Technical Interview", "HR Round"],
    candidatesCount: 1240,
    avgReadiness: 74,
    status: "Active"
  },
  {
    id: "drv-002",
    company: "Infosys",
    role: "Specialist Programmer & Systems Engineer",
    package: "₹6.5 LPA - ₹9.5 LPA",
    deadline: "20 Oct 2026",
    driveDate: "24 Oct 2026",
    eligibility: "All Engineering Branches >= 6.5 CGPA, Max 1 backlog",
    minCgpa: 6.5,
    stages: ["InfyTQ Assessment", "Coding Challenge", "Technical + HR Interview"],
    candidatesCount: 860,
    avgReadiness: 71,
    status: "Active"
  },
  {
    id: "drv-003",
    company: "Deloitte",
    role: "Technology Analyst",
    package: "₹8.0 LPA",
    deadline: "28 Oct 2026",
    driveDate: "02 Nov 2026",
    eligibility: "B.Tech CSE/IT >= 7.5 CGPA & 0 Backlogs",
    minCgpa: 7.5,
    stages: ["Versant English Test", "Aptitude & Technical MCQ", "Partner Interview"],
    candidatesCount: 410,
    avgReadiness: 68,
    status: "Upcoming"
  },
  {
    id: "drv-004",
    company: "Accenture",
    role: "Advanced Associate Software Engineer",
    package: "₹7.9 LPA",
    deadline: "05 Nov 2026",
    driveDate: "10 Nov 2026",
    eligibility: "B.Tech (All Branches) >= 7.0 CGPA",
    minCgpa: 7.0,
    stages: ["Cognitive & Technical Assessment", "Coding Assessment", "Communication Test"],
    candidatesCount: 920,
    avgReadiness: 79,
    status: "Upcoming"
  }
];

export const initialSkillGaps: SkillGapItem[] = [
  {
    skill: "Data Structures & Algorithms",
    required: "Advanced (Trees, Graphs, DP)",
    studentLevel: "Basic (Arrays, Strings)",
    score: 55,
    requiredScore: 75,
    gap: -20,
    priority: "Critical",
    studentsAffected: 50,
    linkedCompany: "TCS",
    action: "Enroll in Bootcamp"
  },
  {
    skill: "C++ Object-Oriented Programming",
    required: "Intermediate (Memory, STL, OOP)",
    studentLevel: "Basic (Syntax, Loops)",
    score: 58,
    requiredScore: 75,
    gap: -17,
    priority: "High",
    studentsAffected: 37,
    linkedCompany: "TCS",
    action: "Practice Problems"
  },
  {
    skill: "SQL & Relational Databases",
    required: "Intermediate (Joins, Indexing, Subqueries)",
    studentLevel: "Basic (CRUD, Simple Select)",
    score: 62,
    requiredScore: 70,
    gap: -8,
    priority: "Medium",
    studentsAffected: 18,
    linkedCompany: "Infosys",
    action: "Complete Sprint"
  },
  {
    skill: "Technical Communication & Explanation",
    required: "Fluent articulation of architectural choices",
    studentLevel: "Developing concise answers",
    score: 66,
    requiredScore: 72,
    gap: -6,
    priority: "Medium",
    studentsAffected: 12,
    linkedCompany: "Deloitte",
    action: "AI Mock Interview"
  },
  {
    skill: "Operating Systems & Networking Basics",
    required: "Fundamental understanding of Processes & Threads",
    studentLevel: "Intermediate",
    score: 74,
    requiredScore: 70,
    gap: 4,
    priority: "Low",
    studentsAffected: 9,
    linkedCompany: "TCS",
    action: "Quick Review"
  }
];

export const initialRecommendations: Recommendation[] = [
  {
    id: "rec-001",
    title: "DSA High-Priority Coding Lab",
    category: "Coding",
    reason: "Your coding readiness is currently 55% and DSA is a high-priority requirement for TCS Digital.",
    expectedImpact: "Boosts coding readiness from 55% to ~75% and satisfies Stage 2 barrier.",
    priority: "High",
    estimatedEffort: "5 hours",
    companyTarget: "TCS",
    actionText: "Start Practice"
  },
  {
    id: "rec-002",
    title: "SQL & Schema Query Simulation",
    category: "Technical",
    reason: "Infosys technical screening requires complex JOIN and group-by optimization queries.",
    expectedImpact: "Closes 8-point gap in database querying.",
    priority: "Medium",
    estimatedEffort: "3 hours",
    companyTarget: "Infosys",
    actionText: "Take Practice Assessment"
  },
  {
    id: "rec-003",
    title: "AI Technical Mock Interview (20 min)",
    category: "Interview",
    reason: "Recent assessment indicated hesitation during live complexity explanations.",
    expectedImpact: "Generates rubric-based feedback on problem-solving clarity and speech structure.",
    priority: "High",
    estimatedEffort: "20 minutes",
    companyTarget: "TCS",
    actionText: "Start AI Interview"
  },
  {
    id: "rec-004",
    title: "Align Resume to Job Description",
    category: "Resume",
    reason: "Resume is missing verified course project tags for REST APIs and Git workflow.",
    expectedImpact: "Increases automated JD match score from 86% to 94%.",
    priority: "Medium",
    estimatedEffort: "30 minutes",
    companyTarget: "TCS",
    actionText: "Update Resume Draft"
  }
];

export const initialWorkshops: WorkshopCohort[] = [
  {
    id: "ws-001",
    title: "DSA + C++ Placement Bootcamp",
    targetSkill: "DSA & Problem Solving",
    studentsAffected: 50,
    avgScoreBefore: 54,
    requiredScore: 75,
    priority: "Critical",
    linkedDrive: "TCS — Software Engineer",
    deliveryMode: "Classroom",
    instructor: "Prof. S. Tripathy (Lead Placement Trainer)",
    date: "18 Oct 2026",
    time: "10:00 AM",
    duration: "2 hours",
    venue: "Main Computing Lab 3",
    capacity: 50,
    registeredCount: 47,
    attendedCount: 43,
    status: "Registration Open",
    userRegistered: true
  },
  {
    id: "ws-002",
    title: "SQL & DBMS Query Masterclass",
    targetSkill: "SQL, Indexing, Transactions",
    studentsAffected: 18,
    avgScoreBefore: 64,
    requiredScore: 70,
    priority: "Medium",
    linkedDrive: "Infosys — Systems Engineer",
    deliveryMode: "Hybrid",
    instructor: "Er. Amitav Ray (Industry Consultant)",
    date: "21 Oct 2026",
    time: "02:30 PM",
    duration: "90 minutes",
    venue: "Auditorium Hall B & Online Zoom",
    capacity: 25,
    registeredCount: 25,
    attendedCount: 22,
    status: "Full",
    userRegistered: false
  },
  {
    id: "ws-003",
    title: "Technical Interview & Live Problem Defense",
    targetSkill: "Communication & Architecture Defense",
    studentsAffected: 32,
    avgScoreBefore: 61,
    requiredScore: 72,
    priority: "High",
    linkedDrive: "Deloitte & TCS",
    deliveryMode: "Classroom",
    instructor: "Placement Cell Senior Mentors",
    date: "25 Oct 2026",
    time: "11:00 AM",
    duration: "2 hours",
    venue: "Seminar Room 1",
    capacity: 35,
    registeredCount: 21,
    attendedCount: 0,
    status: "Registration Open",
    userRegistered: false
  }
];

export const initialAssessments: AssessmentItem[] = [
  {
    id: "asm-001",
    title: "TCS Digital Technical Screening Round",
    type: "Technical",
    company: "TCS",
    durationMinutes: 45,
    questionsCount: 25,
    avgScore: 68,
    attemptsCount: 312,
    completionRate: "94%",
    status: "Live",
    proctoringEventsCount: 14,
    score: 74
  },
  {
    id: "asm-002",
    title: "Campus Diagnostic Aptitude Benchmark",
    type: "Aptitude",
    company: "General College Assessment",
    durationMinutes: 60,
    questionsCount: 40,
    avgScore: 74,
    attemptsCount: 482,
    completionRate: "91%",
    status: "Live",
    proctoringEventsCount: 26,
    score: 82
  },
  {
    id: "asm-003",
    title: "SQL & Database Schema Sprint",
    type: "Company-Specific",
    company: "Infosys",
    durationMinutes: 30,
    questionsCount: 15,
    avgScore: 72,
    attemptsCount: 118,
    completionRate: "100%",
    status: "Completed",
    proctoringEventsCount: 3,
    score: 65
  },
  {
    id: "asm-004",
    title: "Data Structures Coding Assessment #04",
    type: "Coding",
    company: "Deloitte / Wipro",
    durationMinutes: 60,
    questionsCount: 3,
    avgScore: 65,
    attemptsCount: 96,
    completionRate: "86%",
    status: "Review",
    proctoringEventsCount: 8,
    score: 55
  }
];

export const initialInterviews: AIInterviewSession[] = [
  {
    id: "int-001",
    company: "TCS",
    role: "Digital Software Engineer",
    type: "Technical",
    durationMinutes: 20,
    questionsCount: 10,
    status: "Completed",
    score: 78,
    date: "04 Oct 2026",
    technicalScore: 76,
    relevanceScore: 82,
    problemSolvingScore: 74,
    communicationScore: 80,
    feedbackSummary: "Strong conceptual understanding of OOP and relational schemas. When describing time complexity for recursion, provide strict mathematical upper bounds instead of approximate cases.",
    areasToImprove: [
      "Explain space complexity tradeoffs before code optimization",
      "Structure multi-tier responses using the STAR format",
      "Elaborate on database deadlock avoidance strategies"
    ]
  },
  {
    id: "int-002",
    company: "Infosys",
    role: "Systems Engineer",
    type: "Behavioral",
    durationMinutes: 15,
    questionsCount: 8,
    status: "Completed",
    score: 84,
    date: "28 Sep 2026",
    technicalScore: 80,
    relevanceScore: 88,
    problemSolvingScore: 82,
    communicationScore: 86,
    feedbackSummary: "Excellent communication and professional demeanor. Confident explanation of team project milestones.",
    areasToImprove: [
      "Provide more concrete metrics when describing past project successes"
    ]
  },
  {
    id: "int-003",
    company: "Deloitte",
    role: "Analyst",
    type: "Technical",
    durationMinutes: 20,
    questionsCount: 10,
    status: "Ready",
    date: "Scheduled for Today"
  }
];

export const proctoringAuditLog: ProctoringEvent[] = [
  { timestamp: "10:02:14", eventType: "Candidate detected", confidence: 0.98, riskLevel: "Low" },
  { timestamp: "10:14:30", eventType: "Looking away", confidence: 0.74, riskLevel: "Low" },
  { timestamp: "10:18:05", eventType: "Candidate absent", confidence: 0.89, riskLevel: "Medium" },
  { timestamp: "10:31:22", eventType: "Phone detected", confidence: 0.82, riskLevel: "High" },
  { timestamp: "10:42:16", eventType: "Multiple person detected", confidence: 0.85, riskLevel: "High" }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: "notif-001",
    title: "New Placement Drive Published",
    message: "TCS Digital Software Engineer drive published. Application deadline: 16 Oct 2026.",
    time: "10 mins ago",
    type: "drive",
    read: false
  },
  {
    id: "notif-002",
    title: "Targeted Workshop Enrollment",
    message: "You have been registered for DSA + C++ Placement Bootcamp based on measured TCS coding gap.",
    time: "2 hours ago",
    type: "workshop",
    read: false
  },
  {
    id: "notif-003",
    title: "Assessment Scheduled",
    message: "Campus Diagnostic Aptitude Benchmark is live. Complete by 18:00 IST today.",
    time: "4 hours ago",
    type: "assessment",
    read: false
  },
  {
    id: "notif-004",
    title: "Proctoring Signal Review",
    message: "4 assessment sessions flagged for multiple-person probabilistic review by placement admin.",
    time: "1 day ago",
    type: "alert",
    read: true
  }
];
