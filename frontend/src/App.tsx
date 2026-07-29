import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CatalogProvider } from './context/CatalogContext'
import { FollowedTeamsProvider } from './context/FollowedTeamsContext'
import { ActivityProvider } from './context/ActivityContext'
import { OnboardingProvider } from './context/OnboardingContext'
import { MyTeamProvider } from './context/MyTeamContext'
import { TeamOpsProvider } from './context/TeamOpsContext'
import { RosterProvider } from './context/RosterContext'
import { MyOrgProvider } from './context/MyOrgContext'
import { ShortlistProvider } from './context/ShortlistContext'
import { NotificationsProvider } from './context/NotificationsContext'
import { CommentsProvider } from './context/CommentsContext'
import { router } from './routes/router'

function App() {
  return (
    <AuthProvider>
      <CatalogProvider>
        <FollowedTeamsProvider>
          <ActivityProvider>
            <OnboardingProvider>
              <MyTeamProvider>
                <TeamOpsProvider>
                  <RosterProvider>
                    <MyOrgProvider>
                      <ShortlistProvider>
                        <NotificationsProvider>
                          <CommentsProvider>
                            <RouterProvider router={router} />
                          </CommentsProvider>
                        </NotificationsProvider>
                      </ShortlistProvider>
                    </MyOrgProvider>
                  </RosterProvider>
                </TeamOpsProvider>
              </MyTeamProvider>
            </OnboardingProvider>
          </ActivityProvider>
        </FollowedTeamsProvider>
      </CatalogProvider>
    </AuthProvider>
  )
}

export default App
