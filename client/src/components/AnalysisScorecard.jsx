import ScoreBadge from './ScoreBadge'
import DimensionBar from './DimensionBar'
import StrengthsRisks from './StrengthsRisks'
import EvidencePanel from './EvidencePanel'
import ExtractedFacts from './ExtractedFacts'
import FollowUpPanel from './FollowUpPanel'

export default function AnalysisScorecard({ report }) {
  const scores = report.scores || {}
  const confidence = report.confidence > 0 && report.confidence <= 1
    ? Math.round(report.confidence * 100)
    : report.confidence ?? 0

  return (
    <section className="card">
      {report.analysisStatus === 'failed' && (
        <div className="warning-box">Automated analysis could not be completed. Manual review required.</div>
      )}
      <div className="flex gap-16 mb-16">
        <div className="flex-col items-center gap-8">
          <ScoreBadge scoreDisplay={report.scoreDisplay} size="large" />
          <div className="text-xs text-muted">Confidence: {confidence}%</div>
        </div>
        <div className="flex-col gap-12">
          <span className={`badge bg-${report.recommendationBadge?.color || 'gray'}`}>
            {report.recommendationBadge?.label || 'Pending'}
          </span>
          <p className="summary-quote">{report.recruiterSummary || 'Interview summary not yet available.'}</p>
        </div>
      </div>
      <div className="divider" />
      <div className="section-title">Dimension Scores</div>
      <DimensionBar label="Role Fit" scoreObj={scores.roleFit} />
      <DimensionBar label="Communication" scoreObj={scores.communication} />
      <DimensionBar label="Experience" scoreObj={scores.experience} />
      <DimensionBar label="Intent" scoreObj={scores.intent} />
      <DimensionBar label="Problem Solving" scoreObj={scores.problemSolving} />
      <div className="divider" />
      <div className="analysis-columns">
        <StrengthsRisks strengths={report.strengths || []} risks={report.risks || []} />
        <EvidencePanel evidence={report.evidence || []} />
        <div>
          <ExtractedFacts extractedFacts={report.extractedFacts || {}} language={report.language} />
          <FollowUpPanel followUpQuestions={report.followUpQuestions || []} />
        </div>
      </div>
      <div className="next-action mt-12">Recommended next step: {report.nextAction?.label || 'Manual Review Required'}</div>
    </section>
  )
}
