export default function TranscriptMessage({ turn, isEvidenceMatch }) {
  const speaker = turn.speaker === 'agent' ? 'agent' : 'candidate'

  return (
    <div className={`transcript-turn-wrapper ${speaker}`}>
      <div className="transcript-speaker">{speaker === 'agent' ? 'AI Recruiter' : 'Candidate'}</div>
      <div className={`transcript-turn ${speaker} ${isEvidenceMatch ? 'evidence-match' : ''}`}>
        {turn.text || ''}
        {isEvidenceMatch && (
          <div className="evidence-match-label">
            <span>◆</span>
            <span>Evidence captured</span>
          </div>
        )}
      </div>
    </div>
  )
}
