const rawCandidates = [
  {
    id: 'cand_001',
    name: 'Aisha Khan',
    role: 'Operations',
    email: 'aisha.khan@hireiq-demo.com',
    phone: '+91-98765-43210',
    languagePreference: 'Hinglish',
    appliedDate: '2026-04-28',
    latestStatus: 'completed',
    latestOverallScore: 82,
    latestRecommendation: 'advance',
  },
  {
    id: 'cand_002',
    name: 'Priya Sharma',
    role: 'Software Engineer',
    email: 'priya.sharma@hireiq-demo.com',
    phone: '+91-98765-43211',
    languagePreference: 'English',
    appliedDate: '2026-04-29',
    latestStatus: 'completed',
    latestOverallScore: 67,
    latestRecommendation: 'review',
  },
  {
    id: 'cand_003',
    name: 'Vikram Nair',
    role: 'Software Engineer',
    email: 'vikram.nair@hireiq-demo.com',
    phone: '+91-98765-43212',
    languagePreference: 'English',
    appliedDate: '2026-04-30',
    latestStatus: 'completed',
    latestOverallScore: 58,
    latestRecommendation: 'review',
  },
  {
    id: 'cand_004',
    name: 'Rahul Verma',
    role: 'Sales/HR',
    email: 'rahul.verma@hireiq-demo.com',
    phone: '+91-98765-43213',
    languagePreference: 'Hindi',
    appliedDate: '2026-05-01',
    latestStatus: 'completed',
    latestOverallScore: 41,
    latestRecommendation: 'reject',
  },
  {
    id: 'cand_005',
    name: 'Sneha Patel',
    role: 'Operations',
    email: 'sneha.patel@hireiq-demo.com',
    phone: '+91-98765-43214',
    languagePreference: 'English',
    appliedDate: '2026-05-02',
    latestStatus: 'pending',
    latestOverallScore: null,
    latestRecommendation: null,
  },
  {
    id: 'cand_006',
    name: 'Arjun Mehta',
    role: 'Sales/HR',
    email: 'arjun.mehta@hireiq-demo.com',
    phone: '+91-98765-43215',
    languagePreference: 'Hindi',
    appliedDate: '2026-05-01',
    latestStatus: 'failed',
    latestOverallScore: null,
    latestRecommendation: null,
  },
]

const transcripts = {
  scr_003_demo: [
    { speaker: 'agent', text: 'Hi Aisha, can you tell me about your operations background?' },
    { speaker: 'candidate', text: 'I have about 3 years in supply chain coordination and vendor management across Pune and Mumbai lanes.' },
    { speaker: 'agent', text: 'What is one process improvement you personally owned?' },
    { speaker: 'candidate', text: 'I built a tracking system in Excel that reduced reporting time by 40% and helped supervisors catch delayed dispatches earlier.' },
    { speaker: 'agent', text: 'What would be the main risk if we moved you into a larger operations role?' },
    { speaker: 'candidate', text: 'I have not formally managed a team yet, but I coordinate daily with vendors and warehouse supervisors.' },
  ],
  scr_002_demo: [
    { speaker: 'agent', text: 'Priya, can you describe your React and API experience?' },
    { speaker: 'candidate', text: 'I have built React dashboards and integrated REST APIs for internal tools.' },
    { speaker: 'agent', text: 'Can you walk me through how you would explain a technical issue to a non-technical stakeholder?' },
    { speaker: 'candidate', text: 'I can explain it step by step if that helps, starting with what the user sees and then the root cause.' },
    { speaker: 'agent', text: 'How comfortable are you with backend services and production deployments?' },
    { speaker: 'candidate', text: 'I have limited backend exposure and have not owned production deployments myself.' },
  ],
  scr_003b_demo: [
    { speaker: 'agent', text: 'Vikram, tell me about your backend production experience.' },
    { speaker: 'candidate', text: 'I have 4 years of Node.js and microservices experience, including SQL-heavy services.' },
    { speaker: 'agent', text: 'What concerns would you have about this opportunity?' },
    { speaker: 'candidate', text: 'The range mentioned is below my current package, and my notice period is 90 days.' },
    { speaker: 'agent', text: 'How actively are you looking right now?' },
    { speaker: 'candidate', text: 'I am open to conversations, but I would move only if compensation and role scope align.' },
  ],
  scr_004_demo: [
    { speaker: 'agent', text: 'Rahul, can you describe your sales or HR experience?' },
    { speaker: 'candidate', text: 'I have done sales work before in various companies.' },
    { speaker: 'agent', text: 'Can you share a measurable outcome from your previous role?' },
    { speaker: 'candidate', text: 'I do not have exact numbers right now, but I used to speak with many customers.' },
    { speaker: 'agent', text: 'What interests you about this Sales/HR role?' },
    { speaker: 'candidate', text: 'It seems fine, and I can join immediately.' },
  ],
}

