import { useEffect, useState } from 'react'
import './App.css'
import { getCandidates, getDashboard, startScreening } from './api'
import Sidebar from './components/Sidebar'
import CandidateView from './components/CandidateView'
import OperationalDashboard from './components/OperationalDashboard'
import ComparisonDrawer from './components/ComparisonDrawer'

export default function App() {
  const [view, setView] = useState('dashboard')
  const [selectedCandidateId, setSelectedCandidateId] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [dashboardData, setDashboardData] = useState(null)
  const [triggeringId, setTriggeringId] = useState(null)
  const [comparisonIds, setComparisonIds] = useState([])
  const [showComparison, setShowComparison] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([getCandidates(), getDashboard()])
      .then(([candidateData, dashboard]) => {
        if (cancelled) return
        setCandidates(candidateData)
        setDashboardData(dashboard)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!candidates.some((c) => c.displayStatus?.code === 'screening')) return
    const intervalId = setInterval(async () => {
      try {
        const updated = await getCandidates()
        setCandidates(updated)
        if (!updated.some((c) => c.displayStatus?.code === 'screening')) clearInterval(intervalId)
      } catch {
      }
    }, 12000)
    return () => clearInterval(intervalId)
  }, [candidates])

  function handleSelectCandidate(id) {
    setView('candidate')
    setSelectedCandidateId(id)
  }

  function handleGoToDashboard() {
    setView('dashboard')
    setSelectedCandidateId(null)
  }

  function handleToggleCompare(candidateId) {
    setComparisonIds((ids) => {
      if (ids.includes(candidateId)) return ids.filter((id) => id !== candidateId)
      if (ids.length >= 3) return ids
      return [...ids, candidateId]
    })
  }

  async function handleStartScreening(candidateId) {
    setTriggeringId(candidateId)
    try {
      await startScreening(candidateId)
      setCandidates(await getCandidates())
    } catch {
    } finally {
      setTriggeringId(null)
    }
  }

  return (
    <div className="app-layout">
      <Sidebar candidates={candidates} selectedId={selectedCandidateId} comparisonIds={comparisonIds} onSelect={handleSelectCandidate} onDashboard={handleGoToDashboard} onToggleCompare={handleToggleCompare} onOpenComparison={() => setShowComparison(true)} onClearComparison={() => setComparisonIds([])} view={view} />
      <main className="main-content">
        {view === 'dashboard'
          ? <OperationalDashboard data={dashboardData} candidates={candidates} onSelectCandidate={handleSelectCandidate} />
          : <CandidateView candidateId={selectedCandidateId} triggeringId={triggeringId} onStartScreening={handleStartScreening} allCandidates={candidates} />}
      </main>
      {showComparison && comparisonIds.length >= 2 && <ComparisonDrawer candidateIds={comparisonIds} onClose={() => setShowComparison(false)} />}
    </div>
  )
}
