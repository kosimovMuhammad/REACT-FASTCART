import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
            <h1 className="text-2xl font-bold text-red-500">Something went wrong</h1>
            <p className="text-gray-400 mt-2">{this.state.error?.message}</p>
            <button
              className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-medium"
              onClick={() => this.setState({ hasError: false, error: undefined })}
            >
              Try Again
            </button>
          </div>
        )
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
