/**
 * Dashboard page component
 * Displays overview of job search progress and recent applications
 */
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Button, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { applicationApi } from '../utils/api';
import Loader from '../components/Loader';
import Message from '../components/Message';
import ApplicationCard from '../components/ApplicationCard';

/**
 * Dashboard component - Main landing page showing job search stats
 * Displays recent applications and metrics
 */
const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalApplications: 0,
    bookmarked: 0,
    applied: 0,
    interviews: 0,
    offers: 0
  });

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await applicationApi.getAll();
        
        // Sort by date descending and take latest 3
        const recentApplications = [...data]
          .sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate))
          .slice(0, 3);
        
        setApplications(recentApplications);
        
        // Calculate stats
        const appStats = {
          totalApplications: data.length,
          bookmarked: data.filter(app => app.status === 'Bookmarked').length,
          applied: data.filter(app => app.status === 'Applied').length,
          interviews: data.filter(app => 
            ['Phone Screen', 'Interview', 'Technical Assessment'].includes(app.status)
          ).length,
          offers: data.filter(app => app.status === 'Offer').length
        };
        
        setStats(appStats);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError('Failed to load application data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, []);

  return (
    <Container>
      <h1 className="mb-4">Dashboard</h1>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {/* Stats Cards */}
          <Row className="mb-4">
            <Col md={3} sm={6} className="mb-3">
              <Card className="text-center h-100 shadow-sm">
                <Card.Body>
                  <h2>{stats.totalApplications}</h2>
                  <Card.Text>Total Applications</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3} sm={6} className="mb-3">
              <Card className="text-center h-100 shadow-sm">
                <Card.Body>
                  <h2>
                    <Badge bg="primary">{stats.applied}</Badge>
                  </h2>
                  <Card.Text>Applied</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3} sm={6} className="mb-3">
              <Card className="text-center h-100 shadow-sm">
                <Card.Body>
                  <h2>
                    <Badge bg="warning">{stats.interviews}</Badge>
                  </h2>
                  <Card.Text>Interviews</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3} sm={6} className="mb-3">
              <Card className="text-center h-100 shadow-sm">
                <Card.Body>
                  <h2>
                    <Badge bg="success">{stats.offers}</Badge>
                  </h2>
                  <Card.Text>Offers</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {/* Recent Applications */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2>Recent Applications</h2>
              <LinkContainer to="/applications">
                <Button variant="outline-secondary">View All</Button>
              </LinkContainer>
            </div>
            
            {applications.length === 0 ? (
              <Message>
                No applications yet. <LinkContainer to="/applications/add"><Button variant="link" className="p-0">Add your first application</Button></LinkContainer>
              </Message>
            ) : (
              <Row>
                {applications.map(application => (
                  <Col key={application._id} md={4}>
                    <ApplicationCard application={application} />
                  </Col>
                ))}
              </Row>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="mb-4">
            <h2>Quick Actions</h2>
            <Row>
              <Col md={4} className="mb-3">
                <LinkContainer to="/applications/add">
                  <Button variant="primary" block className="w-100 py-3">
                    <i className="bi bi-plus-circle me-2"></i>
                    Add Application
                  </Button>
                </LinkContainer>
              </Col>
              
              <Col md={4} className="mb-3">
                <LinkContainer to="/contacts/add">
                  <Button variant="success" block className="w-100 py-3">
                    <i className="bi bi-person-plus me-2"></i>
                    Add Contact
                  </Button>
                </LinkContainer>
              </Col>
              
              <Col md={4} className="mb-3">
                <LinkContainer to="/contacts">
                  <Button variant="info" block className="w-100 py-3 text-white">
                    <i className="bi bi-people me-2"></i>
                    View Contacts
                  </Button>
                </LinkContainer>
              </Col>
            </Row>
          </div>
        </>
      )}
    </Container>
  );
};

export default Dashboard; 