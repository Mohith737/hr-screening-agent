import EmptyState from './EmptyState'
import StatusBadge from './StatusBadge'

const nextStepClass = { green: 'advance', yellow: 'review', red: 'reject', gray: 'review' }
const nextActionIcon = {
  schedule_technical_round: '>',
  schedule_hr_round: '>',
  send_offer: '*',
  reject_candidate: 'x',
  manual_review: 'o',
}

function confidencePercent(report) {
  const confidence = report?.confidence ?? 0
  return confidence > 0 && confidence <= 1 ? Math.round(confidence * 100) : Math.round(confidence)
}

function factLine(report) {
  const facts = report?.extractedFacts || {}
  const experience = facts.yearsExperience ? `${facts.yearsExperience} years exp` : 'Experience unavailable'
  const location = facts.location || 'Location unavailable'
  return `${experience} - ${location}`
}

function formatActionLabel(value) {
  if (!value) return 'Manual Review Required'
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export default function DecisionZone({ candidate, report, isTriggering, onStartScreening, allCandidates = [] }) {
  const status = candidate.displayStatus?.code

  if (!report && candidate.canTriggerScreening) {
    if (status === 'failed') {
      return (
        <section className="decision-zone section">
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div className="heading-section" style={{ marginBottom: '8px' }}>
              Interview connection unsuccessful
            </div>
            <div className="meta-text" style={{ maxWidth: '280px', margin: '0 auto 18px' }}>
              The AI interview could not be completed. No candidate data was lost. You can retry when ready.
            </div>
            <button className="btn btn-primary" disabled={isTriggering} onClick={onStartScreening} type="button">
              {isTriggering ? 'Connecting...' : 'Retry AI Interview'}
            </button>
          </div>
        </section>
      )
    }

    return (
      <section className="decision-zone section">
        <EmptyState
          icon="o"
          title="Start AI Interview"
          subtitle="Start an AI voice interview to generate candidate intelligence."
          action="Use the button below to begin."
        />
        <div className="flex justify-center">
          <button className="btn btn-primary" disabled={isTriggering} onClick={onStartScreening} type="button">
            {isTriggering ? 'Connecting to candidate...' : 'Start AI Interview'}
          </button>
        </div>
      </section>
    )
  }

  if (!report && status === 'screening') {
    return (
      <section className="decision-zone section flex items-center gap-12">
        <span className="status-dot bg-blue pulse" />
        <strong>AI interview in progress - intelligence report generating automatically</strong>
      </section>
    )
  }

  if (!report) {
    return (
      <section className="decision-zone section">
        <EmptyState
          icon=""
          title="No interview completed yet"
          subtitle="Start an AI voice interview to generate candidate intelligence."
          action="Use the button above to begin."
        />
      </section>
    )
  }

  const facts = report.extractedFacts || {}
  const recommendationColor = report.recommendationBadge?.color || 'gray'
  const notice = facts.noticePeriodDays ? `${facts.noticePeriodDays} days` : '-'
  const confidence = confidencePercent(report)
  const displayStatus = status === 'failed'
    ? { ...candidate.displayStatus, label: 'Interview connection unsuccessful' }
    : candidate.displayStatus
  const peers = allCandidates.filter((item) =>
    item.role === candidate.role &&
    item.id !== candidate.id &&
    item.hasIntelligenceReport)
  const peerScores = peers
    .map((item) => item.scoreDisplay?.value)
    .filter(Boolean)
  const avgPeerScore = peerScores.length > 0
    ? Math.round(peerScores.reduce((sum, score) => sum + score, 0) / peerScores.length)
    : null
  const rankedInRole = [...allCandidates]
    .filter((item) => item.role === candidate.role && item.hasIntelligenceReport)
    .sort((a, b) => (b.scoreDisplay?.value || 0) - (a.scoreDisplay?.value || 0))
  const rankPosition = rankedInRole.findIndex((item) => item.id === candidate.id) + 1
  const totalInRole = rankedInRole.length
  const contextLines = []
  if (rankPosition > 0 && totalInRole > 1) {
    contextLines.push(`Ranked #${rankPosition} of ${totalInRole} ${candidate.role} candidates interviewed`)
  }
  if (avgPeerScore && report.overallScore) {
    const diff = report.overallScore - avgPeerScore
    if (diff > 0) {
      contextLines.push(`${diff} points above the ${candidate.role} pipeline average (${avgPeerScore})`)
    } else if (diff < 0) {
      contextLines.push(`${Math.abs(diff)} points below the ${candidate.role} pipeline average (${avgPeerScore})`)
    }
  }
  if (report.overallRecommendation === 'advance' && rankPosition === 1) {
    contextLines.push('Highest confidence-adjusted score in this role cluster')
  }
  const nextActionCode = typeof report.nextAction === 'string' ? report.nextAction : report.nextAction?.code
  const actionIcon = nextActionIcon[nextActionCode] || '>'
  const nextActionLabel = typeof report.nextAction === 'string'
    ? formatActionLabel(report.nextAction)
    : report.nextAction?.label || 'Manual Review Required'

  return (
    <section className="decision-zone section">
      <div className="decision-zone-header">
        <div className={`decision-score-circle bg-${report.scoreDisplay?.color || 'gray'}`}>
          {report.scoreDisplay?.value ?? '-'}
        </div>
        <div className="flex-col gap-8 flex-1">
          <div>
            <h2 className="decision-zone-title">{candidate.name || 'Unnamed candidate'}</h2>
            <div className="text-secondary">{candidate.role || 'Role unavailable'} - {factLine(report)}</div>
          </div>
          <div className="flex items-center gap-8">
            <StatusBadge displayStatus={displayStatus} />
            <span className={`badge badge-${recommendationColor}`}>{report.recommendationBadge?.label || 'Pending'}</span>
            <span className={`badge badge-${candidate.languageBadge?.color || 'gray'}`}>
              {candidate.languageBadge?.label || report.language || 'Language unavailable'}
            </span>
            <span className="badge badge-gray">Sentiment: {report.sentiment?.label || 'unavailable'}</span>
          </div>
        </div>
        <div className="text-sm text-muted">{confidence}% confidence</div>
      </div>
      <div className="text-xs text-muted mb-16">
        {candidate.email || 'Email unavailable'} - {candidate.phone || 'Phone unavailable'} - {facts.location || 'Location unavailable'} - {facts.yearsExperience ? `${facts.yearsExperience} years exp` : 'Experience unavailable'} - notice: {notice}
      </div>
      <div className="mb-16">
        <div className="flex items-center gap-16">
          <div>
            <div className="field-label">Analysis Confidence</div>
            <div className="confidence-bar-track">
              <div className="confidence-bar-fill" style={{ width: `${confidence}%` }} />
            </div>
            <div className="meta-text mt-8">{confidence}% - based on interview depth and response clarity</div>
          </div>
          <div className="evidence-signal" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
            <span className="data-value" style={{ fontSize: '13px' }}>{report.evidence?.length || 0}</span>
            <span className="meta-text">verified evidence points</span>
          </div>
          <div className="trust-badge">Verified transcript-grounded</div>
        </div>
        <div className="advisory-inline">
          Advisory only - final decisions remain with your team.
        </div>
      </div>
      {contextLines.length > 0 && (
        <div className="pipeline-context-block">
          <div className="pipeline-context-eyebrow">Pipeline Context</div>
          {contextLines.map((line, index) => (
            <div className="pipeline-context-line" key={line} style={{ marginBottom: index < contextLines.length - 1 ? '4px' : '0' }}>
              {line}
            </div>
          ))}
        </div>
      )}
      <div className="ai-assessment-block">
        <div className="ai-assessment-eyebrow">
          <span>◆</span>
          <span>AI Recruiter Assessment</span>
        </div>
        <div className="ai-assessment-text">
          {report.recruiterSummary || 'Interview summary not yet available.'}
        </div>
      </div>
      <div className={`next-step-cta ${report.overallRecommendation || nextStepClass[recommendationColor] || 'review'}`}>
        <div className="next-step-cta-icon">{actionIcon}</div>
        <div className="next-step-cta-content">
          <div className="next-step-cta-eyebrow">Recommended Next Step</div>
          <div className="next-step-cta-label">{nextActionLabel}</div>
        </div>
      </div>
    </section>
  )
}
