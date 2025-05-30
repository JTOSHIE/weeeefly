import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Log error to error reporting service
    this.logErrorToService(error, errorInfo);
    
    // Update state with error info
    this.setState(prevState => ({
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));
  }
  
  logErrorToService = (error, errorInfo) => {
    // TODO: Send to error tracking service (e.g., Sentry, LogRocket)
    if (process.env.NODE_ENV === 'production') {
      // Log to external service
    }
  };
  
  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      // Prevent infinite error loops
      if (this.state.errorCount > 3) {
        return (
          <div className="error-boundary" role="alert">
            <h2>Application Error</h2>
            <p>The application has encountered multiple errors. Please refresh the page.</p>
            <button onClick={() => window.location.reload()}>
              Refresh Page
            </button>
          </div>
        );
      }
      
      return (
        <div className="error-boundary" role="alert">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message || 'An unexpected error occurred'}</p>
          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
              <summary>Error Details (Development Only)</summary>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo.componentStack}
            </details>
          )}
          <button onClick={this.handleReset}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;