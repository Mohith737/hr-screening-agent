export default function FollowUpPanel({ followUpQuestions = [] }) {
  if (!followUpQuestions.length) return null

  return (
    <div className="mt-12">
      <div className="field-label" style={{ marginBottom: '14px' }}>Suggested Follow-Up Questions</div>
      <div className="meta-text" style={{ marginBottom: '12px' }}>
        Recommended based on gaps identified in this interview.
      </div>
      <ol className="follow-up-list">
        {followUpQuestions.map((question) => (
          <li key={question}>{question}</li>
        ))}
      </ol>
    </div>
  )
}
