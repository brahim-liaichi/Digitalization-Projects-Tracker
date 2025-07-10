import React from 'react';
import { Container, Spinner } from 'react-bootstrap';

const LoadingIndicator = ({ message = 'Loading...' }) => {
  return (
    <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
      <div className="text-center">
        <Spinner animation="border" role="status" variant="primary" className="mb-2">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <div className="text-muted">{message}</div>
      </div>
    </Container>
  );
};

export default LoadingIndicator;