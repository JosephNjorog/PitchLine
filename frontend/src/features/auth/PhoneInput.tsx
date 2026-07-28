import { Input } from '../../components/ui/Input'

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
}

export function PhoneInput({ value, onChange }: PhoneInputProps) {
  return (
    <Input
      type="tel"
      inputMode="tel"
      placeholder="Phone number"
      aria-label="Phone number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
