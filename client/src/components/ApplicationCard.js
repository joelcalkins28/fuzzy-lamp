/**
 * ApplicationCard component for displaying a job application summary
 * Used in lists and grid views of applications
 */
import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * Gets color for status badge based on application status
 * @param {string} status Application status
 * @returns {string} Bootstrap color variant
 */
const getStatusColor = (status) => {
  switch (status) {
    case 'Bookmarked':
      return 'secondary';
    case 'Applied':
      return 'primary';
    case 'Phone Screen':
      return 'info';
    case 'Interview':
      return 'warning';
    case 'Technical Assessment':
      return 'dark';
    case 'Offer':
      return 'success';
    case 'Rejected':
      return 'danger';
    case 'Accepted':
      return 'success';
    case 'Withdrawn':
      return 'danger';
    default:
      return 'secondary';
  }
};

/**
 * ApplicationCard component displays job application information in a card format
 * @param {Object} props Component props
 * @param {Object} props.application Application data object
 */
const ApplicationCard = ({ application }) => {
  const {
    _id,
    company,
    position,
    location,
    status,
    applicationDate,
  } = application;

  // Format date for display
  const formattedDate = new Date(applicationDate).toLocaleDateString();

  return (
    <Card className="mb-3 application-card h-100">
      <Card.Body>
        <Card.Title>{position}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{company}</Card.Subtitle>
        
        <Badge bg={getStatusColor(status)} className="mb-2">
          {status}
        </Badge>
        
        {location && (
          <Card.Text className="mb-2">
            <i className="bi bi-geo-alt"></i> {location}
          </Card.Text>
        )}
        
        <Card.Text className="text-muted">
          <small>Applied: {formattedDate}</small>
        </Card.Text>
        
        <Link to={`/applications/${_id}`}>
          <Button variant="outline-primary" size="sm">
            View Details
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default ApplicationCard; 