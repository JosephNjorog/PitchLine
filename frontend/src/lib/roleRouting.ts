import type { Role } from '../types'

export function dashboardPathForRole(role: Role | null | undefined): string {
  switch (role) {
    case 'fan':
      return '/dashboard'
    case 'team':
      return '/team'
    case 'scout':
    case 'league':
      return '/institutional'
    default:
      return '/onboarding'
  }
}
