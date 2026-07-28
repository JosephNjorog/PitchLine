import { Card } from '../../components/ui/Card'
import { Toggle } from '../../components/ui/Toggle'
import { useAlertPreference } from '../../hooks/useAlertPreference'

export function NotificationPrefsToggle() {
  const [alertPreference, setAlertPreference] = useAlertPreference()

  return (
    <Card>
      <Toggle
        checked={alertPreference === 'in-app+sms'}
        onChange={(checked) => setAlertPreference(checked ? 'in-app+sms' : 'in-app')}
        label="Also send result alerts by SMS"
        description="In-app alerts are always on. SMS costs money to send."
      />
    </Card>
  )
}
