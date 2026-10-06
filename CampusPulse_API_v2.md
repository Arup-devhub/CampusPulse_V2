# CampusPulse — REST API Specification

**Document:** `api.md`  
**Project:** CampusPulse  
**Backend:** Node.js REST API  
**Database:** MongoDB  
**API Style:** REST  
**Version:** v1  
**Base Path:** `/api/v1`

## 1. API Principles

The backend must:
- Follow REST conventions.
- Use JSON except for file uploads.
- Use correct HTTP status codes.
- Validate every request.
- Authenticate protected routes.
- Authorize by role.
- Never expose passwords or password hashes.
- Return consistent response structures.
- Keep business logic inside services.
- Use pagination for large datasets.
- Use API versioning.

## 2. Standard Response

### Success

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": []
  }
}
```

## 3. HTTP Status Codes

```text
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
429 Too Many Requests
500 Internal Server Error
503 Service Unavailable
```

## 4. Authentication

### POST `/auth/register`

Creates a student account.

```json
{
  "email": "student@example.com",
  "phone": "9876543210",
  "username": "student01",
  "password": "StrongPassword123",
  "confirmPassword": "StrongPassword123"
}
```

### POST `/auth/login`

```json
{
  "email": "student@example.com",
  "password": "StrongPassword123"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "JWT_TOKEN",
    "user": {
      "id": "USER_ID",
      "role": "student",
      "email": "student@example.com"
    }
  }
}
```

### POST `/auth/logout`

Authentication required.

### POST `/auth/refresh`

Refresh authentication credentials when refresh-token authentication is implemented.

### GET `/auth/me`

Returns authenticated user information.

## 5. Student Profile APIs

### POST `/students/profile`
Creates a student profile.

### GET `/students/me`
Returns the current student's profile.

### PUT `/students/me`
Updates the current student's profile.

### GET `/students/:studentId`
Returns a student profile. Placement officer/admin access unless it is the authenticated student.

### GET `/students`

Pagination and filters:

```text
?page=1&limit=20&branch=CSE&graduationYear=2029&minCgpa=7
```

## 6. Company Drive APIs

### POST `/drives`
Creates a company placement drive. Placement officer/admin.

Example:

```json
{
  "companyName": "Example Technologies",
  "jobRole": "Software Engineer",
  "description": "Software engineering placement drive",
  "driveDate": "2026-12-15T10:00:00Z",
  "applicationDeadline": "2026-12-10T23:59:00Z",
  "eligibleBranches": ["CSE", "IT", "ECE"],
  "minimumCGPA": 7.5,
  "maximumBacklogs": 0
}
```

### GET `/drives`
Returns available company drives.

### GET `/drives/:driveId`
Returns complete drive information.

### PUT `/drives/:driveId`
Updates a drive.

### DELETE `/drives/:driveId`
Deletes/cancels a drive.

## 7. Drive Requirement APIs

### POST `/drives/:driveId/requirements`

```json
{
  "requiredSkills": [
    {
      "skillName": "Python",
      "importance": 0.9,
      "minimumScore": 70
    },
    {
      "skillName": "Data Structures",
      "importance": 0.9,
      "minimumScore": 75
    }
  ],
  "aptitudeRequirements": {
    "quantitative": 70,
    "logicalReasoning": 70,
    "verbal": 65
  },
  "communicationRequirement": 70,
  "technicalRequirement": 75
}
```

### GET `/drives/:driveId/requirements`
Returns drive requirements.

## 8. Assessment APIs

### POST `/assessments`
Creates an assessment.

```json
{
  "driveId": "DRIVE_ID",
  "title": "Aptitude Assessment",
  "type": "aptitude",
  "durationMinutes": 45,
  "totalQuestions": 30,
  "totalMarks": 30,
  "passingScore": 60
}
```

### GET `/assessments`
Returns assessments.

### GET `/assessments/:assessmentId`
Returns assessment information. Correct answers must never be returned.

### POST `/assessments/:assessmentId/start`
Starts an assessment attempt.

Response:

```json
{
  "success": true,
  "data": {
    "attemptId": "ATTEMPT_ID",
    "startedAt": "2026-10-06T10:00:00Z",
    "durationMinutes": 45
  }
}
```

### POST `/assessments/:assessmentId/submit`

```json
{
  "attemptId": "ATTEMPT_ID",
  "answers": [
    {
      "questionId": "QUESTION_ID",
      "selectedOption": "B"
    }
  ]
}
```

### GET `/assessments/:assessmentId/results`
Returns authorized assessment results.

### GET `/students/me/assessments`
Returns assessment history.

## 9. AI Interview APIs

### POST `/interviews/start`

```json
{
  "driveId": "DRIVE_ID",
  "interviewType": "technical"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "sessionId": "SESSION_ID",
    "firstQuestion": {
      "questionId": "QUESTION_ID",
      "questionText": "Explain the difference between..."
    }
  }
}
```

### POST `/interviews/:sessionId/response`

```json
{
  "questionId": "QUESTION_ID",
  "responseText": "Candidate answer...",
  "responseDurationSeconds": 45
}
```

### POST `/interviews/:sessionId/next-question`

Generates/selects the next interview question.

### POST `/interviews/:sessionId/end`
Ends the interview.

### GET `/interviews/:sessionId/result`
Returns interview evaluation.

Example:

```json
{
  "success": true,
  "data": {
    "overallScore": 76,
    "technicalScore": 80,
    "communicationScore": 72,
    "confidenceScore": 75,
    "relevanceScore": 78,
    "feedback": "..."
  }
}
```

### GET `/students/me/interviews`
Returns interview history.

## 10. Proctoring APIs

### POST `/proctoring/start`

```json
{
  "sessionType": "assessment",
  "assessmentAttemptId": "ATTEMPT_ID"
}
```

### POST `/proctoring/:sessionId/event`

```json
{
  "eventType": "phone_detected",
  "confidence": 0.94,
  "severity": "high",
  "timestamp": "2026-10-06T10:15:00Z"
}
```

### GET `/proctoring/:sessionId/events`
Returns authorized proctoring events.

### POST `/proctoring/:sessionId/end`
Ends a proctoring session.

### GET `/proctoring/:sessionId/summary`

```json
{
  "success": true,
  "data": {
    "totalEvents": 4,
    "riskScore": 62,
    "riskLevel": "medium"
  }
}
```

## 11. Resume APIs

### POST `/resumes/upload`

Content type:

```text
multipart/form-data
```

Field:

```text
file
```

### GET `/students/me/resumes`
Returns resume history.

### GET `/resumes/:resumeId`
Returns resume metadata.

### PUT `/resumes/:resumeId/activate`
Sets active resume.

### POST `/resumes/:resumeId/analyze`
Analyzes the resume.

Example response:

```json
{
  "success": true,
  "data": {
    "skills": ["Python", "Machine Learning", "MongoDB"],
    "projects": [],
    "profileStrength": 78
  }
}
```

## 12. Skill APIs

### GET `/skills`
Returns available skills.

### POST `/skills`
Creates a skill. Admin/placement officer.

### GET `/students/me/skills`
Returns student's skill profile.

### PUT `/students/me/skills/:skillId`
Updates a student's skill information.

## 13. Readiness APIs

This is a core CampusPulse module.

### GET `/students/me/readiness/:driveId`
Returns readiness for a specific company drive.

Example:

```json
{
  "success": true,
  "data": {
    "overallScore": 78,
    "readinessLevel": "moderate",
    "stageScores": [
      {
        "stageName": "Aptitude",
        "score": 84
      },
      {
        "stageName": "Technical",
        "score": 72
      },
      {
        "stageName": "Interview",
        "score": 76
      }
    ],
    "riskFactors": ["Data Structures", "Communication"]
  }
}
```

### POST `/readiness/calculate`

```json
{
  "studentId": "STUDENT_ID",
  "driveId": "DRIVE_ID"
}
```

Processing:

```text
Profile
+
Resume
+
Skills
+
Assessment Results
+
Interview Results
+
Company Requirements
        ↓
