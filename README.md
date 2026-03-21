&nbsp;

## Trade-offs and Shortcuts

**In-memory store:** Candidate state and results reset on server 
restart. A production version would use PostgreSQL or MongoDB. 
Deliberately omitted — no persistence requirement for a demo.

**Placeholder phone numbers:** The demo uses real phone numbers 
for live testing. In production, numbers would come from an 
applicant tracking system via API.

**No authentication:** The dashboard has no login. A production 
version would have role-based access so only HR staff can trigger calls.

**Single agent:** One Bolna agent handles all roles. Production 
would have role-specific agents with tailored questions.

&nbsp;

## What I Would Add With More Time

- **ATS integration** — pull candidates directly from Greenhouse 
  or Lever via API
- **Role-specific agents** — different question sets per job function
- **Scoring model** — LLM post-processing to score answers and 
  flag strong candidates automatically  
- **Email notifications** — notify candidate before call, 
  notify HR when results arrive
- **Persistent storage** — PostgreSQL for candidate history 
  and audit trail
- **Calendar integration** — auto-schedule next round for 
  shortlisted candidates
