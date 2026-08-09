import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

const ROUTE_RECOVERY_KEY = 'mfz-route-recovery-attempted';

const isChunkLoadError = (error: unknown) => {
  const message =
    error instanceof Error ? error.message : String(error ?? '');

  return /dynamically imported module|chunkloaderror|loading chunk|failed to fetch.*module|importing a module script failed/i.test(
    message,
  );
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error('MFZ application error:', error, info);

    // Mobile PWAs can occasionally keep an older app shell for a moment after
    // deployment. If a stale chunk is ever requested, recover once
    // automatically instead of making the customer stare at the Oops screen.
    if (isChunkLoadError(error)) {
      const alreadyRetried =
        window.sessionStorage.getItem(ROUTE_RECOVERY_KEY) === '1';

      if (!alreadyRetried) {
        window.sessionStorage.setItem(ROUTE_RECOVERY_KEY, '1');
        window.location.reload();
        return;
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-black px-5 text-white">
          <div className="max-w-md text-center">
            <h1
              className="mb-4 text-6xl font-black"
              style={{ fontFamily: 'Anton, sans-serif' }}
            >
              Oops.
            </h1>
            <p className="mb-6 opacity-60">
              Something interrupted this page. Tap reload and MFZ will recover your session.
            </p>
            <button
              type="button"
              onClick={() => {
                window.sessionStorage.removeItem(ROUTE_RECOVERY_KEY);
                window.location.reload();
              }}
              className="rounded-full bg-red-500 px-8 py-3 font-bold uppercase"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