const reports = {
  scr_003_demo: {
    reportVersion: '1.0',
    candidateId: 'cand_001',
    screeningId: 'scr_003_demo',
    createdAt: '2026-05-01T10:20:00Z',
    role: { title: 'Operations', strategyId: 'operations_default' },
    overallRecommendation: 'advance',
    overallScore: 82,
    confidence: 0.88,
    scores: { roleFit: 84, communication: 85, experience: 78, intent: 90, problemSolving: 75 },
    sentiment: { label: 'positive', confidence: 0.82 },
    strengths: [
      'Strong process improvement mindset',
      'Clear and confident communication',
      'High ownership across vendor coordination',
    ],
    risks: ['No formal team leadership experience', 'Salary expectation not captured'],
    mustHavesMet: ['Vendor coordination', 'Deadline management'],
    gaps: ['Team leadership', 'ERP system experience'],
    evidence: [
      { label: 'Process improvement', quote: 'reduced reporting time by 40%', scoreImpact: 14 },
      { label: 'Leadership gap', quote: 'I have not formally managed a team yet', scoreImpact: -6 },
    ],
    extractedFacts: {
      yearsExperience: 3,
      location: 'Pune',
      salaryExpectation: null,
      noticePeriodDays: null,
      language: 'Hinglish',
    },
    followUpQuestions: [
      'Ask about experience managing shift supervisors or vendor escalation',
      'Clarify salary expectations and notice period',
    ],
    nextAction: 'schedule_technical_round',
    recruiterSummary: 'Strong operations candidate with clear communication and proven process improvement. Leadership depth needs validation, but the evidence supports advancing to the next round.',
    analysisStatus: 'completed',
    language: 'Hinglish',
  },
  scr_002_demo: {
    reportVersion: '1.0',
    candidateId: 'cand_002',
    screeningId: 'scr_002_demo',
    createdAt: '2026-05-01T14:30:00Z',
    role: { title: 'Software Engineer', strategyId: 'software_engineer_default' },
    overallRecommendation: 'review',
    overallScore: 67,
    confidence: 0.72,
    scores: { roleFit: 70, communication: 75, experience: 62, intent: 68, problemSolving: 60 },
    sentiment: { label: 'positive', confidence: 0.68 },
    strengths: [
      'Clear verbal communication',
      'Demonstrated genuine interest in the role',
      'Solid understanding of frontend fundamentals',
    ],
    risks: [
      'Limited backend and system design exposure',
      'No production deployment experience mentioned',
      'Uncertain about long-term technical growth direction',
    ],
    mustHavesMet: ['JavaScript', 'React', 'API integration'],
    gaps: ['System design', 'Backend services', 'Production ops'],
    evidence: [
      { label: 'Communication clarity', quote: 'I can explain it step by step if that helps', scoreImpact: 8 },
    ],
    extractedFacts: {
      yearsExperience: 2,
      location: 'Hyderabad',
      salaryExpectation: '12-15 LPA',
      noticePeriodDays: 30,
      language: 'English',
    },
    followUpQuestions: [
      'Ask for a specific example of a production bug they debugged',
      'Probe depth on any backend or API experience',
    ],
    nextAction: 'schedule_technical_round',
    recruiterSummary: 'Promising junior engineer with good communication and enthusiasm. Technical depth is still developing - recommend a focused technical assessment before advancing.',
    analysisStatus: 'completed',
    language: 'English',
  },
  scr_003b_demo: {
    reportVersion: '1.0',
    candidateId: 'cand_003',
    screeningId: 'scr_003b_demo',
    createdAt: '2026-05-02T11:00:00Z',
    role: { title: 'Software Engineer', strategyId: 'software_engineer_default' },
    overallRecommendation: 'review',
    overallScore: 58,
    confidence: 0.79,
    scores: { roleFit: 72, communication: 65, experience: 74, intent: 38, problemSolving: 68 },
    sentiment: { label: 'neutral', confidence: 0.71 },
    strengths: ['Strong backend and distributed systems experience', '4 years of relevant production work'],
    risks: [
      'Compensation gap: expressed dissatisfaction with compensation range',
      '90-day notice period is an operational risk',
      'Low intent score suggests passive job seeking',
    ],
    mustHavesMet: ['Node.js', 'Microservices', 'SQL'],
    gaps: ['Cultural alignment', 'Intent clarity'],
    evidence: [
      { label: 'Compensation concern', quote: 'the range mentioned is below my current package', scoreImpact: -18 },
    ],
    extractedFacts: {
      yearsExperience: 4,
      location: 'Bengaluru',
      salaryExpectation: '28+ LPA',
      noticePeriodDays: 90,
      language: 'English',
    },
    followUpQuestions: [
      'Clarify whether compensation alignment is possible',
      'Confirm actual availability given 90-day notice',
    ],
    nextAction: 'schedule_hr_round',
    recruiterSummary: 'Technically strong but low hiring intent. Compensation gap and 90-day notice are significant blockers. Requires HR alignment call before any technical investment.',
    analysisStatus: 'completed',
    language: 'English',
  },
  scr_004_demo: {
    reportVersion: '1.0',
    candidateId: 'cand_004',
    screeningId: 'scr_004_demo',
    createdAt: '2026-05-03T09:15:00Z',
    role: { title: 'Sales/HR', strategyId: 'sales_hr_default' },
    overallRecommendation: 'reject',
    overallScore: 41,
    confidence: 0.83,
    scores: { roleFit: 45, communication: 38, experience: 42, intent: 40, problemSolving: 44 },
    sentiment: { label: 'negative', confidence: 0.78 },
    strengths: ['Available immediately - no notice period'],
    risks: [
      'Very low communication clarity throughout interview',
      'Unable to describe past sales outcomes with specifics',
      'Disengaged tone - low enthusiasm for the role',
    ],
    mustHavesMet: [],
    gaps: ['Communication', 'Role clarity', 'Sales outcomes'],
    evidence: [
      { label: 'Vague experience description', quote: 'I have done sales work before in various companies', scoreImpact: -15 },
    ],
    extractedFacts: {
      yearsExperience: 3,
      location: 'Delhi',
      salaryExpectation: null,
      noticePeriodDays: 0,
      language: 'Hindi',
    },
    followUpQuestions: [],
    nextAction: 'reject_candidate',
    recruiterSummary: 'Candidate did not meet the minimum communication threshold for a Sales/HR role. Vague answers, low energy, and no quantifiable experience. Not recommended for advancement.',
    analysisStatus: 'completed',
    language: 'Hindi',
  },
}

