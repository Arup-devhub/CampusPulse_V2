# CampusPulse — Product Requirements Document (PRD)

**Version:** 2.0  
**Status:** Development Specification — Workshop Intervention Expansion  
**Product:** AI-Powered Student Placement Readiness & Intervention Platform

## 01. Product Overview

CampusPulse is an AI-powered placement management and readiness platform
for students, placement officers, colleges, and recruiters.

Unlike a traditional placement portal that mainly manages applications
and drives, CampusPulse continuously measures **student readiness for a
specific company**, identifies skill gaps and recruitment-stage risks,
recommends interventions, and reassesses progress.

### Core loop
`Assess → Analyze → Identify Gaps → Recommend Intervention → Practice/Workshop → Reassess → Improve Readiness`
### Core modules

-   Student Management
-   Certification Management
-   Assessment Management
-   Company & Job Description Management
-   Placement Drive Management
-   Student--Company Readiness
-   Skill Gap Detection
-   Recommendation Engine
-   AI Online Assessment
-   AI Online Interview
-   AI Proctoring
-   JD-Based Resume Generator
-   Resume Sender
-   Analytics & Reports
-   Authentication & Authorization

------------------------------------------------------------------------

## 02. Problem Statement

Traditional college placement systems mainly track students,
eligibility, applications, drives and selections. They generally do not
answer:

-   Which student is ready for a specific company?
-   Which recruitment stage is the student likely to struggle with?
-   What skills are missing?
-   Why is the student not ready?
-   Which students require immediate intervention?
-   What intervention should be conducted?
-   Did the intervention improve readiness?

CampusPulse addresses this gap by combining student profiles, academic
records, skills, certifications, projects, resumes, company
requirements, assessments, interviews and historical performance into an
actionable readiness system.

------------------------------------------------------------------------

## 03. Goals & Objectives

### Primary goals

-   Centralize placement and student-readiness data.
-   Calculate company-specific readiness.
-   Detect skill gaps.
-   Identify at-risk students.
-   Recommend personalized preparation.
-   Automate repetitive placement workflows.
-   Provide AI-assisted assessments and interviews.
-   Provide AI-assisted proctoring.
-   Generate resumes tailored to job descriptions.
-   Enable data-driven placement-cell decisions.

### Student goals

-   Understand readiness.
-   Identify weaknesses.
-   Receive personalized preparation.
-   Practice company-specific assessments.
-   Complete AI interviews.
-   Improve resumes.
-   Track readiness over time.

### Placement-cell goals

-   Identify students requiring intervention.
-   Group students by skill gaps.
-   Monitor company-wise readiness.
-   Conduct targeted workshops.
-   Track improvement and placement outcomes.

### Recruiter goals

-   Define hiring requirements.
-   Publish JDs and placement drives.
-   Find relevant candidates.
-   Shortlist candidates.
-   Conduct assessments/interviews.
-   Evaluate candidates.

------------------------------------------------------------------------

## 04. Target Users

### Student

Maintains profile, skills, certifications, projects and resume;
participates in drives, assessments and interviews; views readiness,
skill gaps and recommendations.

### Placement Officer / College Admin

Manages students, companies, drives, assessments, interviews,
interventions, analytics and reports.

### Recruiter

Manages company/JD information, candidates, shortlisting, assessments,
interviews and evaluations.

### Super Admin

Manages organizations, users, roles, permissions, configuration and
audit information.

------------------------------------------------------------------------

## 05. User Personas

### Persona 1 --- Student

**Needs:** clear readiness, company-specific preparation, skill-gap
information, resume support.

**Pain points:** generic preparation, unclear rejection reasons,
fragmented information.

### Persona 2 --- Placement Officer

**Needs:** centralized student data, risk identification, readiness
analytics, intervention recommendations.

**Pain points:** manual tracking, large student population, fragmented
records.

### Persona 3 --- Recruiter

**Needs:** relevant candidates, eligibility filtering, ranking,
assessment/interview data.

**Pain points:** large candidate pools and manual shortlisting.

------------------------------------------------------------------------

## 06. User Journey / Workflow

### Student

`Register/Login → Complete Profile → Add Education/Skills/Certifications/Projects → Resume → Select Company → Eligibility → Readiness → Skill Gaps → Recommendations → Assessment → Proctoring → AI Interview → Analysis → Recalculation → Placement Drive`

### Placement Officer

