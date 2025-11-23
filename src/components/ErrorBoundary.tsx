import React from 'react';

interface State {
  hasError: boolean;
  error?: Error | null;
  info?: React.ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<Record<string, unknown>>, State> {
  constructor(props: Record<string, unknown>) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // You could log the error to an external service here
    this.setState({ error, info });
    console.error('Captured error in ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
          <div className="max-w-2xl w-full bg-card border border-border rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-foreground mb-2">Se ha producido un error</h2>
            <p className="text-sm text-muted-foreground mb-4">La aplicación ha encontrado un error. A continuación aparece información útil para depuración.</p>
            <div className="mb-4">
              <div className="text-sm font-medium text-muted-foreground">Mensaje:</div>
              <pre className="whitespace-pre-wrap text-sm mt-2 bg-muted/5 rounded p-3 text-red-600">{String(this.state.error?.message || '—')}</pre>
            </div>
            {this.state.info && (
              <div className="mb-4">
                <div className="text-sm font-medium text-muted-foreground">Stack / Info:</div>
                <pre className="whitespace-pre-wrap text-xs mt-2 bg-muted/5 rounded p-3">{this.state.info.componentStack}</pre>
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <button onClick={() => window.location.reload()} className="px-4 py-2 rounded bg-primary text-primary-foreground">Recargar</button>
              <button onClick={() => this.setState({ hasError: false, error: null, info: null })} className="px-4 py-2 rounded border">Ignorar</button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