Readiness Engine
        ↓
Readiness Score
```

### GET `/readiness/:driveId/students`
Returns drive-level readiness information.

### GET `/readiness/:driveId/at-risk`
Returns students identified as at risk.

## 14. Skill Gap APIs

### GET `/students/me/skill-gaps/:driveId`
Returns the student's skill gaps.

Example:

```json
{
  "success": true,
  "data": [
    {
      "skill": "Data Structures",
      "currentScore": 58,
      "requiredScore": 75,
      "gapScore": 17,
      "priority": "high"
    }
  ]
}
```

### GET `/skill-gaps/:driveId/students`
Returns drive-level skill-gap analytics.

## 15. Recommendation APIs

### GET `/students/me/recommendations`
Returns personalized recommendations.

### POST `/recommendations/generate`

```json
{
  "studentId": "STUDENT_ID",
  "driveId": "DRIVE_ID"
}
```

### PUT `/recommendations/:recommendationId/status`

```json
{
  "status": "completed"
}
```

## 16. Workshop APIs

### POST `/workshops`
Creates an intervention workshop.

### GET `/workshops`
Returns workshops.

### GET `/workshops/:workshopId`
Returns workshop details.

### POST `/workshops/:workshopId/register`
Registers a student.

### PUT `/workshops/:workshopId`
Updates workshop details.

### POST `/workshops/:workshopId/attendance`
Records attendance.

## 17. Notification APIs

### GET `/notifications`
Returns notifications.

### PUT `/notifications/:notificationId/read`
Marks a notification as read.

### PUT `/notifications/read-all`
Marks all notifications as read.

## 18. Placement Dashboard APIs

### GET `/dashboard/overview`

Example:

```json
{
  "success": true,
  "data": {
    "totalStudents": 850,
    "activeDrives": 5,
    "readyStudents": 420,
    "moderateStudents": 280,
    "atRiskStudents": 150
  }
}
```

### GET `/dashboard/drive/:driveId`
Returns company-drive analytics.

### GET `/dashboard/drive/:driveId/skill-gaps`
Returns aggregated skill gaps.

### GET `/dashboard/drive/:driveId/interventions`
Returns intervention requirements.

## 19. Student Dashboard API

### GET `/students/me/dashboard`

Returns the data required by the student dashboard.

```json
{
  "success": true,
  "data": {
    "profileCompletion": 90,
    "overallReadiness": 78,
    "activeDrives": [],
    "recentAssessments": [],
    "recentInterviews": [],
    "skillGaps": [],
    "recommendations": [],
    "notifications": []
  }
}
```

The frontend should use this endpoint rather than making unnecessary requests for every dashboard component.

## 20. File Upload Rules

Allowed resume formats:

```text
.pdf
.doc
.docx
```

The API must:
- Validate MIME type.
- Validate extension.
- Enforce file-size limits.
- Rename files safely.
- Store files outside the application server where possible.
- Store only file metadata/reference in MongoDB.
- Prevent executable uploads.

## 21. Authentication Middleware

```text
Request
   ↓
