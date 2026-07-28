export function formatKickoff(iso: string) {
  const date = new Date(iso)
  return date.toLocaleString('en-KE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatRelativeTime(iso: string) {
  const now = Date.now()
  const then = new Date(iso).getTime()
  const diffMs = then - now
  const diffMinutes = Math.round(diffMs / 60000)
  const diffHours = Math.round(diffMinutes / 60)
  const diffDays = Math.round(diffHours / 24)

  if (Math.abs(diffMinutes) < 60) {
    return diffMinutes === 0
      ? 'now'
      : diffMinutes > 0
        ? `in ${diffMinutes}m`
        : `${Math.abs(diffMinutes)}m ago`
  }
  if (Math.abs(diffHours) < 24) {
    return diffHours > 0 ? `in ${diffHours}h` : `${Math.abs(diffHours)}h ago`
  }
  return diffDays > 0 ? `in ${diffDays}d` : `${Math.abs(diffDays)}d ago`
}
