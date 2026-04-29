import React, { ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-ivory dark:bg-onyx flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-onyx border border-stone-200 dark:border-white/10 rounded-3xl p-8 shadow-lg">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
              </div>
            </div>

            <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-white text-center mb-2">
              Oops! Algo deu errado
            </h1>

            <p className="text-stone-600 dark:text-stone-400 text-center text-sm mb-6">
              Desculpe, encontramos um erro inesperado. Tente recarregar a página ou volte mais tarde.
            </p>

            {this.state.error && (
              <div className="bg-stone-50 dark:bg-white/5 rounded-lg p-4 mb-6 border border-stone-200 dark:border-white/10">
                <p className="text-xs font-mono text-stone-600 dark:text-stone-400 overflow-auto max-h-24">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-stone-100 dark:bg-white/5 text-stone-900 dark:text-white rounded-xl font-semibold hover:bg-stone-200 dark:hover:bg-white/10 transition-colors"
              >
                <RefreshCw size={16} />
                Tentar Novamente
              </button>

              <button
                onClick={this.handleReload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gold text-black rounded-xl font-semibold hover:bg-yellow-400 transition-colors"
              >
                <RefreshCw size={16} />
                Recarregar
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
