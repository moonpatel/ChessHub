import React from 'react'
import { useRouteError } from 'react-router-dom'

const ErrorBoundary = () => {
  const error = useRouteError();

  return (
    <div>
      {
        Object.toString(error)
      }
    </div>
  )
}

export default ErrorBoundary