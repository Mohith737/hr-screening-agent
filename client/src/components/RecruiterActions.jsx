export default function RecruiterActions({ candidate, isTriggering, onStart }) {
  const status = candidate.displayStatus?.code

  if (status === 'screening') {
    return (
      <section className="card action-strip">
        <div className="flex items-center gap-8 color-blue">
          <span className="status-dot pulse" style={{ background: 'var(--blue)' }} />
          <span>Screening in progress — results will appear automatically</span>
        </div>
      </section>
    )
  }

  if (status === 'completed') {
    return <section className="card color-green font-semibold">Screening Complete</section>
  }

  if (status === 'failed') {
    return (
      <section className="card action-strip">
        <span className="color-red font-semibold">Call Failed — Retry?</span>
        <button className="btn btn-primary" onClick={onStart} disabled={isTriggering} type="button">
          {isTriggering ? 'Calling...' : 'Start Screening'}
        </button>
      </section>
    )
  }

  if (candidate.canTriggerScreening) {
    return (
      <section className="card action-strip">
        <span className="text-secondary">Start the AI screening call when ready.</span>
        <button className="btn btn-primary" onClick={onStart} disabled={isTriggering} type="button">
          {isTriggering ? 'Calling...' : 'Start Screening'}
        </button>
      </section>
    )
  }

  return null
}
