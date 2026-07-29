import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { NOTIFICATIONS } from '../mock-data'
import type { AppNotification } from '../types'

interface NotificationsContextValue {
  notifications: AppNotification[]
  unreadCount: number
  isRead: (id: string) => boolean
  markAllRead: () => void
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [readIds, setReadIds] = useLocalStorage<string[]>('pitchline:readNotifications', [])

  const notifications = useMemo(
    () => [...NOTIFICATIONS].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [],
  )

  const unreadCount = notifications.filter((n) => !readIds.includes(n.id)).length

  function isRead(id: string) {
    return readIds.includes(id)
  }

  function markAllRead() {
    setReadIds(notifications.map((n) => n.id))
  }

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, isRead, markAllRead }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider')
  return ctx
}
