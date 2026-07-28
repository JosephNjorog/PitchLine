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
import { useAuth } from '../../context/AuthContext'
import type { Team } from '../../types'

const PLATFORM_FEE_PCT = 0.1

export function SponsorPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addSponsorship } = useActivity()
  const [team, setTeam] = useState<Team | null>(null)
  const [targetType, setTargetType] = useState<SponsorTargetType>('team')
  const [playerName, setPlayerName] = useState('')
  const [amount, setAmount] = useState(100)
  const [modalOpen, setModalOpen] = useState(false)

  const targetLabel = targetType === 'team' ? team?.name : playerName.trim() || 'the player'
  const canSend = Boolean(team) && amount > 0 && (targetType === 'team' || playerName.trim().length > 0)

  function handleConfirmed() {
    if (!team) return
    const platformFeeAmount = Math.round(amount * PLATFORM_FEE_PCT)
    const sponsorship = addSponsorship({
      accountId: user?.id ?? 'guest',
      targetType,
      targetId: targetType === 'team' ? team.id : `${team.id}:${playerName.trim()}`,
      targetLabel: targetLabel ?? team.name,
      amount,
      platformFeePct: PLATFORM_FEE_PCT,
      platformFeeAmount,
      netToTeamAmount: amount - platformFeeAmount,
    })
    setModalOpen(false)
    navigate(`/dashboard/sponsor/receipt/${sponsorship.id}`)
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
          playerName={playerName}
          onPlayerNameChange={setPlayerName}
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
