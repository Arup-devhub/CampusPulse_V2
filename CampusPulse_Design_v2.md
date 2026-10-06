# CampusPulse — UI/UX Design System

**Version:** 2.0  
**Status:** Development-ready — Workshop Intervention Expansion  
**Product:** CampusPulse — AI-Powered Student Placement Readiness & Intervention Platform

## 1. Design Direction

Use the supplied reference for layout and information hierarchy only. Do **not** copy its blue/purple visual language.

CampusPulse must look like a serious university placement operations product: professional, clean, restrained, practical, data-focused, and human-designed.

### Avoid
- Blue/purple AI themes
- Neon gradients or glow
- Cyberpunk/gaming styling
- Excessive glassmorphism
- Giant AI/robot illustrations
- Excessive rounded cards
- Decorative neural-network backgrounds
- Excessive animation
- Generic “AI-generated SaaS” aesthetics

## 2. Color System

Primary palette:

- Black: `#111111`
- Near Black: `#181818`
- White: `#FFFFFF`
- Off White: `#FAFAFA`
- Grey 900: `#242424`
- Grey 800: `#333333`
- Grey 700: `#4A4A4A`
- Grey 600: `#666666`
- Grey 500: `#808080`
- Grey 400: `#A3A3A3`
- Grey 300: `#D4D4D4`
- Grey 200: `#E5E5E5`
- Grey 100: `#F2F2F2`
- Grey 50: `#F8F8F8`

Functional colors, used sparingly:

- Success: `#15803D`
- Warning: `#A16207`
- Error: `#B91C1C`

Strictly no blue or purple as the primary brand color.

## 3. Typography

Use Inter, with system sans-serif fallback.

- Page title: 28–32px, 700
- Section title: 20–24px, 600
- Card title: 15–17px, 600
- Body: 14–15px, 400
- Secondary: 12–13px
- Metric: 24–32px, 700

## 4. Application Layout

Desktop:

```text
┌─────────────────────────────────────────────────────────┐
│ Header                                                  │
├───────────────┬─────────────────────────────────────────┤
│ Sidebar       │ Main Content                            │
│               │                                         │
│ Navigation    │                                         │
└───────────────┴─────────────────────────────────────────┘
```

Sidebar: approximately 240–260px, thin border, simple icons, clear active state.

Main content: consistent 12–24px spacing, readable max-width, aligned grid.

## 5. Navigation

Main navigation:

- Dashboard
- Students
- Recruiters
- Placement Drives
- Assessments
- AI Interviews
- AI Matching
- Readiness
- Skill Gaps
- Recommendations
- Resumes
- Reports
- Settings

Active item should use strong black/white contrast rather than glow.

## 6. Header

Include:

- CampusPulse logo
- Search: `Search students, companies, drives...`
- Notifications
- User avatar/initial
- User name
- Role
- Profile dropdown

Profile dropdown:

```text
View Profile
Account Settings
Security
Logout
```

**Logout must be clearly accessible.**

## 7. Public Landing Page

Use the reference layout as inspiration, but use a restrained black/white presentation.

Hero:

**Measure Readiness. Improve Placement Outcomes.**

Supporting text:

> CampusPulse helps students and placement teams understand company-specific readiness, identify skill gaps, and prepare before the placement drive.

Buttons:

- Get Started
- Sign In

Feature strip:

- AI Matching
- Online Assessment
- AI Interview
- Readiness Analysis
- Resume Generator

Do not use giant AI graphics or futuristic illustrations.

## 8. Authentication

Authentication is a real product feature and must have complete UI.

### Sign In

```text
CampusPulse

Student / Admin Sign In

Email / Username
[________________________]

Password
[________________________]

[ Sign In ]

Forgot Password?
Don't have an account? Create Account
```

### Student Profile / First-time Onboarding

After successful student sign-in, collect or retrieve:

**Required**
- Student Name
- Registration Number
- Email
- GitHub Profile URL
- LinkedIn Profile URL

**Optional**
- Phone
- Profile photo
- Branch
- Degree
- Semester
- CGPA

Do not ask repeatedly for information already stored in the authenticated account.

### Logout

Logout must be available from:
1. User profile dropdown
2. Settings → Account
3. Mobile navigation

Confirmation:

```text
Log out of CampusPulse?

You will need to sign in again to access your account.

Cancel        Log Out
```

After logout:
- Clear authenticated session/state
- Clear protected cached data
- Redirect to `/login`

## 9. Student Dashboard

Prioritize readiness.

Top metrics:

- Overall Readiness
- Company Matches
- Upcoming Assessments
- Upcoming Interviews

Show:

```text
Overall Readiness
68%
Developing
```

Company readiness table:

```text
TCS          68%   Developing
Infosys      74%   Ready
Wipro        61%   At Risk
Accenture    79%   Ready
```

Skill gaps:

```text
DSA                  High Priority
SQL                  Medium Priority
Communication        Medium Priority
System Design        Low Priority
```

Recommendations:

- Complete DSA Assessment
- Practice SQL
- Take Mock Interview
- Improve Resume

## 10. Placement Command Dashboard

Inspired by the supplied reference.

KPI row:

- Total Students
- Placement Ready
- Active Drives
- Offers Made
- Offers Accepted

Analytics:

- Placement trends
- Branch-wise conversion
- Package trends
- Readiness distribution
- Assessment performance
- Interview performance

Operational cards:

- Students At Risk
- Recruiter Pipeline
- Documentation Pending
- Upcoming Drives
- Recent Activities

Only show charts that communicate useful information.

## 11. Students

Student table:

```text
Student | Registration No. | Branch | CGPA | Readiness | Risk | Skills | Placement Status | Actions
```

Filters:

- Branch
- Semester
- CGPA
- Readiness
- Risk
- Placement status
- Company
- Skill

Student details:

- Overview
- Academic Profile
- Skills
- Projects
- Certifications
- Resume
- Assessments
- AI Interviews
- Readiness
- Skill Gaps
- Recommendations
- Placement History

## 12. Recruiters

Display:

- Company
- Recruiter
- Open roles
- Active drives
- Candidates
- Status
- Last activity

Recruiter detail:

- Company Information
- Job Descriptions
- Placement Drives
- Candidate Pipeline
- Assessments
- Interviews
- Selection History

## 13. Placement Drives

Drive list:

- Company
- Role
- Package
- Eligibility
- Application Deadline
- Drive Date
- Candidates
- Status

Drive details:

- Overview
- Eligibility
- Job Description
- Required Skills
- Recruitment Stages
- Applicants
- Shortlisted
- Assessments
- Interviews
- Offers
- Analytics

## 14. Online Assessment

The assessment screen must feel like a real examination platform.

```text
┌─────────────────────────────────────────────────────────┐
│ Company | Assessment                    Timer 00:42:15 │
├──────────────────┬──────────────────────────────────────┤
│ Question List    │ Question                             │
│ 1 ✓              │ Q12. ...                            │
│ 2 ✓              │                                      │
│ 3                │ [Options / Editor]                  │
│ ...              │                                      │
├──────────────────┴──────────────────────────────────────┤
│ Previous                 Save & Next        Submit       │
└─────────────────────────────────────────────────────────┘
```

Features:

- Auto evaluation
- Time monitoring
- Question navigation
- Answer saving
- AI proctoring
- Submission tracking

## 15. AI Interview — Mandatory UI Feature

**AI Interview is a first-class feature and must not be hidden.**

It must appear in:

- Main sidebar
- Student dashboard
- Placement drive workflow
- Student profile
- Interview history
- Dedicated AI Interview page

### AI Interview landing page

```text
AI Interview

Prepare for your next placement interview.

[ Start AI Interview ]
[ View Previous Interviews ]

Interview Type: Technical / HR / Behavioral
Company: [Company]
Duration: 20 min
Questions: 10
Status: Ready
```

### Live AI Interview

```text
┌─────────────────────────────────────────────────────────┐
│ CampusPulse AI Interview              18:42 remaining   │
├───────────────────────────┬─────────────────────────────┤
│                           │ Interviewer                  │
│       Candidate Video     │                             │
│                           │ Question                     │
│                           │ "Explain your approach..."   │
│                           │                             │
│                           │ [ Record Answer ]            │
│                           │ [ Submit Answer ]             │
└───────────────────────────┴─────────────────────────────┘
```

Controls:

- Camera on/off
- Microphone on/off
- Start recording
- Stop recording
- Submit answer
- Next question
- End interview

Status:

```text
Interview in Progress
Question 4 of 10
```

### Interview result

Show:

- Interview Score
- Technical Performance
- Answer Relevance
- Problem Solving
- Communication
- Areas to Improve
- Question-wise feedback

Do not claim AI can perfectly determine personality, honesty, emotion, or character.

## 16. AI Proctoring UI

During assessment/interview:

```text
Proctoring
● Active

Camera        Connected
Microphone    Connected
Candidate     Detected
```

Possible event:

```text
Attention required
Multiple-person event detected
10:42:16
```

Admin report:

```text
Session
Candidate
Duration
Total Events
Risk Level

10:02  Candidate detected
10:18  Candidate absent
10:31  Phone detected
10:42  Multiple person detected
```

Show confidence where applicable. Treat events as probabilistic signals, not automatic proof of misconduct.

## 17. Student Readiness & Risk

Core CampusPulse feature.

```text
Student Readiness & Risk

Select Company
[ TCS                         ▼ ]

Overall Readiness
68%
Developing
```

Stage analysis:

```text
Aptitude       82%   Ready
Technical      61%   Developing
Coding         55%   At Risk
Interview      74%   Ready
```

Key improvement areas:

```text
DSA             High Priority
SQL             Medium Priority
Communication   Medium Priority
```

CTA:

`View Personalized Learning Plan`

## 18. Skill Gap UI

Compare:

`Company Requirements VS Student Skills`

Example:

```text
Skill        Required       Student       Gap
DSA          Advanced       Basic         High
Python       Advanced       Advanced      None
SQL          Intermediate   Basic         Medium
Git          Basic          Advanced      None
```

Each gap must show priority, reason and recommended action.

## 19. Recommendation Engine UI

Page title:

**Personalized Recommendations**

Each recommendation shows:

- Recommendation
- Why it is recommended
- Expected impact
- Priority
- Estimated effort

Example:

```text
Practice DSA

Why:
Your coding readiness is currently 55% and DSA is a
high-priority requirement for this company.

[ Start Practice ]
```

Avoid generic motivational AI text.

## 20. AI Matching & Explainable Recommendations

Candidate table:

```text
Candidate | Match | Readiness | Risk | Key Skills | Status
```

Explanation:

```text
Why this candidate?

✓ Required Python skills
✓ Meets CGPA criteria
✓ Relevant project
✓ Strong assessment score
△ SQL needs improvement
```

Explanations must be generated from actual stored data.

## 21. Resume Generator & Sender

Workflow:

`Select JD → Analyze Requirements → Generate Resume → Review/Edit → Preview → Download/Send`

UI:

Left:
- Job Description
- Company
- Role
- Required Skills

Right:
- Generated Resume Preview

Actions:

- Regenerate
- Edit
- Download
- Send to Recruiter

Never fabricate qualifications, certifications, projects or achievements.

## 22. Intervention Management

Placement officer view:

- At-Risk Students
- Skill Gap Groups
- Recommended Workshops
- Assigned Interventions
- Progress
- Reassessment

Example:

```text
DSA Workshop
Students: 42
Average readiness before: 54%
Target: 70%

[ Assign Assessment ]
[ Schedule Workshop ]
[ Reassess ]
```

## 23. Reports

Report types:

- Placement
- Student readiness
- Company
- Assessment
- AI interview
- Skill gaps
- Intervention
- Proctoring
- Offers

Support filters, date ranges, company/branch filters and export where implemented.

## 24. Notifications

Types:

- New placement drive
- Assessment scheduled
- Interview scheduled
- Resume requirement
- Deadline reminder
- Skill-gap alert
- Recommendation
- Intervention assignment
- Readiness change

Use a simple notification drawer.

## 25. Settings

Sections:

```text
Profile
Account
Security
Notifications
Assessment Settings
Interview Settings
Proctoring Settings
Organization Settings
API/Integration Settings
```

Account fields:

- Student Name
- Registration Number
- Email
- GitHub
- LinkedIn

Security:

- Change Password
- Active Sessions
- Logout
- Logout from all devices

## 26. Responsive Design

Desktop:
- Full sidebar
- Dashboard grid

Tablet:
- Collapsible sidebar

Mobile:
- Hamburger/bottom navigation

Priority mobile navigation:

`Home | Drives | Assessments | AI Interview | Readiness | Profile`

## 27. Components

Use shadcn/ui where appropriate:

- Button
- Card
- Input
- Select
- Dialog
- Dropdown Menu
- Tabs
- Table
- Badge
- Progress
- Sheet
- Tooltip
- Toast
- Alert
- Avatar
- Calendar
- Form

Prefer reusable components instead of rebuilding standard controls.

## 28. Cards

Cards should be:

- Flat
- Thin bordered
- Subtle shadow or no shadow
- 8–12px radius
- Neutral background
- Clear hierarchy

Avoid giant rounded containers, neon borders, glow and gradient cards.

## 29. Tables

Admin screens should use compact, professional tables with:

- Sort
- Search
- Filters
- Pagination
- Row actions

## 30. Charts

Use charts only for meaningful information.

Preferred:

- Line
- Bar
- Donut
- Area when necessary

Use mostly black/grey tones. Functional colors are reserved for status.

## 31. Empty / Loading / Error States

Every major page must define:

- Default
- Loading
- Empty
- Error
- Success
- Unauthorized

Example empty state:

```text
No placement drives yet

Create your first placement drive to start tracking
candidates and readiness.

[ Create Placement Drive ]
```

Use skeletons and inline progress for loading. Use clear human-readable error messages.

## 32. Interaction & Animation

Allowed:
- 150–250ms transitions
- Hover states
- Button feedback
- Drawer/modal transitions
- Progress animation
- Skeleton loading

Avoid:
- Parallax
- Excessive motion
- Pulsing cards
- Neon animations
- Decorative floating elements

## 33. Accessibility

Target WCAG-aware design:

- Keyboard navigation
- Visible focus states
- Semantic HTML
- Accessible labels
- Sufficient contrast
- Form validation
- Screen-reader-friendly controls

Camera/microphone permissions must explain why access is required.

## 34. Authentication State Rules

```text
Unauthenticated
      ↓
Login
      ↓
Authenticated
      ↓
Profile Completion if required
      ↓
Dashboard
```

Protected routes redirect unauthenticated users to `/login`.

Logout clears authentication state and protected cached data, then redirects to `/login`.

## 35. Required Frontend Routes

```text
/
/features
/about
/contact

/login
/signup
/forgot-password

/dashboard
/students
/students/:id
/companies
/companies/:id
/placement-drives
/placement-drives/:id

/assessments
/assessments/:id
/assessments/:id/take
/assessments/:id/result

/ai-interviews
/ai-interviews/:id
/ai-interviews/:id/session
/ai-interviews/:id/result

/readiness
/readiness/:studentId/:companyId
/skill-gaps
/recommendations

/ai-matching
/resumes
/resumes/generate

/reports
/settings
/profile
```

## 36. Final UI Information Architecture

```text
CampusPulse
│
├── Public
│   ├── Landing
│   ├── Features
│   ├── About
│   ├── Contact
│   └── Authentication
│
├── Dashboard
├── Students
├── Recruiters
├── Placement Drives
│
├── Assessments
│   ├── Assessment List
│   ├── Assessment Session
│   ├── Results
│   └── Proctoring
│
├── AI Interviews
│   ├── Interview List
│   ├── Interview Setup
│   ├── Live AI Interview
│   ├── Interview Result
│   └── AI Feedback
│
├── AI Matching
├── Readiness
├── Skill Gaps
├── Recommendations
│
├── Resumes
│   ├── JD Selection
│   ├── Generation
│   ├── Editing
│   ├── Preview
│   └── Sending
│
├── Reports
├── Notifications
├── Profile
└── Settings
    ├── Account
    ├── Security
    └── Logout
```

## 37. Strict Implementation Rules

1. Use the supplied image for layout/information architecture inspiration only.
2. Use black, white and neutral grey as the primary visual identity.
3. Keep the product professional and institutional.
4. Do not introduce a blue/purple AI theme.
5. Do not make the interface look AI-generated.
6. **Do not remove or hide AI Interview.**
7. AI Interview must have setup, live-session and result screens.
8. Authentication must be represented as a complete flow.
9. Student onboarding must include Name, Registration Number, Email, GitHub URL and LinkedIn URL.
10. Logout must be available from profile and settings.
11. Do not fabricate student/company/placement data.
12. Use real API data when backend integration is available.
13. Preserve existing functionality when redesigning.
14. Do not redesign unrelated dashboard functionality merely for visual novelty.
15. Prefer clarity and usability over decoration.

### Primary design statement

> **CampusPulse should look like a professional university placement operations platform — not an AI demo.**

# 38. Workshop Intervention Experience

The workshop module is a first-class placement-preparation workflow. It must
connect the placement officer's analytics with the student's preparation
experience.

## 38.1 Placement Officer — Skill Gap Cohort View