const rawScreenings = [
  {
    id: 'scr_003_demo',
    candidateId: 'cand_001',
    status: 'completed',
    providerSummary: 'Candidate demonstrated strong operational understanding and clear communication. Expressed high interest in the role.',
    startedAt: '2026-05-01T10:00:00Z',
    completedAt: '2026-05-01T10:18:00Z',
  },
  {
    id: 'scr_002_demo',
    candidateId: 'cand_002',
    status: 'completed',
    providerSummary: 'Candidate showed solid technical foundations but hesitated on system design questions. Communication was clear and professional.',
    startedAt: '2026-05-01T14:00:00Z',
    completedAt: '2026-05-01T14:30:00Z',
  },
  {
    id: 'scr_003b_demo',
    candidateId: 'cand_003',
    status: 'completed',
    providerSummary: 'Candidate has strong experience but raised significant concerns around compensation expectations and notice period.',
    startedAt: '2026-05-02T10:30:00Z',
    completedAt: '2026-05-02T11:00:00Z',
  },
  {
    id: 'scr_004_demo',
    candidateId: 'cand_004',
    status: 'completed',
    providerSummary: 'Candidate struggled to articulate past experience and showed limited engagement throughout the interview.',
    startedAt: '2026-05-03T09:00:00Z',
    completedAt: '2026-05-03T09:15:00Z',
  },
  {
    id: 'scr_006_demo',
    candidateId: 'cand_006',
    status: 'failed',
    providerSummary: null,
    startedAt: '2026-05-04T10:00:00Z',
    completedAt: '2026-05-04T10:01:00Z',
  },
]

function clone(value) {
  return value == null ? value : structuredClone(value)
}

function formatDisplayStatus(status) {
  switch (status) {
    case 'pending':
      return { code: 'pending', label: 'Waiting', color: 'gray' }
    case 'initiated':
      return { code: 'screening', label: 'Calling...', color: 'blue' }
    case 'screening':
      return { code: 'screening', label: 'In Progress', color: 'blue' }
    case 'completed':
      return { code: 'completed', label: 'Reviewed', color: 'green' }
    case 'failed':
      return { code: 'failed', label: 'Call Failed', color: 'red' }
    default:
      return { code: 'unknown', label: 'Unknown', color: 'gray' }
  }
}

