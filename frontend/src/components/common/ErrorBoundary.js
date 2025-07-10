import React, { Component } from 'react';
import { Container, Alert, Button } from 'react-bootstrap';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container fluid className="py-5">
          <Alert variant="danger">
            <Alert.Heading>Something went wrong</Alert.Heading>
            <p>The application encountered an unexpected error.</p>
            {this.state.error && (
              <pre className="mt-3 mb-2 border rounded p-3" style={{ backgroundColor: '#f8f9fa' }}>
                {this.state.error.toString()}
              </pre>
            )}
            <div className="d-flex justify-content-end">
              <Button 
                variant="outline-danger"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </div>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;