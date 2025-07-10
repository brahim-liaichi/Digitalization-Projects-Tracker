/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Tabs, Tab } from 'react-bootstrap';
import FileList from '../components/projects/FileList';
import ActivityTimeline from '../components/projects/ActivityTimeline';
import ProjectStatus from '../components/projects/ProjectStatus';
import LoadingIndicator from '../components/common/LoadingIndicator';
import projectService from '../services/projectService';
import fileService from '../services/fileService';
import { formatDate } from '../utils/dateUtils';
import { formatFileSize } from '../utils/formatters';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch project details
        const projectData = await projectService.getProject(id);
        setProject(projectData);
        
        // Fetch project files
        const filesData = await fileService.getProjectFiles(id);
        setFiles(filesData);
        
        // Fetch project activities
        const activitiesData = await projectService.getProjectActivity(id);
        setActivities(activitiesData);
        
      } catch (err) {
        console.error('Error fetching project data:', err);
        setError('Failed to load project data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectData();
  }, [id]);

  const handleScanProject = async () => {
    try {
      setScanning(true);
      const result = await projectService.scanProject(id);
      
      // Refresh project data
      const updatedProject = await projectService.getProject(id);
      setProject(updatedProject);
      
      // Refresh files
      const updatedFiles = await fileService.getProjectFiles(id);
      setFiles(updatedFiles);
      
      // Refresh activities
      const updatedActivities = await projectService.getProjectActivity(id);
      setActivities(updatedActivities);
      
      alert('Project scan completed successfully!');
    } catch (err) {
      console.error('Error scanning project:', err);
      alert('Error scanning project. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <Container fluid className="py-4">
        <Alert variant="danger">{error}</Alert>
        <Button as={Link} to="/" variant="primary">
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container fluid className="py-4">
        <Alert variant="warning">Project not found.</Alert>
        <Button as={Link} to="/" variant="primary">
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container fluid className="project-detail-container py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1>{project.name}</h1>
              <p className="text-muted">{project.folder_path}</p>
            </div>
            <div>
              <Button
                variant="primary"
                onClick={handleScanProject}
                disabled={scanning}
                className="me-2"
              >
                {scanning ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Scanning...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sync-alt me-2"></i>
                    Scan Now
                  </>
                )}
              </Button>
              <Button as={Link} to={`/manage?edit=${project.id}`} variant="outline-secondary">
                <i className="fas fa-edit me-2"></i>
                Edit
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col lg={4}>
          <ProjectStatus project={project} />
        </Col>
        <Col lg={8}>
          <Card>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <div className="mb-3">
                    <h6 className="text-muted mb-1">Total Files</h6>
                    <h4>{project.total_files.toLocaleString()}</h4>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="mb-3">
                    <h6 className="text-muted mb-1">Total Size</h6>
                    <h4>{formatFileSize(project.total_size)}</h4>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="mb-3">
                    <h6 className="text-muted mb-1">Last Scan</h6>
                    <h4>
                      {project.last_scan ? (
                        formatDate(project.last_scan)
                      ) : (
                        <span className="text-muted">Never</span>
                      )}
                    </h4>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Tabs
                activeKey={activeTab}
                onSelect={(key) => setActiveTab(key)}
                className="mb-0"
              >
                <Tab eventKey="overview" title="Overview">
                  {/* Tab content rendered below */}
                </Tab>
                <Tab eventKey="files" title="Files">
                  {/* Tab content rendered below */}
                </Tab>
                <Tab eventKey="activity" title="Activity">
                  {/* Tab content rendered below */}
                </Tab>
                <Tab eventKey="tasks" title="Tasks">
                  {/* Tab content rendered below */}
                </Tab>
              </Tabs>
            </Card.Header>
            <Card.Body>
              {activeTab === 'overview' && (
                <Row>
                  <Col lg={8}>
                    <h5 className="mb-3">Recent Activity</h5>
                    <ActivityTimeline activities={activities?.logs || []} limit={5} />
                    {activities?.logs?.length > 5 && (
                      <div className="text-center mt-3">
                        <Button 
                          variant="link" 
                          onClick={() => setActiveTab('activity')}
                        >
                          View All Activity
                        </Button>
                      </div>
                    )}
                  </Col>
                  <Col lg={4}>
                    <h5 className="mb-3">Recent Files</h5>
                    {files.length > 0 ? (
                      <div className="list-group">
                        {files.slice(0, 5).map(file => (
                          <div key={file.id} className="list-group-item">
                            <div className="fw-bold text-truncate">{file.filename}</div>
                            <div className="d-flex justify-content-between small text-muted">
                              <span>{formatFileSize(file.size)}</span>
                              <span>{formatDate(file.last_modified)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">No files found.</p>
                    )}
                    {files.length > 5 && (
                      <div className="text-center mt-3">
                        <Button 
                          variant="link" 
                          onClick={() => setActiveTab('files')}
                        >
                          View All Files
                        </Button>
                      </div>
                    )}
                  </Col>
                </Row>
              )}
              
              {activeTab === 'files' && (
                <FileList projectId={project.id} initialFiles={files} />
              )}
              
              {activeTab === 'activity' && (
                <ActivityTimeline activities={activities?.logs || []} />
              )}
              
              {activeTab === 'tasks' && (
                <div className="text-center py-4">
                  <p className="text-muted">Tasks feature coming soon.</p>
                  {/* This would be replaced with a TaskList component in the future */}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProjectDetail;