import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const ProjectForm = ({ project, projectRoots, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    folder_path: '',
    root: '',
    is_auto_discovered: false,
    active: true
  });
  const [validated, setValidated] = useState(false);
  
  useEffect(() => {
    if (project) {
      setFormData({
        id: project.id,
        name: project.name,
        folder_path: project.folder_path,
        root: project.root || '',
        is_auto_discovered: project.is_auto_discovered,
        active: project.active
      });
    } else {
      setFormData({
        name: '',
        folder_path: '',
        root: '',
        is_auto_discovered: false,
        active: true
      });
    }
    
    setValidated(false);
  }, [project]);
  
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
    
    onSubmit(formData, !!project);
    
    // Reset form if not editing
    if (!project) {
      setFormData({
        name: '',
        folder_path: '',
        root: '',
        is_auto_discovered: false,
        active: true
      });
      setValidated(false);
    }
  };
  
  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="projectName">
          <Form.Label>Project Name</Form.Label>
          <Form.Control
            required
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter project name"
          />
          <Form.Control.Feedback type="invalid">
            Please provide a project name.
          </Form.Control.Feedback>
        </Form.Group>
        
        <Form.Group as={Col} md="6" controlId="projectRoot">
          <Form.Label>Project Root (Optional)</Form.Label>
          <Form.Select
            name="root"
            value={formData.root}
            onChange={handleChange}
          >
            <option value="">None (Custom Path)</option>
            {projectRoots.map(root => (
              <option key={root.id} value={root.id}>{root.name}</option>
            ))}
          </Form.Select>
          <Form.Text className="text-muted">
            Associate with a project root or use a custom path.
          </Form.Text>
        </Form.Group>
      </Row>
      
      <Form.Group className="mb-3" controlId="projectPath">
        <Form.Label>Project Folder Path</Form.Label>
        <Form.Control
          required
          type="text"
          name="folder_path"
          value={formData.folder_path}
          onChange={handleChange}
          placeholder="Enter full folder path"
        />
        <Form.Control.Feedback type="invalid">
          Please provide a valid folder path.
        </Form.Control.Feedback>
        <Form.Text className="text-muted">
          The full path to the project folder on your system.
        </Form.Text>
      </Form.Group>
      
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="projectAutoDiscovered">
          <Form.Check
            type="checkbox"
            label="Auto-discovered"
            name="is_auto_discovered"
            checked={formData.is_auto_discovered}
            onChange={handleChange}
            disabled={project && project.is_auto_discovered}
          />
          <Form.Text className="text-muted">
            Was this project automatically discovered?
          </Form.Text>
        </Form.Group>
        
        <Form.Group as={Col} md="6" controlId="projectActive">
          <Form.Check
            type="checkbox"
            label="Active"
            name="active"
            checked={formData.active}
            onChange={handleChange}
          />
          <Form.Text className="text-muted">
            Is this project currently active?
          </Form.Text>
        </Form.Group>
      </Row>
      
      <Button type="submit" variant="primary">
        {project ? 'Update Project' : 'Add Project'}
      </Button>
    </Form>
  );
};

export default ProjectForm;