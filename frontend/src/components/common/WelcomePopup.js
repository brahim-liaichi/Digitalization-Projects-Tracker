import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Card } from 'react-bootstrap';

const WelcomePopup = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has seen the welcome popup before
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setShow(true);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  const handleGetStarted = () => {
    setShow(false);
    localStorage.setItem('hasSeenWelcome', 'true');
    // Optional: Navigate to project management page
    // window.location.href = '/manage';
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      size="lg"
      centered
      backdrop="static"
      className="welcome-modal"
    >
      <Modal.Header className="bg-primary text-white border-0">
        <Modal.Title className="w-100 text-center">
          <i className="fas fa-project-diagram me-2"></i>
          Welcome to Digitalization Projects Tracker
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-4">
        <div className="text-center mb-4">
          <p className="lead">
            Track and monitor your digitalization projects with ease!
          </p>
          <p className="text-muted">
            This powerful tool helps you keep track of project progress by automatically 
            monitoring file changes, tracking activity, and providing detailed insights.
          </p>
        </div>

        <Row className="g-3 mb-4">
          <Col md={6}>
            <Card className="h-100 border-0 shadow-sm feature-card">
              <Card.Body className="text-center">
                <div className="feature-icon text-primary mb-3">
                  <i className="fas fa-search fa-3x"></i>
                </div>
                <h5>Auto Discovery</h5>
                <p className="text-muted small">
                  Automatically discover and track projects in your designated folders
                </p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card className="h-100 border-0 shadow-sm feature-card">
              <Card.Body className="text-center">
                <div className="feature-icon text-success mb-3">
                  <i className="fas fa-file-alt fa-3x"></i>
                </div>
                <h5>File Tracking</h5>
                <p className="text-muted small">
                  Monitor file changes, additions, and modifications in real-time
                </p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card className="h-100 border-0 shadow-sm feature-card">
              <Card.Body className="text-center">
                <div className="feature-icon text-info mb-3">
                  <i className="fas fa-chart-line fa-3x"></i>
                </div>
                <h5>Activity Monitoring</h5>
                <p className="text-muted small">
                  Visualize project activity with charts and detailed timelines
                </p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card className="h-100 border-0 shadow-sm feature-card">
              <Card.Body className="text-center">
                <div className="feature-icon text-warning mb-3">
                  <i className="fas fa-tasks fa-3x"></i>
                </div>
                <h5>Task Management</h5>
                <p className="text-muted small">
                  Organize and track tasks associated with your digitalization projects
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="text-center">
          <h6 className="text-muted">Quick Start Guide</h6>
          <ol className="list-unstyled text-start">
            <li className="mb-2">
              <i className="fas fa-circle text-primary me-2" style={{fontSize: '0.5rem'}}></i>
              Go to <strong>Project Management</strong> to add your first project folder
            </li>
            <li className="mb-2">
              <i className="fas fa-circle text-primary me-2" style={{fontSize: '0.5rem'}}></i>
              Use <strong>Scan All</strong> button to discover and analyze projects
            </li>
            <li className="mb-2">
              <i className="fas fa-circle text-primary me-2" style={{fontSize: '0.5rem'}}></i>
              Monitor progress on the <strong>Dashboard</strong>
            </li>
            <li>
              <i className="fas fa-circle text-primary me-2" style={{fontSize: '0.5rem'}}></i>
              Configure settings to customize your tracking preferences
            </li>
          </ol>
        </div>
      </Modal.Body>
      
      <Modal.Footer className="border-0 justify-content-center">
        <Button variant="outline-secondary" onClick={handleClose}>
          Skip for now
        </Button>
        <Button variant="primary" onClick={handleGetStarted}>
          <i className="fas fa-rocket me-2"></i>
          Get Started
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WelcomePopup;