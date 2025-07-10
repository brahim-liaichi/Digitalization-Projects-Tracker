/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, ListGroup, Badge, Button } from 'react-bootstrap';
import { formatDate } from '../../utils/dateUtils';

const NewProjectsPanel = ({ newProjects }) => {
  // Only show the 5 most recently discovered projects
  const recentNewProjects = newProjects
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);
  
  return (
    <Card className="h-100">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Newly Discovered Projects</h5>
          {newProjects.length > 5 && (
            <Link to="/manage" className="btn btn-sm btn-outline-primary">
              View All
            </Link>
          )}
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        {recentNewProjects.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted mb-0">No new projects discovered.</p>
          </div>
        ) : (
          <ListGroup variant="flush">
            {recentNewProjects.map(project => (
              <ListGroup.Item key={project.id}>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="fw-bold">{project.name}</div>
                    <div className="text-muted small text-truncate" style={{ maxWidth: '250px' }}>
                      {project.folder_path}
                    </div>
                    <div className="small text-muted mt-1">
                      Discovered: {formatDate(project.created_at)}
                    </div>
                  </div>
                  <div className="ms-2">
                    <Link to={`/projects/${project.id}`}>
                      <Button size="sm" variant="outline-primary">
                        <i className="fas fa-eye"></i>
                      </Button>
                    </Link>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
};

export default NewProjectsPanel;