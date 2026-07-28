import { useLocalStorage } from './useLocalStorage'

export type AlertPreference = 'in-app' | 'in-app+sms'

export function useAlertPreference() {
  return useLocalStorage<AlertPreference>('pitchline:alertPreference', 'in-app')
}
