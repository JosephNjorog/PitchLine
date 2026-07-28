const PARTNERS = ['Nyeri county', 'Meru schools', 'Nairobi Women in Tech', 'Elom Labs']

export function TrustedBySection() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-ink-500">Trusted by county leagues and school federations</p>
      <div className="scroll-x-hide flex gap-3 overflow-x-auto">
        {PARTNERS.map((partner) => (
          <span
            key={partner}
            className="shrink-0 rounded-full bg-sand px-4 py-2 text-sm text-ink-900"
          >
            {partner}
          </span>
        ))}
      </div>
    </div>
  )
}
