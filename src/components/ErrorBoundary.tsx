import { Component, type ReactNode } from 'react';

export class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          <div className="text-center">
            <h1 className="text-6xl font-black mb-4" style={{ fontFamily: 'Anton, sans-serif' }}>Oops.</h1>
            <p className="opacity-60 mb-6">Something went wrong. Try refreshing.</p>
            <button onClick={() => window.location.reload()} className="px-8 py-3 rounded-full bg-red-500 font-bold uppercase">Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
