import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Tabs, Tab } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import ProjectForm from '../components/projects/ProjectForm';
import ProjectsRootForm from '../components/projects/ProjectsRootForm';
import LoadingIndicator from '../components/common/LoadingIndicator';
import projectService from '../services/projectService';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [projectRoots, setProjectRoots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('projects');
  const [editingProject, setEditingProject] = useState(null);
  const [editingRoot, setEditingRoot] = useState(null);
  
  const location = useLocation();
  
  useEffect(() => {
    fetchData();
    
    // Check URL params for edit mode
    const searchParams = new URLSearchParams(location.search);
    const projectId = searchParams.get('edit');
    if (projectId) {
      setActiveTab('projects');
      loadProjectForEdit(projectId);
    }
  }, [location]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch projects
      const projectsData = await projectService.getProjects();
      setProjects(projectsData);
      
      // Fetch project roots
      const rootsData = await projectService.getProjectRoots();
      setProjectRoots(rootsData);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const loadProjectForEdit = async (projectId) => {
    try {
      const project = await projectService.getProject(projectId);
      setEditingProject(project);
    } catch (err) {
      console.error('Error fetching project for edit:', err);
      alert('Could not load project for editing.');
    }
  };
  
  const handleEditRoot = (root) => {
    setEditingRoot(root);
    setActiveTab('projectRoots');
  };
  
  const handleEditProject = (project) => {
    setEditingProject(project);
    setActiveTab('projects');
  };
  
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }
    
    try {
      await projectService.deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      alert('Project deleted successfully.');
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Error deleting project. Please try again.');
    }
  };
  
  const handleDeleteRoot = async (rootId) => {
    if (!window.confirm('Are you sure you want to delete this project root? This will not delete the associated projects.')) {
      return;
    }
    
    try {
      await projectService.deleteProjectRoot(rootId);
      setProjectRoots(projectRoots.filter(r => r.id !== rootId));
      alert('Project root deleted successfully.');
    } catch (err) {
      console.error('Error deleting project root:', err);
      alert('Error deleting project root. Please try again.');
    }
  };
  
  const handleProjectFormSubmit = async (projectData, isEdit) => {
    try {
      if (isEdit) {
        await projectService.updateProject(projectData.id, projectData);
        setProjects(projects.map(p => (p.id === projectData.id ? projectData : p)));
      } else {
        const newProject = await projectService.createProject(projectData);
        setProjects([...projects, newProject]);
      }
      
      setEditingProject(null);
      alert(`Project ${isEdit ? 'updated' : 'created'} successfully.`);
    } catch (err) {
      console.error(`Error ${isEdit ? 'updating' : 'creating'} project:`, err);
      alert(`Error ${isEdit ? 'updating' : 'creating'} project. Please try again.`);
    }
  };
  
  const handleRootFormSubmit = async (rootData, isEdit) => {
    try {
      if (isEdit) {
        await projectService.updateProjectRoot(rootData.id, rootData);
        setProjectRoots(projectRoots.map(r => (r.id === rootData.id ? rootData : r)));
      } else {
        const newRoot = await projectService.createProjectRoot(rootData);
        setProjectRoots([...projectRoots, newRoot]);
      }
      
      setEditingRoot(null);
      alert(`Project root ${isEdit ? 'updated' : 'created'} successfully.`);
    } catch (err) {
      console.error(`Error ${isEdit ? 'updating' : 'creating'} project root:`, err);
      alert(`Error ${isEdit ? 'updating' : 'creating'} project root. Please try again.`);
    }
  };
  
  const handleScanRoot = async (rootId) => {
    try {
      await projectService.scanProjectRoot(rootId);
      alert('Scan initiated successfully. Refresh the page to see newly discovered projects.');
    } catch (err) {
      console.error('Error scanning project root:', err);
      alert('Error scanning project root. Please try again.');
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1>Project Management</h1>
          <p className="text-muted">Manage your projects and folders</p>
        </Col>
      </Row>
      
      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}
      
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Tabs
                activeKey={activeTab}
                onSelect={(key) => setActiveTab(key)}
                className="mb-0"
              >
                <Tab eventKey="projects" title="Projects">
                  {/* Tab content rendered below */}
                </Tab>
                <Tab eventKey="projectRoots" title="Project Roots">
                  {/* Tab content rendered below */}
                </Tab>
              </Tabs>
            </Card.Header>
            <Card.Body>
              {activeTab === 'projects' && (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0">{editingProject ? 'Edit Project' : 'Add New Project'}</h5>
                    {editingProject && (
                      <Button variant="outline-secondary" onClick={() => setEditingProject(null)}>
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                  
                  <ProjectForm 
                    project={editingProject}
                    projectRoots={projectRoots}
                    onSubmit={handleProjectFormSubmit}
                  />
                  
                  <hr />
                  
                  <h5 className="mb-3">Manage Projects</h5>
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Path</th>
                          <th>Status</th>
                          <th>Files</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="text-center py-3">
                              No projects found.
                            </td>
                          </tr>
                        ) : (
                          projects.map(project => (
                            <tr key={project.id}>
                              <td>{project.name}</td>
                              <td className="text-truncate" style={{ maxWidth: '250px' }}>
                                {project.folder_path}
                              </td>
                              <td>
                                {project.active ? (
                                  <span className="badge bg-success">Active</span>
                                ) : (
                                  <span className="badge bg-secondary">Inactive</span>
                                )}
                              </td>
                              <td>{project.total_files.toLocaleString()}</td>
                              <td>
                                <Button 
                                  variant="outline-primary" 
                                  size="sm" 
                                  className="me-1"
                                  onClick={() => handleEditProject(project)}
                                >
                                  <i className="fas fa-edit"></i>
                                </Button>
                                <Button 
                                  variant="outline-danger" 
                                  size="sm"
                                  onClick={() => handleDeleteProject(project.id)}
                                >
                                  <i className="fas fa-trash"></i>
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
              
              {activeTab === 'projectRoots' && (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0">{editingRoot ? 'Edit Project Root' : 'Add New Project Root'}</h5>
                    {editingRoot && (
                      <Button variant="outline-secondary" onClick={() => setEditingRoot(null)}>
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                  
                  <ProjectsRootForm 
                    projectRoot={editingRoot}
                    onSubmit={handleRootFormSubmit}
                  />
                  
                  <hr />
                  
                  <h5 className="mb-3">Manage Project Roots</h5>
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Path</th>
                          <th>Auto Discover</th>
                          <th>Last Scan</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projectRoots.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="text-center py-3">
                              No project roots found.
                            </td>
                          </tr>
                        ) : (
                          projectRoots.map(root => (
                            <tr key={root.id}>
                              <td>{root.name}</td>
                              <td className="text-truncate" style={{ maxWidth: '250px' }}>
                                {root.path}
                              </td>
                              <td>
                                {root.auto_discover ? (
                                  <span className="badge bg-success">Yes</span>
                                ) : (
                                  <span className="badge bg-secondary">No</span>
                                )}
                              </td>
                              <td>
                                {root.last_scan ? (
                                  new Date(root.last_scan).toLocaleString()
                                ) : (
                                  <span className="text-muted">Never</span>
                                )}
                              </td>
                              <td>
                                <Button 
                                  variant="outline-primary" 
                                  size="sm" 
                                  className="me-1"
                                  onClick={() => handleEditRoot(root)}
                                >
                                  <i className="fas fa-edit"></i>
                                </Button>
                                <Button 
                                  variant="outline-danger" 
                                  size="sm"
                                  className="me-1"
                                  onClick={() => handleDeleteRoot(root.id)}
                                >
                                  <i className="fas fa-trash"></i>
                                </Button>
                                <Button 
                                  variant="outline-success" 
                                  size="sm"
                                  onClick={() => handleScanRoot(root.id)}
                                >
                                  <i className="fas fa-sync-alt"></i>
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProjectManagement;