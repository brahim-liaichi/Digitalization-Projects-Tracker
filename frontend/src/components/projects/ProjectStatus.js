import React from 'react';
import { Card, Badge, ProgressBar } from 'react-bootstrap';
import { formatDate } from '../../utils/dateUtils';

const ProjectStatus = ({ project }) => {
  // Calculate activity level based on recent changes
  const getActivityLevel = () => {
    if (!project.recent_activity || project.recent_activity.length === 0) {
      return { level: 'No activity', variant: 'secondary', progress: 0 };
    }
    
    // Sum up changes from the recent activity
    const totalChanges = project.recent_activity.reduce((sum, activity) => {
      return sum + activity.files_added + activity.files_modified + activity.files_deleted;
    }, 0);
    
    if (totalChanges > 100) {
      return { level: 'Very High', variant: 'danger', progress: 100 };
    } else if (totalChanges > 50) {
      return { level: 'High', variant: 'warning', progress: 75 };
    } else if (totalChanges > 10) {
      return { level: 'Medium', variant: 'info', progress: 50 };
    } else if (totalChanges > 0) {
      return { level: 'Low', variant: 'success', progress: 25 };
    } else {
      return { level: 'No activity', variant: 'secondary', progress: 0 };
    }
  };
  
  const activityLevel = getActivityLevel();
  
  return (
    <Card className="project-status-card h-100">
      <Card.Body>
        <h5 className="mb-3">Status</h5>
        
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="text-muted">Status</span>
            {project.active ? (
              <Badge bg="success">Active</Badge>
            ) : (
              <Badge bg="secondary">Inactive</Badge>
            )}
          </div>
          
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="text-muted">Source</span>
            {project.is_auto_discovered ? (
              <Badge bg="info">Auto-discovered</Badge>
            ) : (
              <Badge bg="primary">Manually added</Badge>
            )}
          </div>
          
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="text-muted">Root Folder</span>
            <span>{project.root ? `From ${project.root}` : 'Custom path'}</span>
          </div>
          
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-muted">Created</span>
            <span>{formatDate(project.created_at)}</span>
          </div>
        </div>
        
        <div className="mb-3">
          <h6>Recent Activity Level</h6>
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span>{activityLevel.level}</span>
            <Badge bg={activityLevel.variant}>{activityLevel.level}</Badge>
          </div>
          <ProgressBar 
            variant={activityLevel.variant} 
            now={activityLevel.progress} 
            className="mt-2"
          />
        </div>
        
        <div>
          <h6>Last Scan</h6>
          {project.last_scan ? (
            <>
              <div>{formatDate(project.last_scan)}</div>
              <div className="text-muted small">
                Scanned {project.total_files.toLocaleString()} files
              </div>
            </>
          ) : (
            <div className="text-muted">Project has not been scanned yet</div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProjectStatus;