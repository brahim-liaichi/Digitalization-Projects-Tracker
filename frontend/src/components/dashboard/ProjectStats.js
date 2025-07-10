import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { formatFileSize } from '../../utils/formatters';

const ProjectStats = ({ stats }) => {
  const { totalProjects, activeProjects, totalFiles, totalSize } = stats;
  
  return (
    <Row>
      <Col md={3} sm={6} className="mb-3 mb-md-0">
        <Card className="text-center h-100">
          <Card.Body>
            <div className="stat-icon mb-3">
              <i className="fas fa-folder text-primary fa-3x"></i>
            </div>
            <h2 className="stat-value">{totalProjects}</h2>
            <div className="stat-label text-muted">Total Projects</div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3} sm={6} className="mb-3 mb-md-0">
        <Card className="text-center h-100">
          <Card.Body>
            <div className="stat-icon mb-3">
              <i className="fas fa-folder-open text-success fa-3x"></i>
            </div>
            <h2 className="stat-value">{activeProjects}</h2>
            <div className="stat-label text-muted">Active Projects</div>
            {totalProjects > 0 && (
              <div className="stat-percentage text-muted">
                ({Math.round((activeProjects / totalProjects) * 100)}%)
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
      <Col md={3} sm={6} className="mb-3 mb-sm-0">
        <Card className="text-center h-100">
          <Card.Body>
            <div className="stat-icon mb-3">
              <i className="fas fa-file text-info fa-3x"></i>
            </div>
            <h2 className="stat-value">{totalFiles.toLocaleString()}</h2>
            <div className="stat-label text-muted">Total Files</div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3} sm={6}>
        <Card className="text-center h-100">
          <Card.Body>
            <div className="stat-icon mb-3">
              <i className="fas fa-database text-warning fa-3x"></i>
            </div>
            <h2 className="stat-value">{formatFileSize(totalSize)}</h2>
            <div className="stat-label text-muted">Total Size</div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ProjectStats;