import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="text-4xl">🧭</span>
      <h1 className="text-lg font-bold text-ink-900">Page not found</h1>
      <Link to="/">
        <Button>Back to home</Button>
      </Link>
    </div>
  )
}
