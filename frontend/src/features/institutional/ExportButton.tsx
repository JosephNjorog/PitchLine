import { Button } from '../../components/ui/Button'
import { downloadCsv } from '../../lib/csv'

interface ExportButtonProps {
  filename: string
  rows: Record<string, string | number>[]
  label?: string
}

export function ExportButton({ filename, rows, label = 'Export CSV' }: ExportButtonProps) {
  return (
    <Button
      variant="secondary"
      size="md"
      disabled={rows.length === 0}
      onClick={() => downloadCsv(filename, rows)}
    >
      ⬇ {label}
    </Button>
  )
}
