import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const ScanSettings = ({ onSave }) => {
  const [settings, setSettings] = useState({
    scanInterval: 60, // minutes
    scanOnStartup: true,
    scanHidden: false,
    maxFileSizeToScan: 100, // MB
    fileTypesToExclude: '',
    enableNotifications: true,
  });
  const [validated, setValidated] = useState(false);
  
  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('scanSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (err) {
        console.error('Error parsing saved settings:', err);
      }
    }
  }, []);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    // Convert numeric values
    const formattedSettings = {
      ...settings,
      scanInterval: parseInt(settings.scanInterval),
      maxFileSizeToScan: parseInt(settings.maxFileSizeToScan),
    };
    
    onSave(formattedSettings);
  };
  
  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="scanInterval">
        <Form.Label>Scan Interval (minutes)</Form.Label>
        <Form.Control
          type="number"
          name="scanInterval"
          value={settings.scanInterval}
          onChange={handleChange}
          min="5"
          max="1440"
          required
        />
        <Form.Text className="text-muted">
          How often to automatically scan for changes (5-1440 minutes).
        </Form.Text>
        <Form.Control.Feedback type="invalid">
          Please enter a valid interval between 5 and 1440 minutes.
        </Form.Control.Feedback>
      </Form.Group>
      
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="scanOnStartup">
            <Form.Check
              type="checkbox"
              label="Scan on application startup"
              name="scanOnStartup"
              checked={settings.scanOnStartup}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group controlId="scanHidden">
            <Form.Check
              type="checkbox"
              label="Scan hidden files and folders"
              name="scanHidden"
              checked={settings.scanHidden}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
      
      <Form.Group className="mb-3" controlId="maxFileSizeToScan">
        <Form.Label>Maximum file size to scan (MB)</Form.Label>
        <Form.Control
          type="number"
          name="maxFileSizeToScan"
          value={settings.maxFileSizeToScan}
          onChange={handleChange}
          min="1"
          required
        />
        <Form.Text className="text-muted">
          Ignore files larger than this size when scanning.
        </Form.Text>
      </Form.Group>
      
      <Form.Group className="mb-3" controlId="fileTypesToExclude">
        <Form.Label>File types to exclude</Form.Label>
        <Form.Control
          type="text"
          name="fileTypesToExclude"
          value={settings.fileTypesToExclude}
          onChange={handleChange}
          placeholder="e.g., tmp,bak,log"
        />
        <Form.Text className="text-muted">
          Comma-separated list of file extensions to ignore.
        </Form.Text>
      </Form.Group>
      
      <Form.Group className="mb-3" controlId="enableNotifications">
        <Form.Check
          type="checkbox"
          label="Enable notifications for scan completion"
          name="enableNotifications"
          checked={settings.enableNotifications}
          onChange={handleChange}
        />
      </Form.Group>
      
      <Button type="submit" variant="primary">
        Save Settings
      </Button>
    </Form>
  );
};

export default ScanSettings;