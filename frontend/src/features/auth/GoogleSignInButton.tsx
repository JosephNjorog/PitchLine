import { useEffect, useRef } from 'react'

interface GoogleCredentialResponse {
  credential: string
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (response: GoogleCredentialResponse) => void
          }) => void
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void
        }
      }
    }
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export function GoogleSignInButton({ onCredential }: { onCredential: (idToken: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !containerRef.current) return

    function render() {
      if (!containerRef.current) return
      window.google!.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID!,
        callback: (response) => onCredential(response.credential),
      })
      window.google!.accounts.id.renderButton(containerRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
      })
    }

    if (window.google?.accounts?.id) {
      render()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = render
    document.head.appendChild(script)
  }, [onCredential])

  if (!GOOGLE_CLIENT_ID) {
    return (
      <div className="w-full rounded-lg border border-dashed border-ink-200 px-4 py-3 text-center text-sm text-ink-400">
        Google sign-in not configured
      </div>
    )
  }

  return <div ref={containerRef} className="flex w-full justify-center" />
}
