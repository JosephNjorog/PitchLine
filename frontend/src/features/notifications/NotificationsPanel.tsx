import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { formatRelativeTime } from '../../lib/date'
import { useNotifications } from '../../context/NotificationsContext'
import type { AppNotification } from '../../types'

const ICONS: Record<AppNotification['type'], string> = {
  result: '⚽',
  fixture: '📅',
  prediction: '🎯',
  sponsorship: '🤝',
}

export function NotificationsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { notifications, unreadCount, isRead, markAllRead } = useNotifications()

  return (
    <Modal open={open} onClose={onClose} title="Notifications">
      <div className="flex flex-col gap-4">
        {unreadCount > 0 && (
          <Button variant="ghost" size="md" className="self-end" onClick={markAllRead}>
            Mark all as read
          </Button>
        )}
        {notifications.length === 0 ? (
          <EmptyState icon="🔔" title="No notifications yet" />
        ) : (
          <div className="flex max-h-96 flex-col gap-2 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-3 rounded-xl px-3 py-3 ${
                  isRead(notification.id) ? '' : 'bg-sand'
                }`}
              >
                <span className="text-lg leading-none">{ICONS[notification.type]}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ink-900">{notification.message}</p>
                  <p className="mt-0.5 text-xs text-ink-500">{formatRelativeTime(notification.createdAt)}</p>
                </div>
                {!isRead(notification.id) && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-600" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
}
