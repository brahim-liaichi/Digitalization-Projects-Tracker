import api from './api';

const projectService = {
  // Project Roots
  getProjectRoots: async () => {
    const response = await api.get('/roots/');
    return response.data;
  },
  
  getProjectRoot: async (id) => {
    const response = await api.get(`/roots/${id}/`);
    return response.data;
  },
  
  createProjectRoot: async (data) => {
    const response = await api.post('/roots/', data);
    return response.data;
  },
  
  updateProjectRoot: async (id, data) => {
    const response = await api.put(`/roots/${id}/`, data);
    return response.data;
  },
  
  deleteProjectRoot: async (id) => {
    const response = await api.delete(`/roots/${id}/`);
    return response.data;
  },
  
  scanProjectRoot: async (id) => {
    const response = await api.post(`/roots/${id}/scan/`);
    return response.data;
  },
  
  // Projects
  getProjects: async (params = {}) => {
    const response = await api.get('/projects/', { params });
    return response.data;
  },
  
  getProject: async (id) => {
    const response = await api.get(`/projects/${id}/`);
    return response.data;
  },
  
  createProject: async (data) => {
    const response = await api.post('/projects/', data);
    return response.data;
  },
  
  updateProject: async (id, data) => {
    const response = await api.put(`/projects/${id}/`, data);
    return response.data;
  },
  
  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}/`);
    return response.data;
  },
  
  scanProject: async (id) => {
    const response = await api.post(`/projects/${id}/scan/`);
    return response.data;
  },
  
  scanAll: async () => {
    const response = await api.post('/scan-all/');
    return response.data;
  },
  
  getProjectActivity: async (id, params = {}) => {
    const response = await api.get(`/projects/${id}/activity/`, { params });
    return response.data;
  },
  
  getNewlyDiscoveredProjects: async () => {
    const response = await api.get('/projects/', { params: { is_auto_discovered: true, active: true } });
    return response.data;
  },
  
  // Tasks
  getProjectTasks: async (projectId) => {
    const response = await api.get('/projects/tasks/', { params: { project: projectId } });
    return response.data;
  },
  
  createTask: async (data) => {
    const response = await api.post('/projects/tasks/', data);
    return response.data;
  },
  
  updateTask: async (id, data) => {
    const response = await api.put(`/projects/tasks/${id}/`, data);
    return response.data;
  },
  
  deleteTask: async (id) => {
    const response = await api.delete(`/projects/tasks/${id}/`);
    return response.data;
  },
  
  // Task Categories
  getTaskCategories: async () => {
    const response = await api.get('/projects/categories/');
    return response.data;
  },
  
  createTaskCategory: async (data) => {
    const response = await api.post('/projects/categories/', data);
    return response.data;
  }
};

export default projectService;