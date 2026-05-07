import {
  createDemoScreening,
  getDemoCandidate,
  getDemoCandidates,
  getDemoDashboard,
  getDemoScreening,
} from './demoData'

function resolveDemo(value) {
  return Promise.resolve(value)
}

export async function getDashboard() {
  return resolveDemo(getDemoDashboard())
}

export async function getCandidates() {
  return resolveDemo(getDemoCandidates())
}

export async function getCandidate(candidateId) {
  return resolveDemo(getDemoCandidate(candidateId))
}

export async function getScreening(screeningId) {
  return resolveDemo(getDemoScreening(screeningId))
}

export async function startScreening(candidateId) {
  return resolveDemo(createDemoScreening(candidateId))
}
