import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader'
import { Button } from '../../components/ui/Button'
import {
  SponsorTargetPicker,
  type SponsorTargetType,
} from '../../features/sponsorship/SponsorTargetPicker'
import { AmountPicker } from '../../features/sponsorship/AmountPicker'
import { MobileMoneyConfirmModal } from '../../features/sponsorship/MobileMoneyConfirmModal'
import { useActivity } from '../../context/ActivityContext'
import type { Athlete, Team } from '../../types'

export function SponsorPage() {
  const navigate = useNavigate()
  const { addSponsorship } = useActivity()
  const [team, setTeam] = useState<Team | null>(null)
  const [targetType, setTargetType] = useState<SponsorTargetType>('team')
  const [athlete, setAthlete] = useState<Athlete | null>(null)
  const [amount, setAmount] = useState(100)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const targetLabel = targetType === 'team' ? team?.name : (athlete?.name ?? 'the player')
  const canSend = Boolean(team) && amount > 0 && (targetType === 'team' || athlete !== null)

  async function handleConfirmed() {
    if (!team || submitting) return
    if (targetType === 'player' && !athlete) return
    setSubmitting(true)
    try {
      const targetId = targetType === 'team' ? team.id : athlete!.id
      const sponsorship = await addSponsorship(targetType, targetId, amount)
      setModalOpen(false)
      navigate(`/dashboard/sponsor/receipt/${sponsorship.id}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-4">
      <PageHeader title="Sponsor a team" />
      <div className="flex flex-col gap-6 px-4">
        <SponsorTargetPicker
          selectedTeam={team}
          onSelectTeam={setTeam}
          targetType={targetType}
          onTargetTypeChange={setTargetType}
          selectedAthlete={athlete}
          onSelectAthlete={setAthlete}
        />
        {team && <AmountPicker amount={amount} onChange={setAmount} />}
        {team && (
          <Button size="lg" className="w-full" disabled={!canSend} onClick={() => setModalOpen(true)}>
            Send support
          </Button>
        )}
      </div>
      <MobileMoneyConfirmModal
        open={modalOpen}
        amount={amount}
        label={targetLabel ?? ''}
        onClose={() => setModalOpen(false)}
        onConfirmed={handleConfirmed}
      />
    </div>
  )
}
