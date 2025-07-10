import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import ProjectManagement from './pages/ProjectManagement';
import Settings from './pages/Settings';

const routes = [
  {
    path: '/',
    component: Dashboard,
    exact: true,
    name: 'Dashboard',
    icon: 'dashboard'
  },
  {
    path: '/projects/:id',
    component: ProjectDetail,
    exact: true,
    name: 'Project Detail',
    hidden: true
  },
  {
    path: '/manage',
    component: ProjectManagement,
    exact: true,
    name: 'Project Management',
    icon: 'folder'
  },
  {
    path: '/settings',
    component: Settings,
    exact: true,
    name: 'Settings',
    icon: 'settings'
  }
];

export default routes;