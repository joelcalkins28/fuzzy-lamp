/**
 * ContactCard component for displaying a professional contact
 * Used in lists and grid views of contacts
 */
import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * Gets color for relationship badge
 * @param {string} relationship Contact's relationship type
 * @returns {string} Bootstrap color variant
 */
const getRelationshipColor = (relationship) => {
  switch (relationship) {
    case 'Recruiter':
      return 'primary';
    case 'Hiring Manager':
      return 'success';
    case 'Team Member':
      return 'info';
    case 'Referral':
      return 'warning';
    case 'Networking':
      return 'secondary';
    case 'Other':
    default:
      return 'dark';
  }
};

/**
 * ContactCard component displays contact information in a card format
 * @param {Object} props Component props
 * @param {Object} props.contact Contact data object
 */
const ContactCard = ({ contact }) => {
  const {
    _id,
    name,
    company,
    position,
    relationship,
    email,
    phone,
  } = contact;

  return (
    <Card className="mb-3 contact-card h-100">
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        
        {position && company && (
          <Card.Subtitle className="mb-2 text-muted">
            {position} at {company}
          </Card.Subtitle>
        )}
        
        {(!position && company) && (
          <Card.Subtitle className="mb-2 text-muted">
            {company}
          </Card.Subtitle>
        )}
        
        {(position && !company) && (
          <Card.Subtitle className="mb-2 text-muted">
            {position}
          </Card.Subtitle>
        )}
        
        <Badge bg={getRelationshipColor(relationship)} className="mb-2">
          {relationship}
        </Badge>
        
        {email && (
          <Card.Text className="mb-1">
            <i className="bi bi-envelope"></i> {email}
          </Card.Text>
        )}
        
        {phone && (
          <Card.Text className="mb-2">
            <i className="bi bi-telephone"></i> {phone}
          </Card.Text>
        )}
        
        <Link to={`/contacts/${_id}`}>
          <Button variant="outline-primary" size="sm">
            View Details
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default ContactCard; 