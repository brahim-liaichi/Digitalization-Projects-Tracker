import api from './api';

const fileService = {
  getProjectFiles: async (projectId, params = {}) => {
    const response = await api.get(`/projects/${projectId}/files/`, { params });
    return response.data;
  },
  
  searchFiles: async (projectId, searchTerm) => {
    const response = await api.get(`/projects/${projectId}/files/`, {
      params: { filename: searchTerm }
    });
    return response.data;
  },
  
  getRecentFiles: async (projectId, limit = 10) => {
    const response = await api.get(`/projects/${projectId}/files/`, {
      params: { limit, ordering: '-last_modified' }
    });
    return response.data;
  },
  
  getFilesByCategory: async (projectId, category) => {
    // This requires backend support for filtering by category
    // You may need to implement this in your Django backend
    const response = await api.get(`/projects/${projectId}/files/`, {
      params: { category }
    });
    return response.data;
  },
  
  getFilesStats: async (projectId) => {
    // This might require a custom endpoint in your Django backend
    // For now, we'll use the project detail which includes some stats
    const response = await api.get(`/projects/${projectId}/`);
    return {
      totalFiles: response.data.total_files,
      totalSize: response.data.total_size
    };
  }
};

export default fileService;