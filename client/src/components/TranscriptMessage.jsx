export default function TranscriptMessage({ turn, isEvidenceMatch }) {
  const speaker = turn.speaker === 'agent' ? 'agent' : 'candidate'

  return (
    <div className={`transcript-turn ${speaker} ${isEvidenceMatch ? 'evidence-match' : ''}`}>
      <div className="transcript-speaker">{speaker === 'agent' ? 'AI Recruiter' : 'Candidate'}</div>
      <div>{turn.text || ''}</div>
      {isEvidenceMatch && <div className="evidence-match-label">Evidence captured</div>}
    </div>
  )
}