function formatRecommendationBadge(recommendation) {
  switch (recommendation) {
    case 'advance':
      return { label: 'Strong Fit', color: 'green', icon: 'check' }
    case 'review':
      return { label: 'Needs Review', color: 'yellow', icon: 'clock' }
    case 'reject':
      return { label: 'Not a Fit', color: 'red', icon: 'x' }
    default:
      return { label: 'Pending', color: 'gray', icon: 'minus' }
  }
}

function formatScoreDisplay(score) {
  const numericScore = Number(score)

  if (score == null || !Number.isFinite(numericScore)) {
    return { value: null, tier: 'pending', color: 'gray' }
  }

  if (numericScore >= 75) {
    return { value: numericScore, tier: 'strong', color: 'green' }
  }

  if (numericScore >= 50) {
    return { value: numericScore, tier: 'average', color: 'yellow' }
  }

  return { value: numericScore, tier: 'weak', color: 'red' }
}

function formatLanguageBadge(languagePreference) {
  switch (languagePreference) {
    case 'Hindi':
      return { label: '\u0939\u093f\u0902\u0926\u0940', color: 'orange' }
    case 'Hinglish':
      return { label: 'Hinglish', color: 'purple' }
    default:
      return { label: 'English', color: 'blue' }
  }
}

function formatNextAction(code) {
  switch (code) {
    case 'schedule_technical_round':
      return { code, label: 'Schedule Technical Round' }
    case 'schedule_hr_round':
      return { code, label: 'Schedule HR Round' }
    case 'send_offer':
      return { code, label: 'Send Offer' }
    case 'reject_candidate':
      return { code, label: 'Reject Candidate' }
    default:
      return { code: 'manual_review', label: 'Manual Review Required' }
  }
}

function formatCandidate(candidate) {
  return {
    id: candidate.id,
    name: candidate.name,
    role: candidate.role,
    email: candidate.email,
    phone: candidate.phone,
    appliedDate: candidate.appliedDate,
    languagePreference: candidate.languagePreference,
    displayStatus: formatDisplayStatus(candidate.latestStatus),
    scoreDisplay: formatScoreDisplay(candidate.latestOverallScore),
    recommendationBadge: formatRecommendationBadge(candidate.latestRecommendation),
    languageBadge: formatLanguageBadge(candidate.languagePreference),
    canTriggerScreening: candidate.latestStatus === 'pending' || candidate.latestStatus === 'failed',
    hasIntelligenceReport: candidate.latestOverallScore !== null && candidate.latestRecommendation !== null,
  }
}

function formatIntelligenceReport(rawReport) {
  if (rawReport == null) return null

  const rawScores = rawReport.scores || {}

  return {
    overallScore: rawReport.overallScore,
    overallRecommendation: rawReport.overallRecommendation,
    confidence: rawReport.confidence,
    recommendationBadge: formatRecommendationBadge(rawReport.overallRecommendation),
    scoreDisplay: formatScoreDisplay(rawReport.overallScore),
    scores: {
      roleFit: formatScoreDisplay(rawScores.roleFit ?? null),
      communication: formatScoreDisplay(rawScores.communication ?? null),
      experience: formatScoreDisplay(rawScores.experience ?? null),
      intent: formatScoreDisplay(rawScores.intent ?? null),
      problemSolving: formatScoreDisplay(rawScores.problemSolving ?? rawScores.conversion ?? null),
    },
    sentiment: rawReport.sentiment,
    strengths: rawReport.strengths || [],
    risks: rawReport.risks || [],
    evidence: rawReport.evidence || [],
    extractedFacts: rawReport.extractedFacts || {},
    followUpQuestions: rawReport.followUpQuestions || [],
    recruiterSummary: rawReport.recruiterSummary || 'No summary available.',
    nextAction: formatNextAction(rawReport.nextAction),
    analysisStatus: rawReport.analysisStatus || 'completed',
    role: rawReport.role || null,
    createdAt: rawReport.createdAt || null,
    language: rawReport.language || rawReport.extractedFacts?.language || null,
  }
}

function formatLatestScreeningSummary(screening) {
  if (!screening) return null

  return {
    id: screening.id,
    status: screening.status,
    startedAt: screening.startedAt,
    completedAt: screening.completedAt || null,
    providerSummary: screening.providerSummary || null,
    hasTranscript: Boolean(transcripts[screening.id]),
    hasReport: Boolean(reports[screening.id]),
  }
}

