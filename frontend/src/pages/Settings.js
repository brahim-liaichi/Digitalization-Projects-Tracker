import React, { useState } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import ScanSettings from '../components/settings/ScanSettings';
import LoadingIndicator from '../components/common/LoadingIndicator';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Mock function to simulate saving settings
  // In a real app, this would interact with your backend API
  const handleSaveSettings = async (settings) => {
    try {
      setLoading(true);
      setSaveSuccess(false);
      setError(null);
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would save these settings to your backend
      console.log('Saving settings:', settings);
      
      // Store in localStorage for demonstration purposes
      localStorage.setItem('scanSettings', JSON.stringify(settings));
      
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1>Settings</h1>
          <p className="text-muted">Configure application settings</p>
        </Col>
      </Row>
      
      {saveSuccess && (
        <Row className="mb-4">
          <Col>
            <Alert variant="success">
              Settings saved successfully!
            </Alert>
          </Col>
        </Row>
      )}
      
      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}
      
      <Row>
        <Col lg={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Scan Settings</h5>
            </Card.Header>
            <Card.Body>
              <ScanSettings onSave={handleSaveSettings} />
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">About</h5>
            </Card.Header>
            <Card.Body>
              <h5>Digitalization Projects Tracker</h5>
              <p>
                This application helps you track progress on digitalization projects by monitoring
                changes to project folders and files.
              </p>
              <h6>Features:</h6>
              <ul>
                <li>Automatic project discovery</li>
                <li>File change tracking</li>
                <li>Activity monitoring</li>
                <li>Task management</li>
              </ul>
              <p className="text-muted mt-4">Version 1.0.0</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;