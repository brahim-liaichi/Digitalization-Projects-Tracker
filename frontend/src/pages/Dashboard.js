import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import ProjectList from '../components/dashboard/ProjectList';
import ActivityChart from '../components/dashboard/ActivityChart';
import ProjectStats from '../components/dashboard/ProjectStats';
import NewProjectsPanel from '../components/dashboard/NewProjectsPanel';
import LoadingIndicator from '../components/common/LoadingIndicator';
import projectService from '../services/projectService';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [newProjects, setNewProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalFiles: 0,
    totalSize: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all projects
        const projectsData = await projectService.getProjects();
        setProjects(projectsData);
        
        // Fetch newly discovered projects
        const newProjectsData = await projectService.getNewlyDiscoveredProjects();
        setNewProjects(newProjectsData);
        
        // Calculate overall stats
        const activeProjects = projectsData.filter(project => project.active);
        const totalFiles = projectsData.reduce((sum, project) => sum + project.total_files, 0);
        const totalSize = projectsData.reduce((sum, project) => sum + project.total_size, 0);
        
        setStats({
          totalProjects: projectsData.length,
          activeProjects: activeProjects.length,
          totalFiles,
          totalSize,
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <Container fluid className="dashboard-container py-4">
      {error && (
        <Alert variant="danger">{error}</Alert>
      )}
      
      <Row className="mb-4">
        <Col>
          <h1>Dashboard</h1>
          <p className="text-muted">Overview of your digitalization projects</p>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col>
          <ProjectStats stats={stats} />
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col lg={8}>
          <ActivityChart projects={projects} />
        </Col>
        <Col lg={4}>
          <NewProjectsPanel newProjects={newProjects} />
        </Col>
      </Row>
      
      <Row>
        <Col>
          <ProjectList projects={projects} />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;