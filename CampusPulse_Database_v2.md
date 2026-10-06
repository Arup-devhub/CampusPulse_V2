# CampusPulse — Database Specification

**Document:** `database.md`  
**Project:** CampusPulse  
**Database:** MongoDB  
**Backend:** Node.js REST API  
**Status:** Implementation Specification — Workshop Intervention Expansion  
**Version:** 2.0

## 1. Database Objective

CampusPulse uses MongoDB to store student profiles, authentication information, company-drive requirements, assessments, interview sessions, proctoring events, readiness scores, skill gaps, recommendations, workshops, resumes, and performance history.

The database must support:
- Student authentication
- Student profiles
- Company placement drives
- Company-specific readiness analysis
- Online aptitude assessments
- Online AI interviews
- Interview evaluation
- Online assessment/interview proctoring
- Resume management
- Skill-gap detection
- Intervention recommendations
- Workshop tracking
- Reassessment and progress tracking

## 2. Database Design Principles

1. Use MongoDB collections for major domain entities.
2. Every document must contain `_id`, `createdAt`, and `updatedAt`.
3. Use MongoDB `ObjectId` references between collections where appropriate.
4. Never store plaintext passwords.
5. Passwords must be hashed using Argon2 or bcrypt.
6. Never store authentication secrets, API keys, or JWT secrets directly in database documents.
7. Store uploaded files in external/object storage and save only metadata/references in MongoDB.
8. Assessment and interview results should be immutable after final submission except through an authorized correction process.
9. Student-specific information must only be accessible to authorized users.
10. Avoid unnecessary duplication of large documents.

## 3. Collections

```text
users
students
company_drives
drive_requirements
assessments
assessment_questions
assessment_attempts
interview_sessions
interview_questions
interview_responses
proctoring_sessions
proctoring_events
resumes
skills
student_skills
readiness_scores
skill_gaps
recommendations
workshops
workshop_enrollments
notifications
audit_logs
```

## 4. users

Stores authentication and account-level information.

```javascript
{
  _id: ObjectId,
  email: String,
  phone: String,
  username: String,
  passwordHash: String,
  role: String, // "student" | "placement_officer" | "admin"
  status: String, // "active" | "inactive" | "suspended"
  lastLoginAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

Constraints:
- `email` must be unique.
- `username` should be unique.
- Password must never be stored as plaintext.
- Email should be normalized to lowercase.

## 5. students

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  name: String,
  registrationNumber: String,
  email: String,
  phone: String,
  branch: String,
  department: String,
  semester: Number,
  cgpa: Number,
  backlogHistory: [
    {
      semester: Number,
      count: Number
    }
  ],
  githubUrl: String,
  linkedinUrl: String,
  portfolioUrl: String,
  graduationYear: Number,
  profileCompletion: Number,
  createdAt: Date,
  updatedAt: Date
}
```

Indexes:
```text
userId
registrationNumber
email
branch
graduationYear
```

## 6. company_drives

```javascript
{
  _id: ObjectId,
  companyName: String,
  jobRole: String,
  description: String,
  driveDate: Date,
  applicationDeadline: Date,
  eligibleBranches: [String],
  minimumCGPA: Number,
  maximumBacklogs: Number,
  rounds: [
    {
      roundNumber: Number,
      roundName: String,
      roundType: String
    }
  ],
  status: String, // "upcoming" | "active" | "completed" | "cancelled"
  createdAt: Date,
  updatedAt: Date
}
```

## 7. drive_requirements

