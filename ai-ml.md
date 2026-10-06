# CampusPulse — AI/ML Specification

**Version:** 1.0  
**Status:** Implementation specification derived from CampusPulse PRD v2 and architecture v2.

## 1. Purpose

CampusPulse uses AI/ML selectively. The MVP deliberately keeps high-impact decisions explainable:

- Readiness scoring: deterministic weighted scoring.
- Skill-gap detection: deterministic comparison, with LLM-assisted skill normalization where needed.
- Recommendations: rule-based prioritization; LLM may generate explanation wording.
- Cohort targeting: deterministic; the LLM never selects students.
- Workshop impact: deterministic before/after calculations.
- Assessment scoring: deterministic for objective questions; LLM may evaluate subjective answers.
- JD parsing, interview assistance, resume generation: LLM/STT where appropriate.
- Proctoring: computer-vision signals plus deterministic event rules and human review.
- Predictive placement models are future/optional and require historical data.

This split follows the architecture decision that cohort targeting and impact calculation must be auditable and reproducible.

## 2. AI/ML Components

| Component | Model/approach | Inputs | Outputs | MVP |
|---|---|---|---|---|
| Student model | Normalized profile representation | academic data, skills, certifications, projects, assessments, interviews, resume | structured student profile | Yes |
| Certification model | Classification/relevance rules + optional LLM normalization | certification metadata, credential data, skills | category, skill association, relevance, verification status | Yes |
| Assessment scorer | Deterministic scoring; LLM for subjective answers | questions, answers, marks, difficulty, topic, time | score, topic performance, accuracy, time efficiency, weak/strong topics | Yes |
| Company/JD model | LLM extraction with strict schema | company/JD text | required/preferred skills, eligibility, stages, skill importance | Yes |
| Readiness engine | Transparent weighted score | student profile, company requirements, assessment/interview/skill-gap signals | overall score, component scores, stage readiness, risk | Yes |
| Skill-gap engine | Deterministic comparison + normalization | student skills, company/JD skills, assessments, interviews | missing/weak/strong skills, priority, gap score | Yes |
| Recommendation engine | Rules + optional LLM wording | gaps, skill importance, weakness, stage importance, available interventions | prioritized actions: resource, assessment, interview, workshop, task, resume action | Yes |
| Cohort targeting | Deterministic query/rule engine | skill score thresholds, priorities, drive, branch, semester, risk, student IDs | eligible cohort + selection reasons | Yes |
| Workshop impact | Deterministic | attendance, pre/post scores, readiness snapshots, threshold | improvement, threshold-cleared, remaining-at-risk, impact summary | Yes |
| AI assessment generation | LLM + validation | topic, difficulty, skill, constraints | candidate questions in validated schema | Optional/controlled |
| AI interview | LLM + STT | drive, interview type, responses, duration | questions, follow-ups, transcript, technical/communication/relevance scores, feedback | Yes |
| Proctoring | CV + event rules | sampled frames/events, confidence, timestamps | events, confidence, severity, risk summary | Yes |
| Resume/JD | LLM + fact validator | JD + verified student data | extracted requirements, tailored resume, validation result | Yes |
| Predictive placement | Python ML later | historical readiness, workshop impacts, placement outcomes | stage-clearance/selection probability | Future |

## 3. Readiness Inference Flow

```text
Student profile
    +
Company / drive requirements
    +
Assessment performance
    +
Interview performance
    +
Skill scores
    ↓
Normalize component signals
    ↓
Eligibility check
    ↓
Skill-gap calculation
    ↓
Stage/component scores
    ↓
Transparent weighted readiness score
    ↓
Risk classification
    ↓
Persist versioned readiness snapshot
    ↓
Generate prioritized recommendations
    ↓
Workshop available?
    ├── Yes → recommend/assign workshop
    └── No  → practice/resource/interview recommendation
```

The PRD requires company-specific readiness and identifies aptitude, technical, coding and interview dimensions. The exact production weights should remain configuration rather than being invented in this document; the implementation must expose the chosen weights and score version for auditability.

## 4. Skill-Gap Inference

```text
Required skill
      ↓
Student current score
      ↓
Required minimum score
      ↓
Gap = required - current
      ↓
Priority = skill importance × weakness × recruitment-stage importance
      ↓
Missing / Weak / Strong classification
```

Example:

```text
Skill: DSA
Student score: 54
Required score: 75
Gap: 21 points
Priority: High
Workshop available: Yes
```

The LLM may normalize names such as "Data Structures", "DSA", or a JD phrase into the same canonical skill, but the final cohort selection must use deterministic rules.

## 5. Cohort Targeting

**Do not use an LLM to decide who gets a workshop.**

Supported targeting inputs from the database specification:

- minSkillScore
- maxSkillScore
- priorities
- branches
- semesters
- riskLevels
- explicit studentIds
- linked placement drives

Inference:

