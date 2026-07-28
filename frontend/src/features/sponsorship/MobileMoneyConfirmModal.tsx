import { useEffect, useState } from 'react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { formatKes } from '../../lib/currency'

interface MobileMoneyConfirmModalProps {
  open: boolean
  amount: number
  label: string
  onClose: () => void
  onConfirmed: () => void
}

type Stage = 'confirm' | 'processing' | 'done'

export function MobileMoneyConfirmModal({
  open,
  amount,
  label,
  onClose,
  onConfirmed,
}: MobileMoneyConfirmModalProps) {
  const [stage, setStage] = useState<Stage>('confirm')

  useEffect(() => {
    if (open) setStage('confirm')
  }, [open])

  useEffect(() => {
    if (stage !== 'processing') return
    const timeout = setTimeout(() => setStage('done'), 1400)
    return () => clearTimeout(timeout)
  }, [stage])

  useEffect(() => {
    if (stage !== 'done') return
    const timeout = setTimeout(onConfirmed, 700)
    return () => clearTimeout(timeout)
  }, [stage, onConfirmed])

  return (
    <Modal open={open} onClose={onClose} title="Confirm via mobile money">
      {stage === 'confirm' && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-ink-500">
            You're about to send <span className="font-semibold text-ink-900">{formatKes(amount)}</span> for{' '}
            {label}. You'll get an M-Pesa prompt on your phone to enter your PIN.
          </p>
          <Button size="lg" className="w-full" onClick={() => setStage('processing')}>
            Confirm {formatKes(amount)}
          </Button>
        </div>
      )}
      {stage === 'processing' && (
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-pitch-700/20 border-t-pitch-700" />
          <p className="text-sm text-ink-500">Waiting for M-Pesa confirmation…</p>
        </div>
      )}
      {stage === 'done' && (
        <div className="flex flex-col items-center gap-2 py-6">
          <span className="text-3xl">✅</span>
          <p className="font-semibold text-ink-900">Payment confirmed</p>
        </div>
      )}
    </Modal>
  )
}