`Login → Dashboard → Manage Company → Create Drive → Configure Eligibility/Stages → Calculate Readiness → Identify At-Risk Students → Review Gaps → Intervention → Reassess → Track Improvement → Placement Outcome`

### Recruiter

`Login → Company Profile → JD/Drive → Eligibility → Matching Candidates → Shortlist → Assessment → Interview → Evaluation → Selection`

------------------------------------------------------------------------

## 07. Functional Requirements

### FR-01 Authentication

-   Register
-   Login/logout
-   Password management
-   Verification where configured
-   JWT/session management
-   Role-based access

### FR-02 Student Management

Store:

-   Name, email, phone, username
-   GitHub and LinkedIn
-   College, degree, branch, semester
-   CGPA and backlog history
-   Skills
-   Projects
-   Certifications
-   Resume
-   Assessment history
-   Interview history
-   Placement history

### FR-03 Certification Management

-   Add certification
-   Issuing organization
-   Credential URL
-   Issue/expiry date
-   Upload certificate
-   Verification status
-   Skill association

### FR-04 Assessment Management

-   Create assessment
-   Question bank
-   Aptitude/technical/company-specific tests
-   Difficulty
-   Duration
-   Scheduling
-   Evaluation
-   Results
-   Candidate monitoring

### FR-05 Company Management

Store:

-   Company name
-   Industry
-   Website
-   Description
-   Roles
-   Job descriptions
-   Required/preferred skills
-   Eligibility
-   CGPA/branch/backlog requirements
-   Package
-   Location
-   Recruitment stages

### FR-06 Placement Drives

-   Create/edit/publish/close drive
-   Eligibility configuration
-   Applications
-   Recruitment stages
-   Drive calendar
-   Candidate shortlisting
-   Selection and offer tracking

### FR-07 Student--Company Readiness

Calculate:

-   Overall readiness
-   Stage-wise readiness
-   Risk level
-   Skill match
-   Academic eligibility
-   Certification relevance
-   Project relevance
-   Resume/JD similarity
-   Aptitude/technical/interview performance
-   Improvement recommendations

Example:

``` text
Company: TCS
Overall Readiness: 68%
Aptitude: 82%
Technical: 61%
Coding: 55%
Interview: 74%
Risk: Medium
Gaps: DSA, SQL, Problem Solving
```

### FR-08 Skill Gap

Compare:

`Student Skills VS Company/JD Required Skills`

Identify:

-   Missing skills
-   Weak skills
-   Strong skills
-   Priority
-   Skill-match percentage

### FR-09 Recommendation Engine

Recommend:

-   Learning resources
-   Practice assessments
-   Mock interviews
-   Workshops
-   Skill-specific tasks
-   Resume improvements

Prioritize recommendations using company requirements, skill importance,
student weakness and recruitment-stage importance.

### FR-10 AI Online Assessment

-   AI-assisted question generation
-   Question bank
-   Difficulty levels
-   Timed assessment
-   Auto evaluation
-   Results
-   Performance analytics
-   Candidate monitoring
-   Suspicious-event detection

### FR-11 AI Online Interview

-   Technical/behavioral questions
-   Company-specific questions
-   Video/audio session
-   Candidate responses
-   AI-assisted analysis
-   Interview scoring
-   Feedback

### FR-12 AI Proctoring

Potential signals:

-   Face/candidate presence
-   Multiple people
-   Phone/device presence
-   Looking-away events
-   Candidate absence
-   Camera/microphone status
-   Suspicious activity

Store event type, timestamp, confidence and evidence reference where
permitted. Proctoring is a probabilistic decision-support signal, not
automatic proof of misconduct.

### FR-13 Resume Generator

`JD → Requirement Extraction → Student Profile Matching → Resume Generation → Validation → Review`

The system must never fabricate qualifications, projects, certifications
or achievements.

### FR-14 Resume Sender

-   Download
-   Share
-   Supported email delivery
-   Recruiter communication
-   Delivery status where supported

### FR-15 Dashboard

Show:

-   Total students
-   Placement-ready students
-   Active drives
-   Offers made
-   Offers accepted
-   Placement trends
-   Branch-wise conversion
-   Package trends
-   Students at risk
-   Recruiter pipeline
-   Documentation pending
-   Recent activities

### FR-16 Reports

-   Student reports
-   Company reports
-   Placement reports
-   Assessment reports
-   Interview reports
-   Readiness reports
-   Skill-gap reports
-   Risk reports