Authentication Middleware
   ↓
Validate Token
   ↓
Identify User
   ↓
Authorization Middleware
   ↓
Controller
```

Recommended middleware:

```text
authenticate()
authorize("student")
```

## 22. Role-Based Authorization

### Student

Can access only their own:
- Profile
- Assessments
- Interviews
- Proctoring records
- Resumes
- Readiness
- Recommendations
- Workshops

### Placement Officer

Can access:
- Drives
- Placement dashboard
- Readiness analytics
- Skill gaps
- Workshops
- Intervention analytics
- Authorized student information

### Admin

Can manage system-level resources.

## 23. Pagination

Large endpoints must support:

```text
?page=1&limit=20
```

Response:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## 24. API Validation

Validate:
- Required fields
- Email format
- Phone format
- URL format
- ObjectId format
- Numeric ranges
- Enum values
- Password strength
- File type
- File size

## 25. API Security

The API must implement:
- Authentication
- Role-based authorization
- Password hashing
- Rate limiting
- CORS configuration
- Input validation
- Request sanitization
- Secure HTTP headers
- Error handling
- Audit logging
- File upload validation

Never return:

```text
passwordHash
JWT secret
API keys
database credentials
internal stack traces
```

## 26. Error Handling

All errors must use a consistent format:

```json
{
  "success": false,
  "message": "Student profile not found",
  "error": {
    "code": "STUDENT_NOT_FOUND"
  }
}
```

Production responses must not expose internal stack traces.

## 27. Backend Architecture

```text
Client
  ↓
REST API
  ↓
Routes
  ↓
Middleware
  ↓
Controllers
  ↓
Services
  ↓
Models / Repository
  ↓
MongoDB
```

AI/ML processing:

```text
REST API
   ↓
AI Service
   ↓
ML Model / LLM / Computer Vision
   ↓
Result
   ↓