```javascript
{
  _id: ObjectId,
  driveId: ObjectId,
  requiredSkills: [
    {
      skillId: ObjectId,
      skillName: String,
      importance: Number,
      minimumScore: Number
    }
  ],
  aptitudeRequirements: {
    quantitative: Number,
    logicalReasoning: Number,
    verbal: Number
  },
  communicationRequirement: Number,
  technicalRequirement: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 8. assessments

```javascript
{
  _id: ObjectId,
  driveId: ObjectId,
  title: String,
  description: String,
  type: String, // "aptitude" | "technical_entry"
  durationMinutes: Number,
  totalQuestions: Number,
  totalMarks: Number,
  passingScore: Number,
  sections: [
    {
      name: String,
      questionCount: Number,
      marks: Number
    }
  ],
  status: String, // "draft" | "published" | "closed"
  createdAt: Date,
  updatedAt: Date
}
```

## 9. assessment_questions

```javascript
{
  _id: ObjectId,
  assessmentId: ObjectId,
  questionText: String,
  questionType: String, // "mcq" | "true_false"
  options: [
    {
      optionId: String,
      text: String
    }
  ],
  correctOption: String,
  marks: Number,
  skillId: ObjectId,
  difficulty: String, // "easy" | "medium" | "hard"
  createdAt: Date,
  updatedAt: Date
}
```

Correct answers must never be returned to the frontend before submission.

## 10. assessment_attempts

```javascript
{
  _id: ObjectId,
  assessmentId: ObjectId,
  studentId: ObjectId,
  startedAt: Date,
  submittedAt: Date,
  status: String, // "started" | "submitted" | "expired" | "terminated"
  answers: [
    {
      questionId: ObjectId,
      selectedOption: String,
      answeredAt: Date
    }
  ],
  score: Number,
  percentage: Number,
  sectionScores: [
    {
      sectionName: String,
      score: Number,
      percentage: Number
    }
  ],
  skillScores: [
    {
      skillId: ObjectId,
      score: Number
    }
  ],
  proctoringSessionId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## 11. interview_sessions

```javascript
{
  _id: ObjectId,
  studentId: ObjectId,
  driveId: ObjectId,
  interviewType: String, // "technical" | "hr" | "mixed"
  status: String, // "scheduled" | "in_progress" | "completed" | "terminated"
  startedAt: Date,
  endedAt: Date,
  totalQuestions: Number,
  overallScore: Number,
  communicationScore: Number,
  technicalScore: Number,
  confidenceScore: Number,
  relevanceScore: Number,
  feedback: String,
  proctoringSessionId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## 12. interview_questions

```javascript
{
  _id: ObjectId,
  sessionId: ObjectId,
  questionNumber: Number,
  questionText: String,
  category: String,
  difficulty: String,
  expectedTopics: [String],
  createdAt: Date
}
```

## 13. interview_responses

```javascript
{
  _id: ObjectId,
  sessionId: ObjectId,
  questionId: ObjectId,
  responseText: String,
  audioUrl: String,
  responseDurationSeconds: Number,
  technicalScore: Number,
  communicationScore: Number,
  relevanceScore: Number,
  feedback: String,
  createdAt: Date
}
```

## 14. proctoring_sessions

```javascript
{
  _id: ObjectId,
  studentId: ObjectId,
  assessmentAttemptId: ObjectId,
  interviewSessionId: ObjectId,
  sessionType: String, // "assessment" | "interview"
  startedAt: Date,
  endedAt: Date,
  status: String, // "normal" | "flagged" | "terminated"
  totalEvents: Number,
  riskScore: Number,
  finalRiskLevel: String, // "low" | "medium" | "high"
  createdAt: Date,
  updatedAt: Date
}
```

## 15. proctoring_events

```javascript
{
  _id: ObjectId,
  sessionId: ObjectId,
  eventType: String,
  // "phone_detected" | "multiple_persons" | "person_missing"
  // "face_not_detected" | "tab_change" | "suspicious_movement"
  confidence: Number,
  timestamp: Date,
  frameUrl: String,
  severity: String, // "low" | "medium" | "high"
  metadata: Object,
  createdAt: Date
}
```

## 16. resumes

```javascript
{
  _id: ObjectId,
  studentId: ObjectId,
  fileName: String,
  fileUrl: String,
  version: Number,
  extractedText: String,
  parsedSkills: [String],
  parsedProjects: [
    {
      name: String,
      description: String,
      technologies: [String]
    }
  ],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 17. skills

```javascript
{
  _id: ObjectId,
  name: String,
  category: String,
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 18. student_skills

```javascript
{
  _id: ObjectId,
  studentId: ObjectId,
  skillId: ObjectId,
  score: Number,
  proficiencyLevel: String,
  source: String,
  lastEvaluatedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 19. readiness_scores

```javascript
{
  _id: ObjectId,
  studentId: ObjectId,
  driveId: ObjectId,
  overallScore: Number,
  readinessLevel: String, // "ready" | "moderate" | "at_risk"
  stageScores: [
    {
      stageName: String,
      score: Number
    }
  ],
  skillScores: [
    {
      skillId: ObjectId,
      score: Number
    }
  ],
  riskFactors: [String],
  calculatedAt: Date,
  modelVersion: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 20. skill_gaps

```javascript
{
  _id: ObjectId,
  studentId: ObjectId,
  driveId: ObjectId,
  skillId: ObjectId,
  currentScore: Number,
  requiredScore: Number,
  gapScore: Number,
  priority: String, // "low" | "medium" | "high" | "critical"
  status: String, // "identified" | "in_progress" | "resolved"
  createdAt: Date,
  updatedAt: Date
}
```

## 21. recommendations

```javascript
{
  _id: ObjectId,
  studentId: ObjectId,
  driveId: ObjectId,
  type: String, // "course" | "workshop" | "practice" | "mock_interview"
  title: String,
  description: String,
  targetSkillId: ObjectId,
  priority: String,
  status: String, // "recommended" | "started" | "completed"
  createdAt: Date,
  updatedAt: Date
}
```

## 22. workshops

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  targetSkills: [ObjectId],
  instructor: String,
  scheduledAt: Date,
  durationMinutes: Number,
  capacity: Number,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 23. workshop_enrollments

```javascript
{
  _id: ObjectId,
  workshopId: ObjectId,
  studentId: ObjectId,
  attendanceStatus: String,
  completionScore: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 24. notifications

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  title: String,
  message: String,
  type: String,
  isRead: Boolean,
  createdAt: Date
}
```

## 25. audit_logs

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  action: String,
  resourceType: String,
  resourceId: ObjectId,
  ipAddress: String,
  userAgent: String,
  metadata: Object,
  createdAt: Date
}
```

## 26. Main Relationships

```text
users
  └── students
        ├── resumes
        ├── student_skills
        ├── assessment_attempts
        ├── interview_sessions
        ├── proctoring_sessions
        ├── readiness_scores
        ├── skill_gaps
        ├── recommendations
        └── workshop_enrollments

company_drives
  ├── drive_requirements
  ├── assessments
  ├── interview_sessions
  └── readiness_scores

assessments
  ├── assessment_questions
  └── assessment_attempts
        └── proctoring_sessions
              └── proctoring_events

interview_sessions
  ├── interview_questions
  ├── interview_responses
  └── proctoring_sessions

workshops
  └── workshop_enrollments
```

## 27. Required Indexes

```text
users.email
users.username
students.userId
students.registrationNumber
students.email
students.branch
students.graduationYear
company_drives.status
company_drives.driveDate
assessment_attempts.studentId
assessment_attempts.assessmentId
interview_sessions.studentId
interview_sessions.driveId
proctoring_sessions.studentId
proctoring_events.sessionId
proctoring_events.timestamp
readiness_scores.studentId
readiness_scores.driveId
skill_gaps.studentId
skill_gaps.driveId
notifications.userId
```

## 28. Data Access Rules

### Student
Can access only their own profile, resume, assessments, results, interviews, feedback, readiness scores, skill gaps, recommendations, workshop registrations, and notifications.

### Placement Officer
Can access student profiles, company drives, assessment results, interview results, readiness analytics, skill gaps, at-risk students, workshops, and intervention analytics.

### Admin
Can manage users, students, placement officers, company drives, assessments, skills, workshops, configuration, and audit logs.

## 29. Security Rules

- Passwords must be hashed.
- Never expose `passwordHash`.
- Validate all ObjectIds.
- Validate uploaded files.
- Restrict file types and sizes.
- Protect student data with role-based authorization.
- Never expose correct assessment answers before submission.
- Restrict proctoring evidence to authorized users.
- Sanitize user-generated text.
- Rate-limit authentication endpoints.
- Maintain audit logs for administrative actions.

## 30. Readiness Data Flow

```text
Student
   ↓
Profile + Resume + Skills
   ↓
Company Drive Requirements
   ↓
Assessment Results + Interview Results
   ↓
Readiness Engine
   ↓
Readiness Score
   ↓
Skill Gap Detection
   ↓
Intervention Recommendation
   ↓
Workshop / Practice
   ↓
Reassessment
   ↓
Updated Readiness
```

## 31. Backend Database Architecture

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Model / Repository
  ↓
MongoDB
```

Controllers must not contain complex database logic.

# 32. Workshop Intervention Data Model — Expanded

The existing `workshops` and `workshop_enrollments` collections are expanded
to support college-led cohort targeting, placement-drive linkage, attendance,
pre/post assessment, and measurable intervention outcomes.

## 32.1 Expanded `workshops`

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,

  targetSkills: [ObjectId],
  linkedDriveIds: [ObjectId],

  instructor: String,

  scheduledAt: Date,
  durationMinutes: Number,

  mode: String, // "classroom" | "online" | "hybrid"
  venue: String,
  meetingUrl: String,

  capacity: Number,

  status: String,
  // "draft" | "published" | "registration_closed" |
  // "in_progress" | "completed" | "cancelled"

  enrollmentMode: String,
  // "self_register" | "auto_enroll" | "staff_assign"

  registrationOpen: Boolean,

  targetingCriteria: {
    maxSkillScore: Number,
    minSkillScore: Number,
    priorities: [String],
    branches: [String],
    semesters: [Number],
    riskLevels: [String],
    studentIds: [ObjectId]
  },

  preAssessmentId: ObjectId,
  postAssessmentId: ObjectId,

  createdBy: ObjectId,

  createdAt: Date,
  updatedAt: Date
}
```

## 32.2 Expanded `workshop_enrollments`

```javascript
{
  _id: ObjectId,

  workshopId: ObjectId,
  studentId: ObjectId,

  enrollmentSource: String,
  // "auto_enrolled" | "self_registered" | "staff_assigned"

  enrollmentStatus: String,
  // "registered" | "waitlisted" | "cancelled" |
  // "attended" | "completed" | "no_show"

  attendanceStatus: String,
  // "pending" | "present" | "partial" | "absent"

  checkedInAt: Date,
  checkedOutAt: Date,

  preAssessmentAttemptId: ObjectId,
  postAssessmentAttemptId: ObjectId,

  preSkillScore: Number,
  postSkillScore: Number,
  skillImprovement: Number,

  preReadinessScore: Number,
  postReadinessScore: Number,
  readinessImprovement: Number,

  thresholdScore: Number,
  crossedTargetThreshold: Boolean,

  remainingGapScore: Number,

  completionScore: Number,

  nextRecommendationId: ObjectId,

  createdAt: Date,
  updatedAt: Date
}
```

## 32.3 Optional `workshop_attendance_events`

For colleges requiring an audit trail rather than only a final attendance
state:

```javascript
{
  _id: ObjectId,
  workshopId: ObjectId,
  studentId: ObjectId,
  eventType: String,
  // "check_in" | "check_out" | "manual_correction"

  timestamp: Date,
  recordedBy: ObjectId,
  metadata: Object,

  createdAt: Date
}
```

This collection is optional for MVP and can be introduced when detailed
attendance auditing is required.

## 32.4 Workshop impact calculation

Do not store every aggregate as the source of truth. Compute aggregate
analytics from enrollment and assessment records where practical.

Example:

```text
averagePreScore
= average(workshop_enrollments.preSkillScore)

averagePostScore
= average(workshop_enrollments.postSkillScore)

averageImprovement
= average(skillImprovement)

attendanceRate
= attended / enrolled * 100

thresholdCleared
= count(crossedTargetThreshold = true)
```

Cached aggregates may be introduced later for high-volume reporting.

## 32.5 Relationships

```text
skills
   ↓
skill_gaps ────────┐
                    ↓
company_drives → workshops
                    ↓
             workshop_enrollments
                    ↓
          pre/post assessment attempts
                    ↓
             readiness_scores
                    ↓
              recommendations
```

## 32.6 Indexes

Add:

```text
workshops.status
workshops.scheduledAt
workshops.targetSkills
workshops.linkedDriveIds
workshops.createdBy

workshop_enrollments.workshopId
workshop_enrollments.studentId
workshop_enrollments.enrollmentStatus
workshop_enrollments.attendanceStatus

workshop_attendance_events.workshopId
workshop_attendance_events.studentId
workshop_attendance_events.timestamp
```

Create a unique compound index:

```text
{ workshopId: 1, studentId: 1 } UNIQUE
```

This guarantees one enrollment per student per workshop.

## 32.7 Data access

Student:
- own workshop enrollment;
- own attendance;
- own pre/post scores;
- own improvement;
- own recommendations.

Placement Officer:
- workshop cohort;
- enrollment;
- attendance;
- pre/post performance;
- impact analytics;
- readiness changes.

Admin:
- full workshop configuration and audit access.

## 32.8 Intervention data lifecycle

```text
Skill Gap Identified
        ↓
Cohort Generated
        ↓
Workshop Created
        ↓
Enrollment
        ↓
Attendance
        ↓
Pre Assessment
        ↓
Workshop Delivery
        ↓
Post Assessment
        ↓
Skill Score Update
        ↓
Readiness Recalculation
        ↓
Recommendation Update
        ↓
Workshop Impact Report
```

## 32.9 Example record semantics

For a student whose DSA score was 54 and becomes 78:

```text
preSkillScore: 54
postSkillScore: 78
skillImprovement: 24

preReadinessScore: 61
postReadinessScore: 76
readinessImprovement: 15

thresholdScore: 75
crossedTargetThreshold: true
remainingGapScore: 0
```

The database should preserve the underlying assessment attempts so that these
derived values remain traceable.
