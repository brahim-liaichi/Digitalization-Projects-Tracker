import React, { useState, useEffect } from 'react';
import { Card, Form } from 'react-bootstrap';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  BarElement
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import projectService from '../../services/projectService';
import { formatDate } from '../../utils/dateUtils';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend
);

const ActivityChart = ({ projects }) => {
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('30'); // days
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState('all');

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        setLoading(true);
        
        let activityData = [];
        
        if (selectedProject === 'all') {
          // For all projects, we need to fetch each one's activity
          const topProjects = projects
            .filter(p => p.active)
            .sort((a, b) => b.total_files - a.total_files)
            .slice(0, 5); // Get top 5 active projects by file count
            
          const projectPromises = topProjects.map(project => 
            projectService.getProjectActivity(project.id, { days: timeRange })
          );
          
          const projectsActivity = await Promise.all(projectPromises);
          
          // Combine all project activities
          projectsActivity.forEach((activity, index) => {
            if (activity.logs) {
              activityData.push({
                projectName: topProjects[index].name,
                logs: activity.logs
              });
            }
          });
        } else {
          // Fetch activity for a single project
          const response = await projectService.getProjectActivity(selectedProject, { days: timeRange });
          if (response.logs) {
            const project = projects.find(p => p.id.toString() === selectedProject);
            activityData.push({
              projectName: project ? project.name : 'Selected Project',
              logs: response.logs
            });
          }
        }
        
        prepareChartData(activityData);
      } catch (error) {
        console.error('Error fetching activity data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (projects.length > 0) {
      fetchActivityData();
    }
  }, [projects, selectedProject, timeRange]);
  
  const prepareChartData = (activityData) => {
    // Get unique dates from all projects
    const allDates = new Set();
    activityData.forEach(project => {
      project.logs.forEach(log => {
        allDates.add(formatDate(log.timestamp, 'YYYY-MM-DD'));
      });
    });
    
    // Sort dates chronologically
    const sortedDates = Array.from(allDates).sort();
    
    // Prepare datasets for each project
    const datasets = activityData.map((project, index) => {
      // Create a map of date to activity count for this project
      const dateMap = {};
      project.logs.forEach(log => {
        const date = formatDate(log.timestamp, 'YYYY-MM-DD');
        dateMap[date] = (log.files_added + log.files_modified);
      });
      
      // Generate data points for all dates
      const data = sortedDates.map(date => dateMap[date] || 0);
      
      // Get a color based on index
      const colors = [
        'rgba(75, 192, 192, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(153, 102, 255, 0.7)'
      ];
      
      return {
        label: project.projectName,
        data,
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length],
        tension: 0.3
      };
    });
    
    setChartData({
      labels: sortedDates,
      datasets
    });
  };
  
  return (
    <Card className="h-100">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <h5 className="mb-0">Activity Over Time</h5>
          <div className="d-flex align-items-center">
            <Form.Select
              className="me-2"
              style={{ width: '150px' }}
              value={selectedProject}
              onChange={e => setSelectedProject(e.target.value)}
            >
              <option value="all">All Projects</option>
              {projects.filter(p => p.active).map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </Form.Select>
            <Form.Select
              className="me-2"
              style={{ width: '120px' }}
              value={timeRange}
              onChange={e => setTimeRange(e.target.value)}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </Form.Select>
            <Form.Select
              style={{ width: '100px' }}
              value={chartType}
              onChange={e => setChartType(e.target.value)}
            >
              <option value="line">Line</option>
              <option value="bar">Bar</option>
            </Form.Select>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : chartData ? (
          <div style={{ height: '300px' }}>
            {chartType === 'line' ? (
              <Line 
                data={chartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Files Changed'
                      }
                    }
                  }
                }} 
              />
            ) : (
              <Bar 
                data={chartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Files Changed'
                      }
                    }
                  }
                }} 
              />
            )}
          </div>
        ) : (
          <div className="text-center py-5">
            <p className="text-muted">No activity data available.</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ActivityChart;