export function Logo({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <img
      src="/pitchline-logo.svg"
      alt="PitchLine"
      width={size}
      height={size}
      className={`rounded-[22%] ${className}`}
    />
  )
}
