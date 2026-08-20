import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Lunar Habitat AI] Uncaught React Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-[#030712] text-slate-100 p-6 font-mono select-none">
          <div className="max-w-xl w-full bg-[#0B1120] border border-rose-500/50 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-950/80 border border-rose-500/40 rounded-xl text-rose-400">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-wider">
                  Lunar Habitat AI Telemetry Exception Recovered
                </h2>
                <p className="text-xs text-rose-300/80 mt-0.5">
                  An isolated component error occurred during rendering.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300 overflow-x-auto max-h-40 font-mono">
              <div className="text-rose-400 font-bold mb-1">
                {this.state.error?.toString() || 'Unknown Error'}
              </div>
              <div className="text-slate-500 text-[10px]">
                {this.state.errorInfo?.componentStack?.slice(0, 300) || 'Component stack captured.'}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-glow-cyan cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reload & Reset View</span>
              </button>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Attempt In-Place Recovery
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