------------------------------------------------------------------------

## 08. Non-Functional Requirements

### Usability

-   Professional, clean and user-friendly UI
-   Responsive design
-   Clear navigation
-   Accessible components
-   Consistent visual language

### Reliability

-   Graceful API failure handling
-   Database error handling
-   Retry where appropriate
-   No loss of assessment submissions

### Scalability

Architecture must support increasing students, companies, assessments,
concurrent assessments/interviews and AI requests.

### Maintainability

-   Modular backend
-   Modular frontend
-   Reusable components
-   Clear API contracts
-   Environment-based configuration
-   Version control

### Accessibility

-   Keyboard accessibility
-   Good contrast
-   Semantic components
-   Responsive layout

------------------------------------------------------------------------

## 09. Feature Specifications

### Student Profile

**Identity:** name, email, phone, username, GitHub, LinkedIn.

**Academic:** college, degree, branch, semester, CGPA, backlogs.

**Professional:** skills, projects, certifications, experience, resume.

### Company Profile

-   Company name
-   Industry
-   Website
-   Description
-   Roles
-   Required/preferred skills
-   Eligibility
-   Package
-   Location
-   Recruitment stages

### Readiness Dashboard

Display:

-   Overall readiness
-   Readiness category
-   Stage-wise scores
-   Skill gaps
-   Risk
-   Recommended actions
-   Progress over time

### Intervention

Admins can:

-   Filter at-risk students
-   Group students by gap
-   Create intervention groups
-   Assign assessments
-   Recommend workshops
-   Reassess
-   Compare before/after readiness

------------------------------------------------------------------------

## 10. AI/ML Requirements

### 10.1 Student Model + API

Represent a normalized student profile using:

-   Academic data
-   Skills
-   Certifications
-   Projects
-   Assessments
-   Interviews
-   Resume information

### 10.2 Certification Model + API

Capabilities:

-   Certification categorization
-   Skill association
-   Relevance scoring
-   Verification status
-   Credential metadata

### 10.3 Assessment Model

Inputs:

-   Questions
-   Answers
-   Time
-   Difficulty
-   Topic
-   Score

Outputs:

-   Score
-   Topic performance
-   Accuracy
-   Time efficiency
-   Weak/strong topics

### 10.4 Company Model + API

Convert company/JD information into:

-   Company profile
-   Required skills
-   Preferred skills
-   Eligibility
-   Recruitment stages
-   Skill importance

### 10.5 Student--Company Readiness Model

Architecture:

`Student Profile + Company Requirements + Assessment + Interview + Skill Gap → Readiness Model → Score + Risk + Stage Readiness`

MVP should use a transparent weighted scoring model. ML prediction
should be introduced after sufficient historical placement data is
available.

### 10.6 Skill Gap Model

Inputs: student skills, company skills, JD, assessments, interviews.

Outputs: missing skills, weak skills, priority and skill-gap score.

### 10.7 Recommendation Engine

`Skill Gap → Priority → Recommendation → Learning/Assessment/Interview/Workshop`

### 10.8 AI Assessment Model

Potential capabilities:

-   Question generation
-   Difficulty classification
-   Topic classification
-   Answer evaluation
-   Performance analysis
-   Adaptive question selection

AI-generated questions must be validated before high-stakes use.

### 10.9 AI Interview Model

Potential capabilities:

-   Question selection
-   Follow-up questions
-   Transcription
-   Technical answer evaluation
-   Communication analysis
-   Interview scoring
-   Feedback

Avoid unsupported judgments about personality or protected
characteristics.

### 10.10 Proctoring Model

Potential computer-vision capabilities:

-   Person detection
-   Face detection
-   Multiple-person detection
-   Phone detection
-   Candidate absence
-   Looking-away/suspicious-event detection

### 10.11 Resume/JD Model

`JD → Requirement Extraction → Skill Extraction → Student Matching → Relevant Verified Data → Resume → Validation`

------------------------------------------------------------------------

## 11. Database Requirements

**Database:** MongoDB Atlas

### Core collections

``` text
users
students
certifications
skills
projects
companies
job_descriptions
placement_drives
applications
assessments
assessment_questions
assessment_attempts
assessment_results
interviews
interview_sessions
interview_results
proctoring_events
readiness_scores
skill_gaps
recommendations
resumes
resume_versions
notifications
documents
reports
audit_logs
```

### Logical relationship

