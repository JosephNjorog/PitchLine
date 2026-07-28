import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { FollowedTeamsProvider } from './context/FollowedTeamsContext'
import { ActivityProvider } from './context/ActivityContext'
import { OnboardingProvider } from './context/OnboardingContext'
import { router } from './routes/router'

function App() {
  return (
    <AuthProvider>
      <FollowedTeamsProvider>
        <ActivityProvider>
          <OnboardingProvider>
            <RouterProvider router={router} />
          </OnboardingProvider>
        </ActivityProvider>
      </FollowedTeamsProvider>
    </AuthProvider>
  )
}

export default App
