import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Đã xảy ra lỗi</h2>
            <p className="text-slate-600 mb-6">
              Xin lỗi, đã có lỗi không mong muốn xảy ra. Vui lòng thử lại sau.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  this.props.onReset?.();
                  this.setState({ hasError: false, error: undefined });
                }}
                className="px-6 py-2 bg-vna-blue text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                Thử Lại
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-2 border border-vna-blue text-vna-blue rounded-lg hover:bg-slate-50 transition-colors"
              >
                Về Trang Chủ
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