``` text
Student + Company → Readiness Record
Readiness Record → Score + Risk + Stage Scores + Skill Gaps + Recommendations
```

Use embedding or references based on query patterns and scale.

------------------------------------------------------------------------

## 12. API Requirements

### Backend

-   Node.js
-   Express.js
-   REST API
-   MongoDB Atlas
-   JSON
-   `/api/v1` versioning

### Authentication

``` http
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/refresh
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
```

### Student

``` http
GET    /api/v1/students
GET    /api/v1/students/:id
POST   /api/v1/students
PATCH  /api/v1/students/:id
DELETE /api/v1/students/:id
GET    /api/v1/students/:id/readiness
GET    /api/v1/students/:id/skill-gaps
```

### Certification

``` http
GET    /api/v1/certifications
POST   /api/v1/certifications
GET    /api/v1/certifications/:id
PATCH  /api/v1/certifications/:id
DELETE /api/v1/certifications/:id
```

### Company

``` http
GET    /api/v1/companies
POST   /api/v1/companies
GET    /api/v1/companies/:id
PATCH  /api/v1/companies/:id
DELETE /api/v1/companies/:id
```

### Placement Drives

``` http
GET    /api/v1/drives
POST   /api/v1/drives
GET    /api/v1/drives/:id
PATCH  /api/v1/drives/:id
DELETE /api/v1/drives/:id
POST   /api/v1/drives/:id/apply
GET    /api/v1/drives/:id/candidates
```

### Assessments

``` http
GET  /api/v1/assessments
POST /api/v1/assessments
GET  /api/v1/assessments/:id
POST /api/v1/assessments/:id/start
POST /api/v1/assessments/:id/submit
GET  /api/v1/assessments/:id/results
```

### Interviews

``` http
GET  /api/v1/interviews
POST /api/v1/interviews
GET  /api/v1/interviews/:id
POST /api/v1/interviews/:id/start
POST /api/v1/interviews/:id/response
POST /api/v1/interviews/:id/complete
GET  /api/v1/interviews/:id/result
```

### Readiness

``` http
GET  /api/v1/readiness/student/:studentId/company/:companyId
POST /api/v1/readiness/calculate
GET  /api/v1/readiness/at-risk
GET  /api/v1/readiness/company/:companyId
```

### Skill Gap

``` http
GET  /api/v1/skill-gaps/student/:studentId
POST /api/v1/skill-gaps/analyze
GET  /api/v1/skill-gaps/company/:companyId
```

### Recommendations

``` http
GET   /api/v1/recommendations/student/:studentId
POST  /api/v1/recommendations/generate
PATCH /api/v1/recommendations/:id
```

### Resume

``` http
POST /api/v1/resumes/generate
GET  /api/v1/resumes/:id
PATCH /api/v1/resumes/:id
POST /api/v1/resumes/:id/send
GET  /api/v1/resumes/student/:studentId
```

### Proctoring

``` http
POST /api/v1/proctoring/session
POST /api/v1/proctoring/events
GET  /api/v1/proctoring/session/:id
GET  /api/v1/proctoring/session/:id/report
```

All APIs require validation, authorization, consistent status codes,
centralized error handling and appropriate rate limiting.

------------------------------------------------------------------------

## 13. UI/UX Requirements

### Frontend stack

-   React
-   Vite
-   TypeScript
-   shadcn/ui
-   Tailwind CSS

### Design

-   Professional
-   Simple
-   User-friendly
-   Data-focused
-   Responsive
-   Accessible
-   Avoid excessive "AI-generated" visual effects

### Student screens

-   Dashboard
-   Profile
-   Companies
-   Placement Drives
-   Assessments
-   Interviews
-   Readiness
-   Skill Gaps
-   Recommendations
-   Resume
-   Notifications

### Admin screens

-   Command Dashboard
-   Students
-   Recruiters
-   Placement Drives
-   Assessments
-   Interviews
-   AI Matching
-   Reports
-   Settings

### Recruiter screens

-   Company Dashboard
-   Job Descriptions
-   Candidates
-   Shortlisting
-   Assessments
-   Interviews
-   Reports

------------------------------------------------------------------------

## 14. Authentication & Authorization

### Authentication

-   JWT-based authentication
-   Access token
-   Refresh token
-   Secure password hashing
-   Protected routes

### Roles

``` text
SUPER_ADMIN
PLACEMENT_ADMIN
RECRUITER
STUDENT
```

