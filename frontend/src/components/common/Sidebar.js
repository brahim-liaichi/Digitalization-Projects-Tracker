import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import routes from '../../routes';

const Sidebar = () => {
  const location = useLocation();
  
  // Filter out hidden routes (like detail pages)
  const navigationRoutes = routes.filter(route => !route.hidden);
  
  return (
    <div className="sidebar bg-light border-end">
      <Nav className="flex-column pt-3">
        {navigationRoutes.map((route, index) => (
          <Nav.Item key={index}>
            <Nav.Link
              as={Link}
              to={route.path}
              active={location.pathname === route.path}
              className="sidebar-link"
            >
              <i className={`fas fa-${route.icon} me-2`}></i>
              {route.name}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;