function formatScreeningDetail(screening) {
  return {
    id: screening.id,
    candidateId: screening.candidateId,
    status: screening.status,
    startedAt: screening.startedAt,
    completedAt: screening.completedAt || null,
    providerSummary: screening.providerSummary || null,
    transcript: clone(transcripts[screening.id] || []),
    hasReport: Boolean(reports[screening.id]),
    report: formatIntelligenceReport(reports[screening.id]),
  }
}

function findCandidate(candidateId) {
  return rawCandidates.find((candidate) => candidate.id === candidateId)
}

function findLatestScreening(candidateId) {
  return rawScreenings
    .filter((screening) => screening.candidateId === candidateId)
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())[0] || null
}

export function getDemoCandidates() {
  return rawCandidates
    .map(formatCandidate)
    .sort((a, b) => {
      const aScore = a.scoreDisplay?.value
      const bScore = b.scoreDisplay?.value

      if (aScore == null && bScore != null) return 1
      if (aScore != null && bScore == null) return -1
      if (aScore != null && bScore != null && aScore !== bScore) return bScore - aScore

      return new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime()
    })
}

export function getDemoCandidate(candidateId) {
  const candidate = findCandidate(candidateId)
  if (!candidate) {
    throw new Error(`No candidate found with id: ${candidateId}`)
  }

  const latestScreening = findLatestScreening(candidateId)

  return {
    candidate: formatCandidate(candidate),
    latestScreening: formatLatestScreeningSummary(latestScreening),
    intelligenceReport: formatIntelligenceReport(reports[latestScreening?.id]),
  }
}

export function getDemoScreening(screeningId) {
  const screening = rawScreenings.find((item) => item.id === screeningId)
  if (!screening) {
    throw new Error(`No screening found with id: ${screeningId}`)
  }

  return formatScreeningDetail(screening)
}

export function getDemoDashboard() {
  const completedCandidates = rawCandidates.filter((candidate) => candidate.latestStatus === 'completed')
  const scoredCandidates = rawCandidates.filter((candidate) => candidate.latestOverallScore != null)
  const completedScreenings = rawScreenings
    .filter((screening) => screening.status === 'completed')
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())

  const advanceCount = completedCandidates
    .filter((candidate) => candidate.latestRecommendation === 'advance')
    .length

  return {
    pipeline: {
      total: rawCandidates.length,
      pending: rawCandidates.filter((candidate) => candidate.latestStatus === 'pending').length,
      screening: rawCandidates.filter((candidate) => ['initiated', 'screening'].includes(candidate.latestStatus)).length,
      completed: completedCandidates.length,
      failed: rawCandidates.filter((candidate) => candidate.latestStatus === 'failed').length,
    },
    topCandidates: rawCandidates
      .filter((candidate) => candidate.latestStatus === 'completed' && candidate.latestOverallScore != null)
      .sort((a, b) => b.latestOverallScore - a.latestOverallScore)
      .slice(0, 3)
      .map((candidate) => ({
        id: candidate.id,
        name: candidate.name,
        role: candidate.role,
        overallScore: candidate.latestOverallScore,
        recommendationBadge: formatRecommendationBadge(candidate.latestRecommendation),
        languageBadge: formatLanguageBadge(candidate.languagePreference),
      })),
    recentActivity: completedScreenings.slice(0, 5).map((screening) => {
      const candidate = findCandidate(screening.candidateId)
      return {
        screeningId: screening.id,
        candidateName: candidate?.name,
        candidateRole: candidate?.role,
        completedAt: screening.completedAt,
        overallScore: candidate?.latestOverallScore,
        recommendation: candidate?.latestRecommendation,
        recommendationBadge: formatRecommendationBadge(candidate?.latestRecommendation),
      }
    }),
    averageScore: scoredCandidates.length
      ? Math.round(scoredCandidates.reduce((sum, candidate) => sum + candidate.latestOverallScore, 0) / scoredCandidates.length)
      : null,
    advanceRate: completedCandidates.length > 0 ? Number((advanceCount / completedCandidates.length).toFixed(2)) : null,
  }
}

export function createDemoScreening(candidateId) {
  const candidate = findCandidate(candidateId)
  if (!candidate) {
    throw new Error(`No candidate found with id: ${candidateId}`)
  }

  return {
    screeningId: null,
    candidateId,
    status: candidate.latestStatus,
    demoMode: true,
  }
}