### Authorization

Every protected API must verify:

1.  Authentication
2.  Role
3.  Resource access
4.  Required permission

Students must not access other students' private data. Recruiters must
only access data permitted for their company/drive.

------------------------------------------------------------------------

## 15. Integrations

Potential integrations:

### AI/LLM

-   Resume generation
-   JD analysis
-   Interview questions
-   Interview analysis
-   Recommendations

### Computer Vision

-   Proctoring
-   Person detection
-   Phone detection
-   Multiple-person detection

### Email

-   Notifications
-   Resume delivery
-   Assessment invitations
-   Interview invitations

### File Storage

-   Resumes
-   Certificates
-   Profile images
-   Assessment assets

### Future

-   College ERP
-   LMS
-   GitHub
-   LinkedIn
-   Calendar
-   Video conferencing
-   External assessment platforms

------------------------------------------------------------------------

## 16. Edge Cases & Error Handling

### Authentication

-   Invalid credentials
-   Duplicate email/username
-   Expired token
-   Weak password
-   Unauthorized role

### Student

-   Missing academic data
-   Invalid CGPA
-   Duplicate certification
-   Invalid URLs
-   Missing resume

### Assessment

-   Network interruption
-   Browser refresh
-   Timer expiration
-   Camera/microphone unavailable
-   Submission failure
-   Duplicate submission

### Interview

-   Camera failure
-   Microphone failure
-   Connection loss
-   Candidate disconnect
-   AI service unavailable

### Proctoring

-   False positives
-   Poor lighting
-   Accidental multiple-person detection
-   False phone detection
-   Permission denied

### AI

-   Timeout
-   Invalid model output
-   Hallucinated resume data
-   Malformed response
-   Rate limit
-   Model unavailable

The system must fail safely and preserve user data.

------------------------------------------------------------------------

## 17. Security & Privacy

### Security

-   HTTPS
-   Password hashing
-   JWT security
-   Input validation
-   Rate limiting
-   CORS
-   Security headers
-   Authorization middleware
-   MongoDB access controls
-   Environment variables for secrets
-   Audit logs

### Privacy

Only authorized users may access student data.

Proctoring and assessment data must have defined retention rules.
Camera/microphone access requires appropriate consent.

AI providers should only receive student data when permitted by the
platform's privacy policy and integration design.

------------------------------------------------------------------------

## 18. Performance Requirements

### API

Target typical API response: **\<500 ms under normal load**.

Long-running AI/analytics operations should be asynchronous.

### Dashboard

-   Pagination for large datasets
-   Aggregated analytics APIs
-   Optimized initial loading

### Assessment

-   Support concurrent candidates
-   Preserve submissions
-   Periodically persist answers where appropriate

### AI jobs

``` text
Request → Job Created → AI Processing → Result Stored → Frontend Result
```

------------------------------------------------------------------------

## 19. Success Metrics / KPIs

### Student

-   Readiness improvement
-   Skill-gap reduction
-   Assessment improvement
-   Interview improvement
-   Placement conversion

### Placement Cell

-   Students assessed
-   Students placement-ready
-   At-risk students identified
-   Intervention completion
-   Readiness improvement
-   Placement rate

### Recruiter

-   Candidate relevance
-   Shortlisting efficiency
-   Assessment completion
-   Interview completion
-   Hiring conversion

### Platform

-   DAU/MAU
-   API success rate
-   Assessment completion
-   Recommendation engagement
-   Resume generation count
-   AI interview completion
-   Proctoring event rate

------------------------------------------------------------------------

## 20. Technology Stack

### Frontend

``` text
React
Vite
TypeScript
shadcn/ui
Tailwind CSS
```

### Backend

``` text
Node.js
Express.js
REST API
```

### Database

``` text
MongoDB Atlas
```

### AI/ML services

``` text
Student Model
Certification Model
Assessment Model
Company Model
Readiness Model
Skill Gap Model
Recommendation Engine
AI Assessment
AI Interview
Proctoring
Resume/JD Model
```

### Architecture

``` text
React + Vite + TypeScript
          ↓
Node.js + Express.js REST API
          ↓
 ┌────────┼─────────┐
 │        │         │
Core APIs AI/ML APIs Auth APIs
 │        │         │
 └────────┼─────────┘
          ↓
     MongoDB Atlas
```

