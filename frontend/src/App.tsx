import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { FollowedTeamsProvider } from './context/FollowedTeamsContext'
import { ActivityProvider } from './context/ActivityContext'
import { OnboardingProvider } from './context/OnboardingContext'
import { MyTeamProvider } from './context/MyTeamContext'
import { TeamOpsProvider } from './context/TeamOpsContext'
import { RosterProvider } from './context/RosterContext'
import { MyOrgProvider } from './context/MyOrgContext'
import { AdminFixturesProvider } from './context/AdminFixturesContext'
import { NotificationsProvider } from './context/NotificationsContext'
import { CommentsProvider } from './context/CommentsContext'
import { router } from './routes/router'

function App() {
  return (
    <AuthProvider>
      <FollowedTeamsProvider>
        <ActivityProvider>
          <OnboardingProvider>
            <MyTeamProvider>
              <TeamOpsProvider>
                <RosterProvider>
                  <MyOrgProvider>
                    <AdminFixturesProvider>
                      <NotificationsProvider>
                        <CommentsProvider>
                          <RouterProvider router={router} />
                        </CommentsProvider>
                      </NotificationsProvider>
                    </AdminFixturesProvider>
                  </MyOrgProvider>
                </RosterProvider>
              </TeamOpsProvider>
            </MyTeamProvider>
          </OnboardingProvider>
        </ActivityProvider>
      </FollowedTeamsProvider>
    </AuthProvider>
  )
}

export default App
