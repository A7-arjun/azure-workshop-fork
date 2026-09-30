async function request(path, options) {
  let res
  try {
    res = await fetch(`/api${path}`, options)
  } catch {
    throw new Error('Cannot reach the API — is the backend running on port 4000?')
  }
  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const body = await res.json()
      if (body.error) message = body.error
    } catch {
      // keep default message
    }
    throw new Error(message)
  }
  return res.json()
}

export const api = {
  stats: () => request('/stats'),
  quizzes: () => request('/quizzes'),
  quiz: (slug) => request(`/quizzes/${slug}`),
  leaderboard: (slug) => request(`/quizzes/${slug}/leaderboard`),
  submitAttempt: (slug, payload) =>
    request(`/quizzes/${slug}/attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
}

export function formatDuration(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds))
  const m = Math.floor(s / 60)
  if (m === 0) return `${s}s`
  return `${m}m ${String(s % 60).padStart(2, '0')}s`
}

export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}
