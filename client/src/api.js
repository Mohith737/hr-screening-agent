const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function getDashboard() {
  const response = await fetch(`${BASE}/api/dashboard/summary`)
  if (!response.ok) throw new Error(`API error ${response.status}: ${response.statusText}`)
  return response.json()
}

export async function getCandidates() {
  const response = await fetch(`${BASE}/api/candidates`)
  if (!response.ok) throw new Error(`API error ${response.status}: ${response.statusText}`)
  return response.json()
}

export async function getCandidate(candidateId) {
  const response = await fetch(`${BASE}/api/candidates/${candidateId}`)
  if (!response.ok) throw new Error(`API error ${response.status}: ${response.statusText}`)
  return response.json()
}

export async function getScreening(screeningId) {
  const response = await fetch(`${BASE}/api/screenings/${screeningId}`)
  if (!response.ok) throw new Error(`API error ${response.status}: ${response.statusText}`)
  return response.json()
}

export async function startScreening(candidateId) {
  const response = await fetch(`${BASE}/api/screenings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidateId }),
  })
  if (!response.ok) throw new Error(`API error ${response.status}: ${response.statusText}`)
  return response.json()
}