Python-based ML services may be introduced separately when required by
ML tooling, while Node.js/Express remains the primary application/API
layer.

------------------------------------------------------------------------

## 21. Development Phases

### Phase 1 --- Foundation

-   React/Vite setup
-   TypeScript
-   shadcn/ui
-   Express backend
-   MongoDB Atlas
-   Environment configuration
-   Authentication

### Phase 2 --- Core Models

-   Student
-   Certification
-   Skills
-   Projects
-   Company
-   Placement Drive

### Phase 3 --- Placement Management

-   Drives
-   Eligibility
-   Applications
-   Recruiters
-   Dashboard
-   Notifications

### Phase 4 --- Assessment

-   Assessment creation
-   Questions
-   Attempts
-   Timer
-   Evaluation
-   Results

### Phase 5 --- Readiness Intelligence

-   Student scoring
-   Company requirements
-   Student-company readiness
-   Skill gaps
-   Risk classification

### Phase 6 --- Recommendation Engine

-   Personalized preparation
-   Skill recommendations
-   Workshop recommendations
-   Reassessment

### Phase 7 --- AI Interview

-   AI interview
-   Questions
-   Responses
-   Evaluation
-   Feedback

### Phase 8 --- Proctoring

-   Camera monitoring
-   Person detection
-   Multiple-person detection
-   Phone detection
-   Suspicious events
-   Proctoring report

### Phase 9 --- Resume Intelligence

-   JD parser
-   Skill extraction
-   Resume generation
-   Customization
-   Preview
-   Sending

### Phase 10 --- Analytics

-   Reports
-   Advanced dashboards
-   Readiness trends
-   Intervention analytics
-   Performance optimization

------------------------------------------------------------------------

## 22. Testing & Acceptance Criteria

### Unit testing

Test:

-   Controllers
-   Services
-   Database operations
-   Validation
-   Authentication
-   Readiness calculations
-   Skill-gap calculations

### Integration testing

Test:

-   Frontend → API
-   API → MongoDB
-   Authentication
-   Assessment workflow
-   Interview workflow
-   Resume generation
-   Readiness pipeline

### AI/ML testing

Evaluate:

-   Readiness quality
-   Skill extraction accuracy
-   Recommendation relevance
-   Interview evaluation consistency
-   Proctoring precision/recall
-   Resume/JD matching

### Security testing

Test:

-   Unauthorized access
-   Role escalation
-   Invalid tokens
-   Injection
-   Rate limits
-   File validation
-   Data exposure

### MVP acceptance criteria

**Student** - Register/login - Complete profile - Add
skills/certifications - View eligible drives - Take assessment - View
results - View company-specific readiness - View skill gaps - Receive
recommendations - Generate JD-based resume

**Placement Officer** - Manage students - Manage companies - Create
drives - Configure eligibility - View readiness - Identify at-risk
students - View skill gaps - Manage interventions - View reports

**Recruiter** - Create company/JD - View eligible candidates - View
matching information - Shortlist candidates - Initiate
assessment/interview

**AI** - Generate readiness score - Generate skill gaps - Generate
recommendations - Conduct AI interview - Record proctoring events -
Generate verified-data-based resume

------------------------------------------------------------------------

## 23. Future Scope

### Advanced predictive placement

Predict:

-   Probability of clearing each recruitment stage
-   Selection probability
-   Expected placement outcome

### AI Placement Copilot

Students:

-   "Am I ready for Infosys?"
-   "What should I study this week?"
-   "Why is my readiness 68%?"

Placement officers:

-   "Which students need a DSA workshop?"
-   "Who is at high risk for tomorrow's drive?"

### Automated intervention planning

Automatically create:

-   Student groups
-   Workshops
-   Mock tests
-   Mock interviews
-   Learning plans

### Adaptive assessments

Dynamically adjust question difficulty according to performance.

### Advanced matching

Use:

`Resume + Skills + Projects + JD + Historical Outcomes`

### Placement digital twin

Simulate:

-   Expected placement outcomes
-   Skill shortages
-   Student readiness
-   Intervention impact

### External learning integration

Potentially integrate:

-   NPTEL
-   Coursera
-   Udemy
-   YouTube
-   College LMS

### AI Career Guidance

``` text
Student Profile
      ↓
Skills
      ↓
Career Path
      ↓
Target Companies
      ↓
Skill Gaps
      ↓
Personalized Learning
      ↓
Placement Readiness
      ↓
Career Outcome
```

