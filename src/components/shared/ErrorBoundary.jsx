import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardBody } from '../ui/card';
import { Button } from '../ui/button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('ErrorBoundary caught render error:', error, info);
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen p-4">
          <Card className="mx-auto mt-10 max-w-xl">
            <CardBody className="py-12 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-rose-400" />
              <h2 className="mt-4 font-display text-2xl font-semibold text-[rgb(var(--text))]">Something went wrong</h2>
              <p className="mt-2 text-sm text-slate-400">
                {this.state.error?.message || 'A render error occurred. Refresh the page to continue.'}
              </p>
              <div className="mt-6">
                <Button onClick={this.reset}>
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