Service Layer
   ↓
MongoDB
   ↓
Frontend
```

## 28. API Development Rules for Antigravity

1. Read `PRD.md`.
2. Read `design.md`.
3. Read `architecture.md` when available.
4. Read `database.md`.
5. Read this `api.md`.
6. Do not create endpoints that conflict with this document.
7. Do not rename API endpoints without updating this document.
8. Do not change database field names without updating `database.md`.
9. Do not put business logic inside route files.
10. Validate all requests.
11. Protect all private endpoints.
12. Use environment variables for secrets.
13. Never expose sensitive database fields.
14. Return consistent API responses.
15. Implement centralized error handling.
16. Add tests for critical endpoints.
17. Do not create mock APIs when actual backend implementation is required.
18. Do not hardcode student, company, assessment, or readiness data.
19. Keep API contracts synchronized with the frontend.
20. Preserve the existing dashboard and UI behavior unless explicitly instructed otherwise.

## 29. Core CampusPulse Workflow

```text
Student Registration
        ↓
Student Profile
        ↓
Resume Upload
        ↓
Company Drive Selection
        ↓
Company Requirements
        ↓
Baseline Readiness
        ↓
Online Assessment
        ↓
Assessment Evaluation
        ↓
AI Interview
        ↓
Interview Evaluation
        ↓
Proctoring Analysis
        ↓
Readiness Calculation
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

## 30. API Versioning

Current version:

```text
/api/v1
```

Future breaking changes must use:

```text
/api/v2
```

Do not introduce breaking changes into `/api/v1` silently.

# 31. Workshop Intervention APIs

The workshop system is an operational intervention layer between skill-gap
detection and reassessment.

## 31.1 Skill-Gap Cohort Analytics

### GET `/workshops/cohorts/skill-gaps`

Returns aggregated skill gaps for placement officers/admins.

Query parameters:

```text
?driveId=DRIVE_ID
&skillId=SKILL_ID
&branch=CSE
&semester=7
&priority=high
&maxScore=60
```

Example response:

```json
{
  "success": true,
  "data": [
    {
      "skillId": "SKILL_DSA",
      "skillName": "Data Structures",
      "studentsAffected": 50,
      "averageCurrentScore": 54,
      "requiredScore": 75,
      "priority": "high",
      "recommendedIntervention": "workshop"
    }
  ]
}
```

## 31.2 Preview Workshop Cohort

### POST `/workshops/cohort-preview`

Placement officer/admin only.

Request:

```json
{
  "driveId": "DRIVE_ID",
  "targetSkills": ["SKILL_DSA", "SKILL_CPP"],
  "criteria": {
    "maxSkillScore": 60,
    "priority": ["high", "critical"],
    "branches": ["CSE", "IT"]
  }
}
```

Response:

```json
{
  "success": true,
  "data": {
    "eligibleCount": 50,
    "students": [],
    "averageSkillScore": 55,
    "averageReadiness": 61
  }
}
```

The API may return student identifiers and summary fields to authorized
placement staff. It must not expose unnecessary sensitive information.

## 31.3 Create Workshop

### POST `/workshops`

Request:

```json
{
  "title": "DSA + C++ Placement Bootcamp",
  "description": "College-led preparation before upcoming placement drives",
  "targetSkills": ["SKILL_DSA", "SKILL_CPP"],
  "linkedDriveIds": ["DRIVE_ID"],
  "instructor": "Placement Training Cell",
  "scheduledAt": "2026-10-18T10:00:00+05:30",
  "durationMinutes": 120,
  "mode": "classroom",
  "venue": "Lab 3",
  "capacity": 50,
  "enrollmentMode": "auto_enroll",
  "registrationOpen": true,
  "preAssessmentId": "ASSESSMENT_PRE",
  "postAssessmentId": "ASSESSMENT_POST",
  "targetingCriteria": {
    "maxSkillScore": 60,
    "priority": ["high", "critical"],
    "branches": ["CSE", "IT"]
  }
}
```

## 31.4 List Workshops

### GET `/workshops`

Supports:

```text
?status=published
&skillId=SKILL_DSA
&driveId=DRIVE_ID
&page=1
&limit=20
```

Students receive only workshops they are eligible to view.

## 31.5 Workshop Detail

### GET `/workshops/:workshopId`

Returns workshop metadata, eligibility, enrollment status and capacity.

