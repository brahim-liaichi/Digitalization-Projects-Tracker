import React, { useState, useEffect } from 'react';
import { Table, Form, InputGroup, Button, Badge, Row, Col } from 'react-bootstrap';
import fileService from '../../services/fileService';
import { formatFileSize } from '../../utils/formatters';
import { formatDate } from '../../utils/dateUtils';

const FileList = ({ projectId, initialFiles = [] }) => {
  const [files, setFiles] = useState(initialFiles);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('filename');
  const [sortDirection, setSortDirection] = useState('asc');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (initialFiles.length === 0) {
      fetchFiles();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);
  
  const fetchFiles = async () => {
    try {
      setLoading(true);
      const filesData = await fileService.getProjectFiles(projectId);
      setFiles(filesData);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchFiles();
      return;
    }
    
    try {
      setLoading(true);
      const results = await fileService.searchFiles(projectId, searchTerm);
      setFiles(results);
    } catch (error) {
      console.error('Error searching files:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const getSortIndicator = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };
  
  // Get file extension for determining file type
  const getFileExtension = (filename) => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
  };
  
  // Get file type for display
  const getFileType = (filename) => {
    const ext = getFileExtension(filename);
    
    // Document types
    if (['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'].includes(ext)) {
      return { type: 'Document', color: 'primary' };
    }
    
    // Image types
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext)) {
      return { type: 'Image', color: 'success' };
    }
    
    // Spreadsheet types
    if (['xls', 'xlsx', 'csv', 'ods'].includes(ext)) {
      return { type: 'Spreadsheet', color: 'warning' };
    }
    
    // Presentation types
    if (['ppt', 'pptx', 'odp'].includes(ext)) {
      return { type: 'Presentation', color: 'info' };
    }
    
    // Code files
    if (['html', 'css', 'js', 'py', 'java', 'c', 'cpp', 'php', 'sql'].includes(ext)) {
      return { type: 'Code', color: 'secondary' };
    }
    
    // Archives
    if (['zip', 'rar', 'tar', 'gz', '7z'].includes(ext)) {
      return { type: 'Archive', color: 'dark' };
    }
    
    return { type: 'Other', color: 'light' };
  };
  
  // Sort the files
  const sortedFiles = [...files].sort((a, b) => {
    let valueA, valueB;
    
    if (sortField === 'filename') {
      valueA = a.filename.toLowerCase();
      valueB = b.filename.toLowerCase();
    } else if (sortField === 'size') {
      valueA = a.size;
      valueB = b.size;
    } else if (sortField === 'last_modified') {
      valueA = new Date(a.last_modified);
      valueB = new Date(b.last_modified);
    } else {
      valueA = a[sortField];
      valueB = b[sortField];
    }
    
    const sortFactor = sortDirection === 'asc' ? 1 : -1;
    
    if (valueA < valueB) return -1 * sortFactor;
    if (valueA > valueB) return 1 * sortFactor;
    return 0;
  });
  
  return (
    <div className="file-list">
      <Row className="mb-3">
        <Col md={6}>
          <h5>Files ({files.length})</h5>
        </Col>
        <Col md={6}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button variant="primary" onClick={handleSearch}>
              <i className="fas fa-search"></i>
            </Button>
            {searchTerm && (
              <Button variant="outline-secondary" onClick={() => {
                setSearchTerm('');
                fetchFiles();
              }}>
                <i className="fas fa-times"></i>
              </Button>
            )}
          </InputGroup>
        </Col>
      </Row>
      
      <div className="table-responsive">
        <Table hover>
          <thead>
            <tr>
              <th onClick={() => handleSort('filename')} style={{ cursor: 'pointer' }}>
                Filename {getSortIndicator('filename')}
              </th>
              <th>Type</th>
              <th onClick={() => handleSort('size')} style={{ cursor: 'pointer' }}>
                Size {getSortIndicator('size')}
              </th>
              <th onClick={() => handleSort('last_modified')} style={{ cursor: 'pointer' }}>
                Last Modified {getSortIndicator('last_modified')}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : sortedFiles.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No files found.
                </td>
              </tr>
            ) : (
              sortedFiles.map((file) => {
                const fileType = getFileType(file.filename);
                return (
                  <tr key={file.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className={`fas fa-file me-2 text-${fileType.color}`}></i>
                        <span className="file-name">{file.filename}</span>
                      </div>
                      <div className="text-muted small">{file.path}</div>
                    </td>
                    <td>
                      <Badge bg={fileType.color}>
                        {fileType.type}
                      </Badge>
                    </td>
                    <td>{formatFileSize(file.size)}</td>
                    <td>{formatDate(file.last_modified)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default FileList;