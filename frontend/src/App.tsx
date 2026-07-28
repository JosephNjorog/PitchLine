import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { FollowedTeamsProvider } from './context/FollowedTeamsContext'
import { ActivityProvider } from './context/ActivityContext'
import { OnboardingProvider } from './context/OnboardingContext'
import { MyTeamProvider } from './context/MyTeamContext'
import { TeamOpsProvider } from './context/TeamOpsContext'
import { MyOrgProvider } from './context/MyOrgContext'
import { AdminFixturesProvider } from './context/AdminFixturesContext'
import { router } from './routes/router'

function App() {
  return (
    <AuthProvider>
      <FollowedTeamsProvider>
        <ActivityProvider>
          <OnboardingProvider>
            <MyTeamProvider>
              <TeamOpsProvider>
                <MyOrgProvider>
                  <AdminFixturesProvider>
                    <RouterProvider router={router} />
                  </AdminFixturesProvider>
                </MyOrgProvider>
              </TeamOpsProvider>
            </MyTeamProvider>
          </OnboardingProvider>
        </ActivityProvider>
      </FollowedTeamsProvider>
    </AuthProvider>
  )
}

export default App
