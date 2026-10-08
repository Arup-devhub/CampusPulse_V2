# CampusPulse — Test Specification

**Version:** 1.0  
**Scope:** MVP + Workshop Intervention Expansion

## 1. Test priorities

Critical paths:
1. Authentication/RBAC
2. Student-company readiness
3. Skill-gap detection
4. Recommendation engine
5. Workshop cohort targeting
6. Workshop registration/capacity
7. Attendance
8. Pre/post assessment
9. Readiness recalculation
10. Workshop impact report
11. AI output validation
12. Privacy/security

## 2. Unit tests
### Authentication and validation

- Reject invalid email.
- Reject weak password.
- Reject duplicate email.
- Reject duplicate username.
- Never return `passwordHash`.
- Reject malformed ObjectId.
- Reject invalid enum values.
- Enforce numeric ranges.
- Validate upload file type and size.
- Verify role middleware.
- Verify resource-level authorization.

### Readiness

- Calculate deterministic component scores from supplied inputs.
- Produce stable results for identical inputs and model/config version.
- Return component/stage scores and risk classification.
- Preserve previous snapshot if recalculation fails.
- Store a versioned snapshot.
- Do not call an LLM to decide readiness when deterministic inputs are available.

### Skill gap

- Identify missing skill.
- Identify weak skill.
- Identify strong skill.
- Calculate required-vs-current gap.
- Preserve required score and current score.
- Rank priorities from configured importance/weakness/stage importance.
- Normalize equivalent skill names before comparison when an LLM normalization step is enabled.
- Ensure normalization cannot directly enroll a student.

### Recommendation

- Prioritize high-importance/high-weakness gaps.
- Recommend workshop when an applicable workshop exists.
- Otherwise recommend practice/resource/interview actions.
- Include explainable recommendation reasons.
- Do not recommend an unavailable/cancelled workshop.

## 3. Workshop state-machine tests

Valid lifecycle:

```text
draft
  → published
  → registration_closed
  → in_progress
  → completed
```

Cancellation may occur according to business rules.

Test:

- Draft cannot accept registration.
- Published workshop can accept registration when registration is open.
- Registration can close.
- Cancelled workshop cannot accept new registration.
- Completed workshop cannot accept new registration.
- Invalid lifecycle transitions are rejected.
- Publish requires required workshop fields.
- Capacity must be positive.
- Targeting rules must validate before cohort resolution.

## 4. Cohort targeting tests

Seed:

```text
50 students with DSA score < 60
37 students with C++ score below target
18 students with SQL gap
12 students with communication gap
```

Verify:

- DSA cohort returns 50.
- C++ cohort returns 37.
- Branch filter works.
- Semester filter works.
- Risk filter works.
- Explicit student IDs can be included when authorized.
- Manual add/remove works only for authorized placement staff.
- Each selected student receives a selection-reason snapshot.
- Cohort preview does not mutate final enrollment.
- Frozen cohort does not silently change because later student scores change.
- LLM is never the source of truth for cohort membership.
- Cross-college students cannot enter the cohort.

## 5. Enrollment and capacity tests

### Duplicate registration

Attempt two registrations for the same student/workshop.

Expected:

```text
first request → success
second request → 409 conflict
```

### Capacity race

For a workshop with capacity 50, submit more than 50 concurrent registrations.

Expected:

```text
at most 50 registered/occupied seats
remaining eligible students → waitlist or rejected according to configuration
```

Use an atomic database operation/transaction strategy plus a unique `(workshopId, studentId)` constraint.

### Cancellation and waitlist

- Cancel a registered seat.
- Verify seat becomes available according to policy.
- Verify waitlisted student promotion if waitlisting is enabled.
- Verify duplicate promotion cannot occur.

## 6. Attendance tests

- Placement officer can mark attendance.
- Student cannot mark attendance for another student.
- Attendance timestamp is stored.
- Duplicate attendance update follows defined idempotent behavior.
- Attendance summary matches enrollment rows.
- `present`, `partial`, `absent`, `pending` values are validated.

## 7. Pre/post assessment tests

- Only eligible authenticated students can start their own pre-assessment.
- Post-assessment cannot start before the configured eligibility condition.
- Assessment attempts are linked to the workshop enrollment.
- Pre score is stored.
- Post score is stored.
- Skill improvement equals post minus pre under the configured scoring convention.
- Assessment results cannot expose correct answers before submission.
- Duplicate final submission is prevented.
- Network interruption/autosave does not lose an in-progress attempt.

## 8. Readiness recalculation tests

Given:

```text
DSA before = 54
DSA after  = 78
Readiness before = 61
```

Verify:

```text
skill improvement = +24
readiness before = 61
readiness after = recalculated deterministic result
remaining gap = required score - post score, bounded according to implementation
threshold status = crossed when post score >= required score
```

Also verify:

- only eligible completed participants are recalculated;
- operation is auditable;
- repeated recalculation for the same assessment/model version is idempotent;
- old snapshots remain available for comparison;
- recommendations refresh after recalculation.

