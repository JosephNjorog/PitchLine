import type { AppNotification } from '../types'

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-001',
    type: 'result',
    message: 'Nairobi Thunder FC beat Kibera Rangers 2-1 — Brian Otieno named MOTM.',
    createdAt: '2026-07-25T15:10:00Z',
  },
  {
    id: 'notif-002',
    type: 'fixture',
    message: 'Mombasa Sharks RFC vs Tudor Tridents kicks off — follow along live.',
    createdAt: '2026-07-28T13:30:00Z',
  },
  {
    id: 'notif-003',
    type: 'prediction',
    message: 'Predictions are open for Kibera Rangers vs Eldoret Eagles.',
    createdAt: '2026-07-27T09:00:00Z',
  },
  {
    id: 'notif-004',
    type: 'result',
    message: 'Eldoret Eagles drew 3-3 with Machakos Hills FC in a seven-goal thriller.',
    createdAt: '2026-07-26T12:45:00Z',
  },
  {
    id: 'notif-005',
    type: 'sponsorship',
    message: 'Nyeri Blind Strikers are close to their season fundraising goal — back a player today.',
    createdAt: '2026-07-24T08:00:00Z',
  },
]
