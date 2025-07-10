import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import projectService from '../../services/projectService';
import { formatFileSize } from '../../utils/formatters';

const Header = () => {
  const location = useLocation();
  
  const handleScanAll = async () => {
    try {
      // Show scanning indicator
      alert('Scanning all projects. This may take a while...');
      
      const response = await projectService.scanAll();
      
      // Extract values from response
      const scanResults = response.scan;
      const totalFiles = scanResults.total_files || 0;
      const totalSize = scanResults.total_size || 0;
      const filesAdded = scanResults.total_files_added || 0;
      const filesModified = scanResults.total_files_modified || 0;
      
      // Format the message
      const message = `Scan completed successfully!
      
Total files: ${totalFiles.toLocaleString()}
Total size: ${formatFileSize(totalSize)}
New files: ${filesAdded.toLocaleString()}
Modified files: ${filesModified.toLocaleString()}`;
      
      alert(message);
      
      // Refresh the page to show updated data
      window.location.reload();
    } catch (err) {
      console.error('Error scanning all projects:', err);
      alert('Error scanning all projects. Please try again.');
    }
  };
  
  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-3">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <i className="fas fa-project-diagram me-2"></i>
          Digitalization Tracker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              active={location.pathname === '/'}
            >
              Dashboard
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/manage" 
              active={location.pathname === '/manage'}
            >
              Manage Projects
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/settings" 
              active={location.pathname === '/settings'}
            >
              Settings
            </Nav.Link>
          </Nav>
          <Button 
            variant="outline-light"
            onClick={handleScanAll}
          >
            <i className="fas fa-sync-alt me-2"></i>
            Scan All
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;