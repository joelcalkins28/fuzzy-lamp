/**
 * ApplicationsList page component
 * Displays all job applications with filtering and sorting options
 */
import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Button, 
  Form, 
  Container,
  InputGroup,
  Dropdown,
  DropdownButton
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { applicationApi } from '../utils/api';
import Loader from '../components/Loader';
import Message from '../components/Message';
import ApplicationCard from '../components/ApplicationCard';

/**
 * Status options for filtering
 */
const STATUS_OPTIONS = [
  'All',
  'Bookmarked',
  'Applied',
  'Phone Screen',
  'Interview',
  'Technical Assessment',
  'Offer',
  'Rejected',
  'Accepted',
  'Withdrawn'
];

/**
 * Sort options for applications
 */
const SORT_OPTIONS = [
  { value: 'dateDesc', label: 'Date (Newest First)' },
  { value: 'dateAsc', label: 'Date (Oldest First)' },
  { value: 'companyAsc', label: 'Company (A-Z)' },
  { value: 'companyDesc', label: 'Company (Z-A)' },
  { value: 'statusAsc', label: 'Status' }
];

/**
 * ApplicationsList component displays all job applications with filter and sort options
 */
const ApplicationsList = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOption, setSortOption] = useState('dateDesc');

  // Fetch applications on component mount
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await applicationApi.getAll();
        setApplications(data);
        setFilteredApplications(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError('Failed to load applications. Please try again.');
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, []);

  // Filter and sort applications when filter criteria change
  useEffect(() => {
    let result = [...applications];
    
    // Apply status filter
    if (statusFilter !== 'All') {
      result = result.filter(app => app.status === statusFilter);
    }
    
    // Apply search term filter
    if (searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        app => 
          app.company.toLowerCase().includes(search) ||
          app.position.toLowerCase().includes(search) ||
          (app.location && app.location.toLowerCase().includes(search))
      );
    }
    
    // Apply sorting
    result = sortApplications(result, sortOption);
    
    setFilteredApplications(result);
  }, [applications, searchTerm, statusFilter, sortOption]);

  /**
   * Sort applications based on selected sort option
   * @param {Array} apps Applications to sort
   * @param {string} option Sort option
   * @returns {Array} Sorted applications
   */
  const sortApplications = (apps, option) => {
    const sorted = [...apps];
    
    switch (option) {
      case 'dateDesc':
        return sorted.sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate));
      case 'dateAsc':
        return sorted.sort((a, b) => new Date(a.applicationDate) - new Date(b.applicationDate));
      case 'companyAsc':
        return sorted.sort((a, b) => a.company.localeCompare(b.company));
      case 'companyDesc':
        return sorted.sort((a, b) => b.company.localeCompare(a.company));
      case 'statusAsc':
        return sorted.sort((a, b) => a.status.localeCompare(b.status));
      default:
        return sorted;
    }
  };

  /**
   * Handle search input changes
   * @param {Event} e Change event
   */
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  /**
   * Handle status filter selection
   * @param {string} status Selected status
   */
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  /**
   * Handle sort option selection
   * @param {string} option Selected sort option
   */
  const handleSortChange = (option) => {
    setSortOption(option);
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Job Applications</h1>
        <LinkContainer to="/applications/add">
          <Button variant="primary">
            <i className="bi bi-plus-circle me-2"></i>
            Add Application
          </Button>
        </LinkContainer>
      </div>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {/* Filters and search */}
          <Row className="mb-4">
            <Col md={6} sm={12} className="mb-3 mb-md-0">
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search by company, position, or location"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </InputGroup>
            </Col>
            
            <Col md={3} sm={6} className="mb-3 mb-md-0">
              <DropdownButton
                variant="outline-secondary"
                title={`Status: ${statusFilter}`}
                className="w-100"
              >
                {STATUS_OPTIONS.map(status => (
                  <Dropdown.Item 
                    key={status} 
                    onClick={() => handleStatusFilterChange(status)}
                    active={statusFilter === status}
                  >
                    {status}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </Col>
            
            <Col md={3} sm={6}>
              <DropdownButton
                variant="outline-secondary"
                title={`Sort: ${SORT_OPTIONS.find(opt => opt.value === sortOption).label}`}
                className="w-100"
              >
                {SORT_OPTIONS.map(option => (
                  <Dropdown.Item 
                    key={option.value} 
                    onClick={() => handleSortChange(option.value)}
                    active={sortOption === option.value}
                  >
                    {option.label}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </Col>
          </Row>
          
          {/* Applications grid */}
          {filteredApplications.length === 0 ? (
            <Message>
              No applications found. {applications.length > 0 ? 'Try changing your filters.' : ''}
            </Message>
          ) : (
            <>
              <p className="text-muted mb-3">
                Showing {filteredApplications.length} {filteredApplications.length === 1 ? 'application' : 'applications'}
              </p>
              
              <Row>
                {filteredApplications.map(application => (
                  <Col key={application._id} lg={4} md={6} className="mb-4">
                    <ApplicationCard application={application} />
                  </Col>
                ))}
              </Row>
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default ApplicationsList; 