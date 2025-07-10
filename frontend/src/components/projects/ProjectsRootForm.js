import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const ProjectsRootForm = ({ projectRoot, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    path: '',
    auto_discover: true
  });
  const [validated, setValidated] = useState(false);
  
  useEffect(() => {
    if (projectRoot) {
      setFormData({
        id: projectRoot.id,
        name: projectRoot.name,
        path: projectRoot.path,
        auto_discover: projectRoot.auto_discover
      });
    } else {
      setFormData({
        name: '',
        path: '',
        auto_discover: true
      });
    }
    
    setValidated(false);
  }, [projectRoot]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
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
    
    onSubmit(formData, !!projectRoot);
    
    // Reset form if not editing
    if (!projectRoot) {
      setFormData({
        name: '',
        path: '',
        auto_discover: true
      });
      setValidated(false);
    }
  };
  
  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="rootName">
          <Form.Label>Root Name</Form.Label>
          <Form.Control
            required
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter root name"
          />
          <Form.Control.Feedback type="invalid">
            Please provide a name for this project root.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      
      <Form.Group className="mb-3" controlId="rootPath">
        <Form.Label>Root Folder Path</Form.Label>
        <Form.Control
          required
          type="text"
          name="path"
          value={formData.path}
          onChange={handleChange}
          placeholder="Enter full folder path"
        />
        <Form.Control.Feedback type="invalid">
          Please provide a valid folder path.
        </Form.Control.Feedback>
        <Form.Text className="text-muted">
          The full path to the root folder that contains multiple projects.
        </Form.Text>
      </Form.Group>
      
      <Form.Group className="mb-3" controlId="rootAutoDiscover">
        <Form.Check
          type="checkbox"
          label="Auto-discover projects"
          name="auto_discover"
          checked={formData.auto_discover}
          onChange={handleChange}
        />
        <Form.Text className="text-muted">
          Automatically discover projects in this root folder during scans.
        </Form.Text>
      </Form.Group>
      
      <Button type="submit" variant="primary">
        {projectRoot ? 'Update Root' : 'Add Root'}
      </Button>
    </Form>
  );
};

export default ProjectsRootForm;