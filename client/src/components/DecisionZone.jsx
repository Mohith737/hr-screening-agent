import EmptyState from './EmptyState'
import ScoreBadge from './ScoreBadge'
import StatusBadge from './StatusBadge'

const nextStepClass = { green: 'advance', yellow: 'review', red: 'reject', gray: 'review' }

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

export default function DecisionZone({ candidate, report, isTriggering, onStartScreening }) {
  const status = candidate.displayStatus?.code

  if (!report && candidate.canTriggerScreening) {
    return (
      <section className="decision-zone section">
        <EmptyState
          icon="o"
          title={status === 'failed' ? 'Interview call failed' : 'Start AI Interview'}
          subtitle={status === 'failed'
            ? 'Retry the AI-powered voice interview to generate candidate intelligence.'
            : 'Start an AI voice interview to generate candidate intelligence.'}
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
        <EmptyState title="No interview completed yet" subtitle="Candidate intelligence appears after an AI interview is completed." />
      </section>
    )
  }

  const facts = report.extractedFacts || {}
  const recommendationColor = report.recommendationBadge?.color || 'gray'
  const notice = facts.noticePeriodDays ? `${facts.noticePeriodDays} days` : '-'
  const confidence = confidencePercent(report)
  const displayStatus = status === 'failed'
    ? { ...candidate.displayStatus, label: 'Interview call failed' }
    : candidate.displayStatus

  return (
    <section className="decision-zone section">
      <div className="decision-zone-header">
        <ScoreBadge scoreDisplay={report.scoreDisplay} size="large" />
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
      <div className="flex items-center gap-16 mb-16">
        <div>
          <div className="meta mb-8">Analysis confidence</div>
          <div className="confidence-bar-track">
            <div className="confidence-bar-fill" style={{ width: `${confidence}%` }} />
          </div>
          <div className="meta mt-8">{confidence}% - based on interview depth</div>
        </div>
        <div className="evidence-signal">
          <span>*</span>
          <span>
            {report.evidence?.length || 0} verified evidence
            {report.evidence?.length === 1 ? ' point' : ' points'}
          </span>
        </div>
        <div className="trust-badge">Verified transcript-grounded</div>
      </div>
      <blockquote className="decision-zone-summary">{report.recruiterSummary || 'Interview summary not yet available.'}</blockquote>
      <div className={`next-step-cta ${nextStepClass[recommendationColor] || 'review'}`}>
        <div>
          <div className="next-step-cta-label">Recommended Next Step</div>
          <div>{report.nextAction?.label || 'Manual Review Required'}</div>
        </div>
      </div>
      <div className="ai-disclaimer">
        HireIQ Intelligence is advisory. All hiring decisions remain with your team.
      </div>
    </section>
  )
}
