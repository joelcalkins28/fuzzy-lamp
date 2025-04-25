/**
 * AddApplication page component
 * Form for adding a new job application to the system
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { applicationApi, contactApi } from '../utils/api';
import Loader from '../components/Loader';
import Message from '../components/Message';

/**
 * Application status options
 */
const STATUS_OPTIONS = [
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
 * AddApplication component - Form for adding a new job application
 */
const AddApplication = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    jobDescription: '',
    jobLink: '',
    location: '',
    salary: '',
    applicationDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    status: 'Bookmarked',
    nextSteps: '',
    notes: '',
    contactId: ''
  });

  // Load contacts for the dropdown
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoadingContacts(true);
        const data = await contactApi.getAll();
        setContacts(data);
        setLoadingContacts(false);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        setLoadingContacts(false);
      }
    };
    
    fetchContacts();
  }, []);

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
      const applicationData = {
        ...formData,
        applicationDate: formData.applicationDate || new Date().toISOString(),
        contactId: formData.contactId || undefined
      };
      
      // Submit to API
      await applicationApi.create(applicationData);
      
      setSuccess(true);
      setLoading(false);
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/applications');
      }, 1500);
      
    } catch (error) {
      console.error('Error creating application:', error);
      setError('Failed to create application. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h1 className="h3 mb-0">Add New Job Application</h1>
            </Card.Header>
            
            <Card.Body>
              {loading ? (
                <Loader />
              ) : success ? (
                <Message variant="success">
                  Application created successfully! Redirecting...
                </Message>
              ) : (
                <Form onSubmit={handleSubmit}>
                  {error && <Message variant="danger">{error}</Message>}
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Company *</Form.Label>
                        <Form.Control
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Enter company name"
                          required
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Position *</Form.Label>
                        <Form.Control
                          type="text"
                          name="position"
                          value={formData.position}
                          onChange={handleChange}
                          placeholder="Enter job title"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="City, State or Remote"
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Salary</Form.Label>
                        <Form.Control
                          type="text"
                          name="salary"
                          value={formData.salary}
                          onChange={handleChange}
                          placeholder="Salary or range"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Status *</Form.Label>
                        <Form.Select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          required
                        >
                          {STATUS_OPTIONS.map(status => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Application Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="applicationDate"
                          value={formData.applicationDate}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Job Link</Form.Label>
                    <Form.Control
                      type="url"
                      name="jobLink"
                      value={formData.jobLink}
                      onChange={handleChange}
                      placeholder="https://example.com/job-posting"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Job Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="jobDescription"
                      value={formData.jobDescription}
                      onChange={handleChange}
                      placeholder="Copy and paste job description or key points"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Next Steps</Form.Label>
                    <Form.Control
                      type="text"
                      name="nextSteps"
                      value={formData.nextSteps}
                      onChange={handleChange}
                      placeholder="e.g., Follow up by email on Friday"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Any additional notes about this application"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Contact Person</Form.Label>
                    <Form.Select
                      name="contactId"
                      value={formData.contactId}
                      onChange={handleChange}
                    >
                      <option value="">-- No Contact Selected --</option>
                      {loadingContacts ? (
                        <option disabled>Loading contacts...</option>
                      ) : contacts.length === 0 ? (
                        <option disabled>No contacts available</option>
                      ) : (
                        contacts.map(contact => (
                          <option key={contact._id} value={contact._id}>
                            {contact.name} {contact.company ? `(${contact.company})` : ''}
                          </option>
                        ))
                      )}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Optional: Link this application to a contact
                    </Form.Text>
                  </Form.Group>
                  
                  <div className="d-flex justify-content-between">
                    <Button 
                      variant="secondary" 
                      onClick={() => navigate('/applications')}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="primary" 
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Add Application'}
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

export default AddApplication; 