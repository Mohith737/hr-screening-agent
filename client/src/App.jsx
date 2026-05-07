import { useEffect, useState } from 'react'
import './App.css'
import { getCandidates, getDashboard, startScreening } from './api'
import Sidebar from './components/Sidebar'
import DashboardView from './components/DashboardView'
import CandidateView from './components/CandidateView'

export default function App() {
  const [view, setView] = useState('dashboard')
  const [selectedCandidateId, setSelectedCandidateId] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [dashboardData, setDashboardData] = useState(null)
  const [triggeringId, setTriggeringId] = useState(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([getCandidates(), getDashboard()])
      .then(([candidateData, dashboard]) => {
        if (cancelled) return
        setCandidates(candidateData)
        setDashboardData(dashboard)
      })
      .catch((error) => console.error(error))
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!candidates.some((c) => c.displayStatus?.code === 'screening')) return

    const intervalId = setInterval(async () => {
      try {
        const updated = await getCandidates()
        const selectedWasScreening = candidates.some((c) =>
          c.id === selectedCandidateId && c.displayStatus?.code === 'screening')
        const selectedIsCompleted = updated.some((c) =>
          c.id === selectedCandidateId && c.displayStatus?.code === 'completed')

        setCandidates(updated)
        if (!updated.some((c) => c.displayStatus?.code === 'screening')) clearInterval(intervalId)
        if (selectedWasScreening && selectedIsCompleted) setDashboardData(await getDashboard())
      } catch (error) {
        console.error(error)
      }
    }, 12000)

    return () => clearInterval(intervalId)
  }, [candidates, selectedCandidateId])

  function handleSelectCandidate(id) {
    setView('candidate')
    setSelectedCandidateId(id)
  }

  function handleGoToDashboard() {
    setView('dashboard')
    setSelectedCandidateId(null)
  }

  async function handleStartScreening(candidateId) {
    setTriggeringId(candidateId)
    try {
      await startScreening(candidateId)
      setCandidates(await getCandidates())
    } catch (error) {
      console.error(error)
    } finally {
      setTriggeringId(null)
    }
  }

  return (
    <div className="app-layout">
      <Sidebar candidates={candidates} selectedId={selectedCandidateId} onSelect={handleSelectCandidate} onDashboard={handleGoToDashboard} view={view} />
      <main className="main-content">
        {view === 'dashboard'
          ? <DashboardView data={dashboardData} onSelectCandidate={handleSelectCandidate} />
          : <CandidateView candidateId={selectedCandidateId} triggeringId={triggeringId} onStartScreening={handleStartScreening} />}
      </main>
    </div>
  )
}
