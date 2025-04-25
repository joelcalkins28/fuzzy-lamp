/**
 * AddContact page component
 * Form for adding a new professional contact to the system
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { contactApi } from '../utils/api';
import Loader from '../components/Loader';
import Message from '../components/Message';

/**
 * Relationship options for contacts
 */
const RELATIONSHIP_OPTIONS = [
  'Recruiter',
  'Hiring Manager',
  'Team Member',
  'Referral',
  'Networking',
  'Other'
];

/**
 * AddContact component - Form for adding a new professional contact
 */
const AddContact = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    position: '',
    email: '',
    phone: '',
    linkedIn: '',
    relationship: 'Other',
    notes: '',
    lastContactDate: ''
  });

  /**
   * Handle form input changes
   * @param {Event} e Change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  /**
   * Handle form submission
   * @param {Event} e Submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Format the data
      const contactData = {
        ...formData,
        lastContactDate: formData.lastContactDate || undefined
      };
      
      // Submit to API
      await contactApi.create(contactData);
      
      setSuccess(true);
      setLoading(false);
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/contacts');
      }, 1500);
      
    } catch (error) {
      console.error('Error creating contact:', error);
      setError('Failed to create contact. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-success text-white">
              <h1 className="h3 mb-0">Add New Contact</h1>
            </Card.Header>
            
            <Card.Body>
              {loading ? (
                <Loader />
              ) : success ? (
                <Message variant="success">
                  Contact created successfully! Redirecting...
                </Message>
              ) : (
                <Form onSubmit={handleSubmit}>
                  {error && <Message variant="danger">{error}</Message>}
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter contact's full name"
                      required
                    />
                  </Form.Group>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Company</Form.Label>
                        <Form.Control
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Enter company name"
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Position</Form.Label>
                        <Form.Control
                          type="text"
                          name="position"
                          value={formData.position}
                          onChange={handleChange}
                          placeholder="Enter job title"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="email@example.com"
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="(123) 456-7890"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>LinkedIn URL</Form.Label>
                        <Form.Control
                          type="url"
                          name="linkedIn"
                          value={formData.linkedIn}
                          onChange={handleChange}
                          placeholder="https://linkedin.com/in/username"
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Relationship *</Form.Label>
                        <Form.Select
                          name="relationship"
                          value={formData.relationship}
                          onChange={handleChange}
                          required
                        >
                          {RELATIONSHIP_OPTIONS.map(relationship => (
                            <option key={relationship} value={relationship}>
                              {relationship}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Last Contact Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="lastContactDate"
                      value={formData.lastContactDate}
                      onChange={handleChange}
                    />
                    <Form.Text className="text-muted">
                      When did you last communicate with this contact?
                    </Form.Text>
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Add any additional information about this contact"
                    />
                  </Form.Group>
                  
                  <div className="d-flex justify-content-between">
                    <Button 
                      variant="secondary" 
                      onClick={() => navigate('/contacts')}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="success" 
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Add Contact'}
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddContact; 