Add a dedicated **Workshops / Interventions** navigation item.

The main view should include:

```text
Workshop & Intervention Center

[ Create Workshop ]

Skill Gap Cohorts
---------------------------------------------------------
Skill        Students   Avg Score   Required   Priority
DSA             50         54          75        High
C++             37         57          75        High
SQL             18         64          70        Medium
Communication   12         66          72        Medium
```

CTA:

`Create Workshop from Cohort`

The officer should be able to select DSA and C++ and immediately create a
targeted workshop rather than manually searching for students one by one.

## 38.2 Create Workshop

Form fields:

```text
Workshop Title
Description
Target Skills
Linked Placement Drive
Instructor
Date
Start Time
Duration
Mode: Classroom / Online / Hybrid
Venue / Meeting Link
Capacity
Registration: Open / Closed
Enrollment: Self-register / Auto-enroll
Pre-assessment
Post-assessment
Targeting Criteria
```

Targeting criteria should support:

- Skill
- Maximum current skill score
- Gap priority
- Branch
- Semester
- Company drive
- Risk level
- Manual student selection

Before publishing:

```text
Estimated Eligible Students: 50
Capacity: 50
```

## 38.3 Workshop Detail — Officer

Show:

```text
DSA + C++ Placement Bootcamp

Target Students: 50
Registered: 47
Attended: 43
Completed: 41

Average DSA Before: 54%
Average DSA After: 76%
Students Above Target: 31

Readiness Before: 61%
Readiness After: 73%

[ View Students ]
[ Record Attendance ]
[ View Assessment ]
[ Recalculate Readiness ]
[ Export Report ]
```

## 38.4 Student Dashboard

Add:

```text
College Workshops

Recommended for You
------------------------------------------------
DSA + C++ Placement Bootcamp
Because DSA is a high-priority gap for your
upcoming placement drive.

DSA: 54% → Required: 75%
Date: 18 Oct
Mode: Classroom
Seats: 3 remaining

[ View Workshop ]
```

Workshop access must be prominent but should not overwhelm the primary
readiness dashboard.

## 38.5 Student Workshop Detail

Show:

```text
DSA + C++ Placement Bootcamp

Why am I seeing this?
Your current DSA score is 54%, while the selected
placement drive requires 75%.

Instructor: Faculty / Placement Trainer
Date: 18 Oct
Time: 10:00 AM
Duration: 2 hours
Mode: Classroom
Venue: Lab 3

Pre-assessment: Required
Post-assessment: Required

[ Register ]
```

After registration:

```text
Registration: Confirmed
Attendance: Pending
Pre-assessment: Completed
Post-assessment: Not Started
```

## 38.6 Attendance

Officer view:

```text
Attendance

Student          Status       Check-in
A. Student       Present     10:02
B. Student       Present     10:04
C. Student       Absent      —
```

Support authorized manual attendance and future extensibility for QR-based
attendance. Do not expose another student's attendance to students.

## 38.7 Before/After Results

Student:

```text
Workshop Result

DSA
Before       54%
After        78%
Improvement  +24 points

Placement Readiness
Before       61%
After        76%

Status: Gap improved

Next step:
[ Take Company Coding Assessment ]
```

Officer:

```text
Workshop Impact

Students enrolled: 50
Students attended: 43
Average improvement: +18 points
Students crossing target: 31
Students still below target: 12
```

## 38.8 Navigation

Update information architecture:

```text
├── Readiness
├── Skill Gaps
├── Recommendations
├── Workshops & Interventions
│   ├── Workshop Dashboard
│   ├── Skill Gap Cohorts
│   ├── Create Workshop
│   ├── Workshop Details
│   ├── Attendance
│   ├── Pre/Post Assessment
│   └── Impact Report
```

## 38.9 Notifications

Students should receive notifications for:

- workshop assigned;
- registration opened;
- registration confirmed;
- workshop reminder;
- workshop rescheduled/cancelled;
- attendance recorded;
- post-assessment available;
- workshop result available;
- readiness improved/remaining at risk.

## 38.10 Visual rules

Continue the existing design system:

- black/white/neutral primary palette;
- restrained success/warning/error colors;
- Inter typography;
- professional university operations aesthetic;
- no neon workshop graphics;
- no gamified cartoon treatment;
- prioritize tables, status labels, metrics and clear actions.

Workshop pages should feel operational and useful, not like an e-learning
marketplace.
