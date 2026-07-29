import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { apiGet, apiPost, getToken } from '../lib/api'
import type { AppNotification } from '../types'

interface ApiNotification extends AppNotification {
  readAt?: string
}

interface NotificationsContextValue {
  notifications: AppNotification[]
  unreadCount: number
  isRead: (id: string) => boolean
  markAllRead: () => Promise<void>
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<ApiNotification[]>([])

  useEffect(() => {
    if (!getToken()) return
    apiGet<ApiNotification[]>('/notifications').then(setNotifications).catch(() => {})
  }, [])

  const unreadCount = notifications.filter((n) => !n.readAt).length

  function isRead(id: string) {
    return notifications.find((n) => n.id === id)?.readAt != null
  }

  async function markAllRead() {
    const now = new Date().toISOString()
    setNotifications((prev) => prev.map((n) => ({ ...n, readAt: n.readAt ?? now })))
    try {
      await apiPost('/notifications/read-all')
    } catch {
      // best-effort
    }
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
