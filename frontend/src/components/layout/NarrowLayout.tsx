import { Outlet } from 'react-router-dom'

/** Centers auth/onboarding forms to a comfortable width instead of stretching edge to edge on desktop. */
export function NarrowLayout() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
      <Outlet />
    </div>
  )
}
