import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '../../components/ui/Avatar'
import { SearchBar } from '../../components/ui/SearchBar'
import { useCatalog } from '../../context/CatalogContext'

export function TeamQuickSearch() {
  const navigate = useNavigate()
  const { searchTeams } = useCatalog()
  const containerRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const results = query.trim().length > 0 ? searchTeams(query).slice(0, 6) : []

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(teamId: string) {
    setQuery('')
    setOpen(false)
    navigate(`/dashboard/team/${teamId}`)
  }

  return (
    <div ref={containerRef} className="relative">
      <SearchBar
        placeholder="Search teams, counties..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
      />
      {open && query.trim().length > 0 && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-paper shadow-lg">
          {results.length > 0 ? (
            results.map((team) => (
              <button
                key={team.id}
                type="button"
                onClick={() => handleSelect(team.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-sand"
              >
                <Avatar name={team.name} color={team.crestColor} size={32} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink-900">{team.name}</p>
                  <p className="truncate text-xs text-ink-500">
                    {team.county} · {team.sport}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-ink-500">No teams match "{query}"</p>
          )}
        </div>
      )}
    </div>
  )
}
