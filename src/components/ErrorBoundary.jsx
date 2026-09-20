import { Component } from 'react'
import PropTypes from 'prop-types'

/**
 * Neo-brutalist themed React ErrorBoundary component.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Retain error catching boundary logic
    void errorInfo
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-paper p-6 font-mono text-ink">
          <div className="w-full max-w-md border-[3px] border-hot bg-hot/10 p-6 shadow-brut text-center space-y-4">
            <div className="inline-block border-2 border-ink bg-hot px-3 py-1 text-xs font-bold tracking-widest text-ink">
              ⚠️ SYSTEM ANOMALY / CRASH PREVENTED
            </div>
            <div className="my-2 border-t-2 border-dashed border-hot/40" />
            <div className="font-display text-2xl font-bold text-ink">
              THERMAL AUDIT FAULT
            </div>
            <p className="text-xs text-ink/80 leading-relaxed font-bold">
              {this.state.error?.message ||
                'An unexpected rendering error occurred inside the application spooler.'}
            </p>
            <div className="my-2 border-t-2 border-dashed border-hot/40" />
            <button
              onClick={this.handleReset}
              className="mt-2 border-2 border-ink bg-sun px-5 py-2.5 font-display text-xs font-bold tracking-wider text-ink shadow-[2px_2px_0_#111] hover:bg-sun/80 transition"
            >
              REBOOT APPLICATION 🔄
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
}
