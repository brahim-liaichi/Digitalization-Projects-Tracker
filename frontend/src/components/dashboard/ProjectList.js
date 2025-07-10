import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Table, Badge, Button, Form, InputGroup } from 'react-bootstrap';
import { formatFileSize } from '../../utils/formatters';
import { formatDate } from '../../utils/dateUtils';

const ProjectList = ({ projects }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'inactive'
  
  // Filter and search projects
  const filteredProjects = projects.filter(project => {
    // Filter by status
    if (filter === 'active' && !project.active) return false;
    if (filter === 'inactive' && project.active) return false;
    
    // Search by name or path
    return (
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.folder_path.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  return (
    <Card className="project-list-card">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Projects</h5>
          <div className="d-flex">
            <Form.Select 
              className="me-2"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ width: '150px' }}
            >
              <option value="all">All Projects</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Form.Select>
            <InputGroup style={{ width: '250px' }}>
              <Form.Control
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button 
                  variant="outline-secondary"
                  onClick={() => setSearchTerm('')}
                >
                  <i className="fas fa-times"></i>
                </Button>
              )}
            </InputGroup>
          </div>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Files</th>
                <th>Size</th>
                <th>Last Scan</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No projects found.
                  </td>
                </tr>
              ) : (
                filteredProjects.map(project => (
                  <tr key={project.id}>
                    <td>
                      <Link to={`/projects/${project.id}`} className="text-decoration-none">
                        <strong>{project.name}</strong>
                        <div className="text-muted small text-truncate" style={{ maxWidth: '300px' }}>
                          {project.folder_path}
                        </div>
                      </Link>
                    </td>
                    <td>
                      {project.active ? (
                        <Badge bg="success">Active</Badge>
                      ) : (
                        <Badge bg="secondary">Inactive</Badge>
                      )}
                      {project.is_auto_discovered && (
                        <Badge bg="info" className="ms-1">Auto-discovered</Badge>
                      )}
                    </td>
                    <td>{project.total_files.toLocaleString()}</td>
                    <td>{formatFileSize(project.total_size)}</td>
                    <td>
                      {project.last_scan ? (
                        formatDate(project.last_scan)
                      ) : (
                        <span className="text-muted">Never</span>
                      )}
                    </td>
                    <td>
                      <Link to={`/projects/${project.id}`}>
                        <Button size="sm" variant="primary" className="me-1">
                          <i className="fas fa-eye"></i>
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline-secondary">
                        <i className="fas fa-sync-alt"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProjectList;