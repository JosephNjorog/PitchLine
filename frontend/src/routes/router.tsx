import { createBrowserRouter, Outlet } from 'react-router-dom'
import { PhoneFrame } from '../components/layout/PhoneFrame'
import { NarrowLayout } from '../components/layout/NarrowLayout'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { TeamDashboardLayout } from '../components/layout/TeamDashboardLayout'
import { InstitutionalLayout } from '../components/layout/InstitutionalLayout'
import { RequireAuth } from '../components/RequireAuth'
import { RequireOnboarded } from '../components/RequireOnboarded'
import { RequireRole } from '../components/RequireRole'

import { LandingPage } from '../pages/landing/LandingPage'
import { AuthPage } from '../pages/auth/AuthPage'
import { OtpPage } from '../pages/auth/OtpPage'
import { RoleSelectPage } from '../pages/onboarding/RoleSelectPage'
import { PickTeamsPage } from '../pages/onboarding/fan/PickTeamsPage'
import { AlertPrefsPage } from '../pages/onboarding/fan/AlertPrefsPage'
import { TeamDetailsPage } from '../pages/onboarding/team/TeamDetailsPage'
import { TeamCategoryPage } from '../pages/onboarding/team/TeamCategoryPage'
import { TeamConfirmPage } from '../pages/onboarding/team/TeamConfirmPage'
import { OrgDetailsPage } from '../pages/onboarding/institutional/OrgDetailsPage'
import { SubscriptionTrialPage } from '../pages/onboarding/institutional/SubscriptionTrialPage'
import { JurisdictionTeamsPage } from '../pages/onboarding/institutional/JurisdictionTeamsPage'

import { HomePage } from '../pages/dashboard/HomePage'
import { MatchPage } from '../pages/dashboard/MatchPage'
import { PredictionsPage } from '../pages/dashboard/PredictionsPage'
import { PredictionEntryPage } from '../pages/dashboard/PredictionEntryPage'
import { SponsorPage } from '../pages/dashboard/SponsorPage'
import { SponsorReceiptPage } from '../pages/dashboard/SponsorReceiptPage'
import { ProfilePage } from '../pages/dashboard/ProfilePage'
import { TeamProfilePage } from '../pages/dashboard/TeamProfilePage'

import { TeamHomePage } from '../pages/team/TeamHomePage'
import { TeamFixturesPage } from '../pages/team/TeamFixturesPage'
import { NewFixturePage } from '../pages/team/NewFixturePage'
import { EditFixturePage } from '../pages/team/EditFixturePage'
import { SubmitResultPage } from '../pages/team/SubmitResultPage'
import { RosterPage } from '../pages/team/RosterPage'
import { FollowersPage } from '../pages/team/FollowersPage'
import { TeamProfilePage as TeamOwnProfilePage } from '../pages/team/TeamProfilePage'

import { IndexRedirect } from '../pages/institutional/IndexRedirect'
import { DiscoverPage } from '../pages/institutional/DiscoverPage'
import { ManagePage } from '../pages/institutional/ManagePage'
import { AccountPage } from '../pages/institutional/AccountPage'

import { NotFoundPage } from '../pages/NotFoundPage'

function RootLayout() {
  return (
    <div className="min-h-screen w-full">
      <Outlet />
    </div>
  )
}

function PhoneFrameLayout() {
  return (
    <PhoneFrame>
      <Outlet />
    </PhoneFrame>
  )
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <PhoneFrameLayout />,
        children: [
          { path: '/', element: <LandingPage /> },
          { path: '/auth', element: <AuthPage /> },
          { path: '/auth/otp', element: <OtpPage /> },
          {
            element: <RequireAuth />,
            children: [
              { path: '/onboarding', element: <RoleSelectPage /> },
              {
                element: <NarrowLayout />,
                children: [
                  { path: '/onboarding/fan/teams', element: <PickTeamsPage /> },
                  { path: '/onboarding/fan/alerts', element: <AlertPrefsPage /> },
                  { path: '/onboarding/team/details', element: <TeamDetailsPage /> },
                  { path: '/onboarding/team/category', element: <TeamCategoryPage /> },
                  { path: '/onboarding/team/confirm', element: <TeamConfirmPage /> },
                  { path: '/onboarding/institutional/:role/org', element: <OrgDetailsPage /> },
                  {
                    path: '/onboarding/institutional/scout/subscription',
                    element: <SubscriptionTrialPage />,
                  },
                  {
                    path: '/onboarding/institutional/league/jurisdiction',
                    element: <JurisdictionTeamsPage />,
                  },
                ],
              },
              {
                element: <RequireOnboarded />,
                children: [
                  {
                    element: <RequireRole allow={['fan']} />,
                    children: [
                      {
                        element: <DashboardLayout />,
                        children: [
                          { path: '/dashboard', element: <HomePage /> },
                          { path: '/dashboard/match/:id', element: <MatchPage /> },
                          { path: '/dashboard/team/:id', element: <TeamProfilePage /> },
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
                  {
                    element: <RequireRole allow={['team']} />,
                    children: [
                      {
                        element: <TeamDashboardLayout />,
                        children: [
                          { path: '/team', element: <TeamHomePage /> },
                          { path: '/team/fixtures', element: <TeamFixturesPage /> },
                          { path: '/team/fixtures/new', element: <NewFixturePage /> },
                          { path: '/team/fixtures/:id/edit', element: <EditFixturePage /> },
                          { path: '/team/fixtures/:id/result', element: <SubmitResultPage /> },
                          { path: '/team/roster', element: <RosterPage /> },
                          { path: '/team/followers', element: <FollowersPage /> },
                          { path: '/team/profile', element: <TeamOwnProfilePage /> },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        element: <RequireAuth />,
        children: [
          {
            element: <RequireOnboarded />,
            children: [
              {
                element: <RequireRole allow={['scout', 'league']} />,
                children: [
                  {
                    element: <InstitutionalLayout />,
                    children: [
                      { path: '/institutional', element: <IndexRedirect /> },
                      { path: '/institutional/discover', element: <DiscoverPage /> },
                      { path: '/institutional/manage', element: <ManagePage /> },
                      { path: '/institutional/account', element: <AccountPage /> },
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
