import { createBrowserRouter, Outlet } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { RequireAuth } from '../components/RequireAuth'
import { RequireOnboarded } from '../components/RequireOnboarded'
import { RequireFanRole } from '../components/RequireFanRole'

import { LandingPage } from '../pages/landing/LandingPage'
import { AuthPage } from '../pages/auth/AuthPage'
import { OtpPage } from '../pages/auth/OtpPage'
import { RoleSelectPage } from '../pages/onboarding/RoleSelectPage'
import { PickTeamsPage } from '../pages/onboarding/fan/PickTeamsPage'
import { AlertPrefsPage } from '../pages/onboarding/fan/AlertPrefsPage'
import { ComingSoonPage } from '../pages/coming-soon/ComingSoonPage'
import { HomePage } from '../pages/dashboard/HomePage'
import { MatchPage } from '../pages/dashboard/MatchPage'
import { PredictionsPage } from '../pages/dashboard/PredictionsPage'
import { PredictionEntryPage } from '../pages/dashboard/PredictionEntryPage'
import { SponsorPage } from '../pages/dashboard/SponsorPage'
import { SponsorReceiptPage } from '../pages/dashboard/SponsorReceiptPage'
import { ProfilePage } from '../pages/dashboard/ProfilePage'
import { NotFoundPage } from '../pages/NotFoundPage'

function RootLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/auth', element: <AuthPage /> },
      { path: '/auth/otp', element: <OtpPage /> },
      {
        element: <RequireAuth />,
        children: [
          { path: '/onboarding', element: <RoleSelectPage /> },
          { path: '/onboarding/fan/teams', element: <PickTeamsPage /> },
          { path: '/onboarding/fan/alerts', element: <AlertPrefsPage /> },
          { path: '/onboarding/coming-soon/:role', element: <ComingSoonPage /> },
          {
            element: <RequireOnboarded />,
            children: [
              {
                element: <RequireFanRole />,
                children: [
                  {
                    element: <DashboardLayout />,
                    children: [
                      { path: '/dashboard', element: <HomePage /> },
                      { path: '/dashboard/match/:id', element: <MatchPage /> },
                      { path: '/dashboard/predictions', element: <PredictionsPage /> },
                      {
                        path: '/dashboard/predictions/:roundId/enter',
                        element: <PredictionEntryPage />,
                      },
                      { path: '/dashboard/sponsor', element: <SponsorPage /> },
                      { path: '/dashboard/sponsor/receipt/:id', element: <SponsorReceiptPage /> },
                      { path: '/dashboard/profile', element: <ProfilePage /> },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