------------------------------------------------------------------------

# Product Differentiator

CampusPulse is **not simply a placement management system**.

Its central intelligence is:

``` text
              COMPANY
                 ↓
       Company Requirements
                 ↓
STUDENT → READINESS ENGINE
                 ↓
       ┌─────────┼─────────┐
       ↓         ↓         ↓
     Risk    Skill Gap   Stage Risk
       └─────────┼─────────┘
                 ↓
       Recommendation Engine
                 ↓
      Personalized Intervention
                 ↓
            Reassessment
                 ↓
        Improved Readiness
                 ↓
          Placement Outcome
```

## Core Product Proposition

> **CampusPulse continuously measures a student's readiness for specific
> company placement drives, identifies the exact skill and
> recruitment-stage gaps that may prevent selection, and recommends
> targeted interventions before the placement process begins.**

------------------------------------------------------------------------

# 37. College-Led Workshop Intervention System

CampusPulse now includes a complete **College Workshop Intervention** module.
Workshops are not only generic learning events; they are targeted interventions
created from measured student skill gaps and linked to upcoming placement
drives.

### Core use case

Example:

```text
Placement Officer opens Skill Gap Analytics
                ↓
System detects:
50 students → DSA below required level
37 students → C++ below required level
                ↓
Officer creates:
"DSA + C++ Placement Bootcamp"
                ↓
Target cohort = identified students
                ↓
Students receive workshop access
                ↓
Students attend scheduled sessions
                ↓
Pre-workshop assessment
                ↓
College-led workshop
                ↓
Post-workshop assessment
                ↓
Skill scores + readiness recalculated
                ↓
Officer sees improvement / remaining gaps
                ↓
Students needing more help are assigned another intervention
```

### Workshop objectives

The module must allow the college to:

- detect common skill deficiencies across a student population;
- create a workshop around one or more missing/weak skills;
- target students automatically from skill-gap analytics;
- manually add/remove students where authorized;
- publish the workshop to selected students;
- allow eligible students to view and enroll;
- track registration and attendance;
- conduct pre-workshop and post-workshop assessments;
- compare skill scores before and after intervention;
- recalculate company-specific readiness;
- identify students who remain at risk;
- measure workshop effectiveness at cohort and student level.

### Workshop types

Supported intervention types:

- DSA / Coding
- C++
- Java / Python
- SQL / DBMS
- Aptitude
- Communication
- Technical Interview
- HR / Behavioral Interview
- Resume / Profile Building
- Company-specific Bootcamp
- Custom college workshop

### Workshop ownership

Workshops are created and managed by authorized college users:

- Placement Officer
- College Admin

Optional future support may include instructor accounts, but instructor
management is not required for the MVP.

### Workshop targeting

A workshop can target students using:

- Skill
- Skill score threshold
- Skill-gap priority
- Company drive
- Branch
- Semester
- CGPA
- Readiness range
- Risk level
- Manual student selection

Example targeting rule:

```text
Target Skill: Data Structures
Current Score: < 60
Priority: High/Critical
Target Drive: Company X
Eligible Branches: CSE, IT, ECE
```

The system should show the projected cohort size before publishing.

### Workshop lifecycle

```text
Draft
  ↓
Cohort Identified
  ↓
Published
  ↓
Registration Open
  ↓
Registration Closed
  ↓
In Progress
  ↓
Completed
  ↓
Evaluation
  ↓
Impact Measured
```

### Student workshop experience

Students should see:

- workshop title;
- why they were selected;
- target skill;
- linked company/drive, when applicable;
- instructor;
- date/time;
- duration;
- delivery mode;
- venue or meeting link;
- available seats;
- registration status;
- attendance status;
- pre-assessment status;
- post-assessment status;
- improvement score;
- updated readiness;
- next recommended action.

Example:

```text
DSA + C++ Placement Bootcamp

You have been invited because:
DSA Score: 54 / 100
Required for selected drive: 75 / 100

Date: 18 Oct
Duration: 2 hours
Mode: College Classroom
Seats: 50

[ Register ]
```

### Workshop access rules

- Only authenticated eligible students can access the registration action.
- A student cannot register twice for the same workshop.
- Capacity limits must be enforced.
- If enabled, the college may auto-enroll the target cohort.
- A placement officer may override eligibility.
- Students can see workshops assigned to them from the dashboard.
- Workshop access must not expose another student's private performance data.

### Pre/post intervention measurement

