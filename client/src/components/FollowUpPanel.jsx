export default function FollowUpPanel({ followUpQuestions = [] }) {
  if (!followUpQuestions.length) return null

  return (
    <div className="mt-12">
      <div className="section-title">Follow-Up Questions</div>
      <ol className="follow-up-list">
        {followUpQuestions.map((question) => (
          <li key={question}>{question}</li>
        ))}
      </ol>
    </div>
  )
}