```text
Targeting rules
    +
Student/skill/readiness data
    ↓
Deterministic query
    ↓
Eligible students
    ↓
Selection-reason snapshot
    ↓
Cohort preview
    ↓
Officer freezes cohort
    ↓
Enrollment / notification
```

The frozen cohort is important: students should see a stable explanation such as "DSA score 54; required 75" rather than a reason that changes later.

## 6. Workshop Impact Inference

A workshop is an intervention measurement pipeline, not an LLM judgment.

```text
Enrollment
  ↓
Attendance
  ↓
Pre-assessment
  ↓
Workshop sessions
  ↓
Post-assessment
  ↓
Pre/post skill comparison
  ↓
Readiness before/after
  ↓
Threshold check
  ↓
Remaining gap
  ↓
Next recommendation
```

Required descriptive metrics where sufficient data exists:

- Attendance Rate
- Completion Rate
- Average Skill Improvement
- Average Readiness Improvement
- Threshold-Cleared Count
- Remaining At-Risk Count

These are descriptive intervention analytics, not causal claims.

## 7. AI Interview Inference

```text
Drive + interview type
    ↓
Question selection/generation
    ↓
Student response
    ↓
STT (if audio/video)
    ↓
LLM/rubric evaluation
    ↓
Technical correctness
Communication clarity
Relevance
Structure
    ↓
Scores + feedback
```

Guardrails:

- Do not infer personality or protected characteristics.
- Store rubric, model and prompt version with the result.
- AI service failure must preserve session state.
- High-stakes generated questions require validation before use.

## 8. Proctoring Inference

```text
Camera / mic
    ↓
Throttled frame sampling
    ↓
CV service
    ↓
person / face / phone / multiple-person / absence / gaze signals
    ↓
confidence thresholds + temporal smoothing
    ↓
proctoring event
    ↓
human review
    ↓
session report
```

Proctoring is a probabilistic decision-support signal, not automatic proof of misconduct.

## 9. Resume/JD Inference

```text
JD
 ↓
Requirement extraction
 ↓
Skill extraction
 ↓
Match against VERIFIED student data
 ↓
Constrained resume generation
 ↓
Fact validation
 ├── pass → student review/edit
 └── fail → reject/regenerate/flag
```

The generator must never fabricate qualifications, projects, certifications or achievements.

## 10. AI Gateway Contract

Every external AI provider should sit behind a provider-neutral gateway.

Minimum controls:

1. Provider abstraction.
2. Bounded timeout and retry.
3. Exponential backoff and circuit breaker where applicable.
4. JSON-schema validation.
5. Repair attempt for malformed structured output.
6. Prompt versioning.
7. Data minimization.
8. Per-user/per-organization rate limits and quotas.
9. Cost/latency logging.
10. Input hash and output audit record.
11. Human-in-the-loop for high-stakes generated questions and flagged proctoring events.

Suggested internal interface:

```text
AI Gateway
├── generateStructured()
├── transcribe()
├── evaluateInterview()
├── analyzeJD()
├── generateResume()
└── analyzeProctoringFrame()
```

Provider/model names are configuration, not hard-coded application logic.

## 11. Async Inference

Long-running AI/analytics work follows:

```text
API request
   ↓
create job
   ↓
return jobId
   ↓
worker executes
   ↓
validate result
   ↓
persist result
   ↓
frontend polls/SSE
```

Typical synchronous API responses should target <500 ms under normal load; AI/analytics operations should be asynchronous.

## 12. Failure Modes

| Failure | Required behavior |
|---|---|
| LLM timeout | Retry within bound; preserve prior data; return job failure state |
| LLM malformed JSON | Schema validation → repair attempt → fail safely |
| Model unavailable | Circuit breaker/fallback provider where configured |
| CV unavailable | Store session/event state; do not fabricate proctoring events |
| STT unavailable | Preserve media/session state; allow supported recovery path |
| Rate limit | Backoff and surface retry state |
| Resume hallucination | Fact validator rejects unsupported claims |
| AI interview unavailable | Pause/save state; resume if supported |
| Workshop targeting failure | Do not auto-enroll; surface error to officer |
| Readiness recalculation failure | Preserve previous snapshot and mark job failed; never silently overwrite |

## 13. Versioning

Persist enough metadata to reproduce an AI result:

```text
model
modelVersion
promptVersion
schemaVersion
inputHash
generatedAt
latencyMs
provider
```

Readiness, skill scores and intervention measurements should also be versioned snapshots so workshop before/after comparisons remain auditable.

## 14. Future Predictive ML

Only introduce predictive placement models after sufficient historical data exists.

Potential inputs:

- historical readiness snapshots
- assessment performance
- interview performance
- skill gaps
- workshop participation/impact
- placement outcomes

Potential outputs:

- probability of clearing a recruitment stage
- selection probability
- expected placement outcome

These are future capabilities and must not replace the transparent MVP readiness score.