For students, return only their own enrollment information.

## 31.6 Update Workshop

### PUT `/workshops/:workshopId`

Placement officer/admin only.

Allows changes to:

- title
- description
- target skills
- linked drives
- instructor
- schedule
- duration
- mode
- venue/meeting link
- capacity
- registration status
- targeting criteria
- assessments

## 31.7 Publish Workshop

### POST `/workshops/:workshopId/publish`

Publishes the workshop and, when `enrollmentMode=auto_enroll`, creates
enrollments for the computed eligible cohort.

## 31.8 Register Student

### POST `/workshops/:workshopId/register`

Student self-registration.

Rules:

- authenticated student required;
- student must be eligible unless staff override is used;
- duplicate registration returns `409`;
- capacity must be enforced;
- registration creates one enrollment.

## 31.9 Auto-Enroll Cohort

### POST `/workshops/:workshopId/auto-enroll`

Placement officer/admin only.

The service evaluates the workshop targeting criteria and creates
enrollments for eligible students.

The operation must be idempotent.

## 31.10 Workshop Enrollment List

### GET `/workshops/:workshopId/enrollments`

Placement officer/admin only.

Filters:

```text
?attendance=present
&status=registered
&branch=CSE
```

## 31.11 Attendance

### POST `/workshops/:workshopId/attendance`

Request:

```json
{
  "studentId": "STUDENT_ID",
  "status": "present",
  "checkedInAt": "2026-10-18T10:02:00+05:30"
}
```

### GET `/workshops/:workshopId/attendance`

Returns attendance analytics and authorized student rows.

## 31.12 Pre/Post Assessment

### POST `/workshops/:workshopId/pre-assessment/start`

Starts the configured pre-assessment for the authenticated student.

### POST `/workshops/:workshopId/post-assessment/start`

Starts the configured post-assessment after workshop eligibility rules are
satisfied.

### GET `/workshops/:workshopId/results`

Placement officer/admin only.

Returns:

- pre score;
- post score;
- improvement;
- threshold status;
- remaining skill gap;
- readiness before;
- readiness after.

## 31.13 Workshop Impact

### GET `/workshops/:workshopId/impact`

Example:

```json
{
  "success": true,
  "data": {
    "enrolled": 50,
    "attended": 43,
    "completed": 41,
    "attendanceRate": 86,
    "averagePreScore": 54,
    "averagePostScore": 72,
    "averageImprovement": 18,
    "studentsAboveTarget": 31,
    "studentsStillAtRisk": 12,
    "averageReadinessBefore": 61,
    "averageReadinessAfter": 73
  }
}
```

## 31.14 Recalculate Readiness After Intervention

### POST `/workshops/:workshopId/recalculate-readiness`

For each eligible completed participant:

```text
Workshop Result
      ↓
Updated Skill Score
      ↓
Skill Gap Recalculation
      ↓
Company Readiness Recalculation
      ↓
Recommendation Refresh
```

The operation should be auditable and idempotent for the same assessment
result/model version.

## 31.15 Student Workshop Dashboard

### GET `/students/me/workshops`

Returns:

- assigned workshops;
- registered workshops;
- upcoming workshops;
- attendance;
- assessment status;
- improvement;
- next action.

## 31.16 Student Workshop Result

### GET `/students/me/workshops/:workshopId/result`

Returns only the authenticated student's result.

## 31.17 Notifications

Workshop events should use the existing notification API:

- assignment;
- registration;
- reminder;
- schedule change;
- cancellation;
- assessment available;
- result available.

## 31.18 Authorization

Student:
- view eligible workshops;
- register;
- view own enrollment;
- view own attendance;
- take own assessments;
- view own workshop result.

Placement Officer:
- create/edit/publish workshops;
- preview cohorts;
- auto-enroll;
- manage enrollment;
- record attendance;
- view cohort impact;
- trigger reassessment/readiness recalculation.

Admin:
- all placement-officer capabilities plus configuration/audit access.

## 31.19 Workshop API workflow

```text
GET skill-gap cohorts
        ↓
POST cohort-preview
        ↓
POST workshop
        ↓
POST workshop/publish
        ↓
Auto-enroll / Student register
        ↓
Attendance
        ↓
Pre/Post assessment
        ↓
GET impact
        ↓
POST recalculate-readiness
        ↓
Updated readiness + recommendations
```
