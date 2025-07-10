import React from 'react';
import { ListGroup, Badge } from 'react-bootstrap';
import { formatDate, getRelativeTime } from '../../utils/dateUtils';
import { formatFileSize } from '../../utils/formatters';

const ActivityTimeline = ({ activities, limit = null }) => {
  // Limit the number of activities if specified
  const displayActivities = limit ? activities.slice(0, limit) : activities;
  
  return (
    <div className="activity-timeline">
      {displayActivities.length === 0 ? (
        <p className="text-muted text-center py-4">No activity recorded yet.</p>
      ) : (
        <ListGroup variant="flush">
          {displayActivities.map((activity) => (
            <ListGroup.Item key={activity.id} className="border-start-0 border-end-0">
              <div className="d-flex">
                <div className="activity-icon me-3">
                  <div className="activity-indicator bg-primary rounded-circle">
                    <i className="fas fa-sync-alt text-white"></i>
                  </div>
                </div>
                <div className="activity-content flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start">
                    <h6 className="mb-1">Activity on {formatDate(activity.timestamp)}</h6>
                    <span className="text-muted small">{getRelativeTime(activity.timestamp)}</span>
                  </div>
                  <div className="mb-2">
                    <span className="me-2">
                      <Badge bg="success">+{activity.files_added}</Badge> added
                    </span>
                    <span className="me-2">
                      <Badge bg="warning">±{activity.files_modified}</Badge> modified
                    </span>
                    <span>
                      <Badge bg="danger">-{activity.files_deleted}</Badge> deleted
                    </span>
                  </div>
                  <div className="text-muted small">
                    Size change: 
                    {activity.size_change >= 0 ? (
                      <span className="text-success ms-1">+{formatFileSize(activity.size_change)}</span>
                    ) : (
                      <span className="text-danger ms-1">-{formatFileSize(Math.abs(activity.size_change))}</span>
                    )}
                  </div>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default ActivityTimeline;