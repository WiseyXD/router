import * as React from 'react'
import { CatchBoundary } from './CatchBoundary'
import { useRouterState } from './useRouterState'
import { RegisteredRouter, RouteIds } from '.'

export type NotFoundError = {
  global?: boolean
  data?: any
  throw?: boolean
  route?: RouteIds<RegisteredRouter['routeTree']>
}

export function notFound(options: NotFoundError = {}) {
  ;(options as any).isNotFound = true
  if (options.throw) throw options
  return options
}

export function isNotFound(obj: any): obj is NotFoundError {
  return !!obj?.isNotFound
}

export function CatchNotFound(props: {
  fallback?: (error: NotFoundError) => React.ReactElement
  onCatch?: (error: any) => void
  children: React.ReactNode
}) {
  // TODO: Some way for the user to programmatically reset the not-found boundary?
  const resetKey = useRouterState({
    select: (s) => `not-found-${s.location.pathname}-${s.status}`,
  })

  return (
    <CatchBoundary
      getResetKey={() => resetKey}
      onCatch={(error) => {
        if (isNotFound(error)) {
          props.onCatch?.(error)
        } else {
          throw error
        }
      }}
      errorComponent={({ error }: { error: NotFoundError }) =>
        props.fallback?.(error)
      }
    >
      {props.children}
    </CatchBoundary>
  )
}

export function DefaultGlobalNotFound() {
  return <p>Not Found</p>
}
