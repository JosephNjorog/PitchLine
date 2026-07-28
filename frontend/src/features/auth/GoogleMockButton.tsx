import { Button } from '../../components/ui/Button'

export function GoogleMockButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="secondary" size="lg" className="w-full" onClick={onClick}>
      <span aria-hidden className="text-lg">
        G
      </span>
      Continue with Google
    </Button>
  )
}