A workshop may optionally have:

```text
Pre-assessment
    ↓
Workshop
    ↓
Post-assessment
```

For each student store:

- pre-workshop skill score;
- post-workshop skill score;
- score improvement;
- pre-workshop readiness;
- post-workshop readiness;
- attendance;
- completion;
- remaining skill gap;
- next recommendation.

Example:

```text
Student A
DSA Before: 54
DSA After: 78
Improvement: +24
Readiness Before: 61%
Readiness After: 76%
Status: Gap Improved
```

### College intervention analytics

Placement officers must be able to answer:

- How many students lack DSA?
- How many lack C++?
- Which skills affect the largest number of students?
- Which upcoming drives are affected?
- How many students were assigned to a workshop?
- How many registered?
- How many attended?
- What was the average pre-workshop score?
- What was the average post-workshop score?
- How many students crossed the required threshold?
- How many students remain at risk?
- Did readiness improve after the intervention?

### Workshop effectiveness

The system should calculate, where sufficient data exists:

```text
Attendance Rate
Completion Rate
Average Skill Improvement
Average Readiness Improvement
Threshold-Cleared Count
Remaining At-Risk Count
```

These metrics are descriptive intervention analytics, not claims of causal
impact unless the college explicitly performs a suitable evaluation.

### Integration with recommendation engine

Recommendations should be able to produce:

```text
Skill Gap
   ↓
Workshop Available?
   ├── Yes → Recommend / Assign Workshop
   └── No  → Recommend Practice / Learning Resource
```

A workshop recommendation should explain:

```text
Recommended because:
- DSA is a high-priority gap
- Your score is 54
- Required score is 75
- 42 students in your cohort share this gap
- A college workshop is available before the drive
```

### Integration with placement drives

For an upcoming drive:

```text
Company Requirements
       ↓
Student Skill Gaps
       ↓
Cohort Analysis
       ↓
Intervention Workshop
       ↓
Reassessment
       ↓
Updated Drive Readiness
```

Placement officers can open a drive and see:

```text
Skill Gap             Students Affected   Workshop Needed
DSA                   50                  Yes
C++                   37                  Yes
SQL                   18                  Optional
Communication         12                  Recommended
```

### New functional requirements

#### FR-17 Workshop Management

- Create workshop
- Edit workshop
- Publish/unpublish workshop
- Cancel workshop
- Set capacity
- Set schedule
- Set instructor
- Set venue/meeting link
- Define target skills
- Link workshop to placement drive(s)
- Define targeting criteria
- View target cohort
- Manually add/remove students

#### FR-18 Workshop Enrollment & Access

- Auto-enroll eligible students where configured
- Student self-registration where enabled
- Prevent duplicate enrollment
- Enforce capacity
- Maintain waitlist where enabled
- Show enrollment status
- Send notifications

#### FR-19 Workshop Attendance

- Mark present/absent
- Record attendance timestamp
- Support college-controlled attendance
- Show attendance summary
- Track completion

#### FR-20 Workshop Assessment & Impact

- Attach pre-assessment
- Attach post-assessment
- Record scores
- Compare before/after
- Recalculate skill gaps
- Recalculate readiness
- Update recommendations
- Produce intervention report

#### FR-21 Cohort Skill-Gap Analytics

- Aggregate skill gaps across students
- Rank skills by affected student count
- Filter by upcoming company drive
- Filter by branch/semester
- Show risk distribution
- Show recommended intervention size

### Acceptance criteria

The feature is complete when the following scenario works end-to-end:

```text
50 students have DSA score < 60
             ↓
Placement Officer sees "50 students need DSA intervention"
             ↓
Officer creates "DSA + C++ Placement Workshop"
             ↓
System identifies eligible students
             ↓
Students receive notification
             ↓
Students register / are auto-enrolled
             ↓
Attendance is recorded
             ↓
Pre/post assessments are completed
             ↓
Skill scores are updated
             ↓
Readiness is recalculated
             ↓
Officer sees how many students crossed the target threshold
```

### Product differentiator update

CampusPulse therefore closes the operational loop:

```text
Measure
   ↓
Detect
   ↓
Group
   ↓
Intervene
   ↓
Train
   ↓
Reassess
   ↓
Measure Improvement
   ↓
Prepare for Drive
```

This makes the placement platform useful not only for tracking placement
activity, but also for helping the college actively prepare students before
a company recruitment process.
