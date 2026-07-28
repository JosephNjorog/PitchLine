import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/Button'
import { FeeSplitBreakdown } from '../../features/sponsorship/FeeSplitBreakdown'
import { useActivity } from '../../context/ActivityContext'

export function SponsorReceiptPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { sponsorships } = useActivity()
  const sponsorship = sponsorships.find((s) => s.id === id)

  if (!sponsorship) return <Navigate to="/dashboard/sponsor" replace />

  return (
    <div className="flex flex-col gap-6 pb-4">
      <TopBar title="Receipt" />
      <div className="flex flex-col items-center gap-2 px-4 text-center">
        <span className="text-4xl">🙌</span>
        <h1 className="text-lg font-bold text-ink-900">Thank you for the support!</h1>
        <p className="text-sm text-ink-500">Your contribution helps {sponsorship.targetLabel} keep going.</p>
      </div>
      <div className="px-4">
        <FeeSplitBreakdown sponsorship={sponsorship} />
      </div>
      <div className="px-4">
        <Button size="lg" className="w-full" onClick={() => navigate('/dashboard')}>
          Back to home
        </Button>
      </div>
    </div>
  )
}
