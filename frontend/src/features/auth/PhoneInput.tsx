import { Input } from '../../components/ui/Input'

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
}

export function PhoneInput({ value, onChange }: PhoneInputProps) {
  return (
    <Input
      label="Phone number"
      type="tel"
      inputMode="tel"
      placeholder="07XX XXX XXX"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      hint="We'll text you a one-time code."
    />
  )
}