## 9. Workshop impact tests

For a workshop with:

```text
enrolled = 50
attended = 43
completed = 41
averagePreScore = 54
averagePostScore = 72
studentsAboveTarget = 31
studentsStillAtRisk = 12
averageReadinessBefore = 61
averageReadinessAfter = 73
```

Verify the API returns consistent descriptive metrics.

Verify:

```text
attendanceRate = attended / enrolled × 100
completionRate = completed / enrolled × 100
averageImprovement = averagePostScore - averagePreScore
```

Do not label these metrics as causal impact.

## 10. API integration tests

### Auth

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
POST /api/v1/auth/logout
```

Test success, validation errors, unauthorized access and duplicate accounts.

### Workshop workflow

```text
GET  /api/v1/skill-gaps/cohorts
POST /api/v1/workshops/:id/cohort-preview
POST /api/v1/workshops
POST /api/v1/workshops/:id/publish
POST /api/v1/workshops/:id/register
POST /api/v1/workshops/:id/attendance
POST /api/v1/workshops/:id/pre-assessment/start
POST /api/v1/workshops/:id/post-assessment/start
GET  /api/v1/workshops/:id/impact
POST /api/v1/workshops/:id/recalculate-readiness
GET  /api/v1/students/me/workshops
GET  /api/v1/students/me/workshops/:id/result
```

Use the exact API contract implemented in `api.md`; if route naming differs in an existing repository, update the API specification before changing clients.

## 11. Cross-role authorization tests

### Student

Allowed:

- own profile
- own assessments
- own interviews
- own readiness
- own recommendations
- own workshops
- own workshop results

Denied:

- another student's private result
- workshop cohort administration
- attendance administration
- impact analytics
- readiness recalculation for other students

### Placement officer

Allowed:

- drive analytics
- skill-gap analytics
- workshop creation/edit/publish
- cohort preview
- enrollment management
- attendance
- impact analytics
- intervention recalculation

### Admin

Allowed all placement-officer capabilities plus configuration/audit capabilities.

### Recruiter

Must only access data authorized for their company/drive.

## 12. AI/ML evaluation

Use fixed evaluation datasets and pinned model/prompt versions.

### Skill extraction

Measure:

- precision
- recall
- normalization accuracy

### Recommendation relevance

Evaluate whether:

- high-priority gaps receive higher priority;
- workshop is recommended when appropriate and available;
- non-workshop alternatives are suggested when no workshop exists.

### Interview evaluation

Evaluate consistency against a fixed rubric:

- technical correctness
- communication clarity
- relevance
- structure

Do not evaluate protected characteristics or unsupported personality claims.

### Proctoring

Evaluate:

- precision
- recall
- false-positive rate
- event confidence calibration

Every flagged event must remain reviewable by an authorized human.

### Resume/JD matching

Verify:

- extracted requirements match source JD;
- generated skills/projects/certifications trace to verified student data;
- unsupported claims are rejected.

## 13. Security tests

Required:

- invalid JWT
- expired JWT
- missing token
- role escalation
- IDOR/resource-access attempts
- cross-student workshop result access
- cross-college data leakage
- injection payloads
- rate limiting
- malformed ObjectIds
- malicious file types
- oversized uploads
- sensitive-field exposure

Responses must not contain:

```text
passwordHash
JWT secret
API keys
database credentials
internal stack traces
```

## 14. Reliability tests

- MongoDB temporary failure.
- Redis unavailable.
- AI provider timeout.
- AI provider rate limit.
- malformed AI output.
- CV service unavailable.
- STT service unavailable.
- frontend refresh during assessment.
- network interruption during assessment.
- duplicate submission.
- worker retry after failure.

Expected behavior:

```text
fail safely
preserve user data
avoid duplicate side effects
surface actionable status
```

## 15. End-to-end v2 acceptance test

This is the primary workshop acceptance scenario.

```text
1. Seed 50 students with DSA score < 60.
2. Open Placement Officer Skill-Gap Analytics.
3. Verify "50 students need DSA intervention".
4. Create "DSA + C++ Placement Workshop".
5. Resolve/preview cohort.
6. Verify 50 eligible students and selection reasons.
7. Freeze cohort.
8. Publish workshop.
9. Verify notifications are generated.
10. Register or auto-enroll eligible students.
11. Verify capacity and no duplicate enrollment.
12. Record attendance.
13. Complete pre-assessment.
14. Run college-led workshop.
15. Complete post-assessment.
16. Verify skill score update.
17. Recalculate readiness.
18. Verify recommendations refresh.
19. Open impact report.
20. Verify threshold-cleared count.
21. Verify remaining at-risk students.
22. Assign follow-up intervention where required.
```

Pass condition:

```text
Measure → Detect → Group → Intervene → Train → Reassess
→ Measure Improvement → Prepare for Drive
```

## 16. Regression rule

Any change to:

- API route
- database field
- readiness formula
- skill-gap formula
- recommendation priority
- workshop enrollment
- capacity handling
- assessment result
- authorization

must add/update tests before merge.
