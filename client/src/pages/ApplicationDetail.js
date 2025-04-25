/**
 * ApplicationDetail page component
 * Displays detailed information for a specific job application with edit capabilities
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Badge, 
  Button, 
  Form,
  Modal
} from 'react-bootstrap';
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
 * ApplicationDetail component for viewing and editing a specific job application
 */
const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State for application data
  const [application, setApplication] = useState(null);
  const [contact, setContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  // State for delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  
  // Fetch application and related data
  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        setLoading(true);
        const applicationData = await applicationApi.getById(id);
        setApplication(applicationData);
        
        // Initialize form data for editing
        setFormData({
          company: applicationData.company,
          position: applicationData.position,
          jobDescription: applicationData.jobDescription || '',
          jobLink: applicationData.jobLink || '',
          location: applicationData.location || '',
          salary: applicationData.salary || '',
          applicationDate: applicationData.applicationDate ? new Date(applicationData.applicationDate).toISOString().split('T')[0] : '',
          status: applicationData.status,
          nextSteps: applicationData.nextSteps || '',
          notes: applicationData.notes || '',
          contactId: applicationData.contactId || ''
        });
        
        // Fetch contact if exists
        if (applicationData.contactId) {
          try {
            const contactData = await contactApi.getById(applicationData.contactId);
            setContact(contactData);
          } catch (contactError) {
            console.error('Error fetching contact:', contactError);
          }
        }
        
        // Fetch all contacts for dropdown
        try {
          const contactsData = await contactApi.getAll();
          setContacts(contactsData);
        } catch (contactsError) {
          console.error('Error fetching contacts:', contactsError);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching application:', error);
        setError('Could not load application details. Please try again.');
        setLoading(false);
      }
    };
    
    fetchApplicationData();
  }, [id]);
  
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
   * Toggle edit mode
   */
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    setUpdateError(null);
    setUpdateSuccess(false);
    
    // Reset form data if canceling edit
    if (isEditing && application) {
      setFormData({
        company: application.company,
        position: application.position,
        jobDescription: application.jobDescription || '',
        jobLink: application.jobLink || '',
        location: application.location || '',
        salary: application.salary || '',
        applicationDate: application.applicationDate ? new Date(application.applicationDate).toISOString().split('T')[0] : '',
        status: application.status,
        nextSteps: application.nextSteps || '',
        notes: application.notes || '',
        contactId: application.contactId || ''
      });
    }
  };
  
  /**
   * Submit updates to the application
   */
  const handleUpdate = async () => {
    try {
      setLoadingUpdate(true);
      setUpdateError(null);
      
      const updatedApplication = await applicationApi.update(id, formData);
      
      setApplication(updatedApplication);
      setUpdateSuccess(true);
      setLoadingUpdate(false);
      
      // Update contact reference if contact was changed
      if (updatedApplication.contactId !== (contact?._id || null)) {
        if (updatedApplication.contactId) {
          try {
            const contactData = await contactApi.getById(updatedApplication.contactId);
            setContact(contactData);
          } catch (contactError) {
            console.error('Error fetching updated contact:', contactError);
          }
        } else {
          setContact(null);
        }
      }
      
      // Exit edit mode after successful update
      setTimeout(() => {
        setIsEditing(false);
        setUpdateSuccess(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error updating application:', error);
      setUpdateError('Failed to update application. Please try again.');
      setLoadingUpdate(false);
    }
  };
  
  /**
   * Delete the application
   */
  const handleDelete = async () => {
    try {
      setLoadingDelete(true);
      
      await applicationApi.delete(id);
      
      setShowDeleteModal(false);
      
      // Redirect to applications list
      navigate('/applications', { state: { message: 'Application deleted successfully' } });
      
    } catch (error) {
      console.error('Error deleting application:', error);
      setShowDeleteModal(false);
      setError('Failed to delete application. Please try again.');
      setLoadingDelete(false);
    }
  };
  
  // Format application date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <Container>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : application ? (
        <>
          {/* Header with title and actions */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="mb-1">{application.position}</h1>
              <h3 className="text-muted">{application.company}</h3>
            </div>
            
            <div>
              {isEditing ? (
                <div className="d-flex gap-2">
                  <Button 
                    variant="secondary" 
                    onClick={toggleEditMode}
                    disabled={loadingUpdate}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="success" 
                    onClick={handleUpdate}
                    disabled={loadingUpdate}
                  >
                    {loadingUpdate ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <Button 
                    variant="danger" 
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <i className="bi bi-trash me-1"></i>
                    Delete
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={toggleEditMode}
                  >
                    <i className="bi bi-pencil-square me-1"></i>
                    Edit
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Update notifications */}
          {updateSuccess && (
            <Message variant="success" dismissible>
              Application updated successfully!
            </Message>
          )}
          
          {updateError && (
            <Message variant="danger" dismissible>
              {updateError}
            </Message>
          )}
          
          {/* Main content */}
          <Row>
            {/* Left column: Application details */}
            <Col lg={8}>
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  {isEditing ? (
                    <Form>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Company *</Form.Label>
                            <Form.Control
                              type="text"
                              name="company"
                              value={formData.company}
                              onChange={handleChange}
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
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Next Steps</Form.Label>
                        <Form.Control
                          type="text"
                          name="nextSteps"
                          value={formData.nextSteps}
                          onChange={handleChange}
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
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Contact Person</Form.Label>
                        <Form.Select
                          name="contactId"
                          value={formData.contactId}
                          onChange={handleChange}
                        >
                          <option value="">-- No Contact Selected --</option>
                          {contacts.map(c => (
                            <option key={c._id} value={c._id}>
                              {c.name} {c.company ? `(${c.company})` : ''}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Form>
                  ) : (
                    <>
                      <div className="mb-4">
                        <Badge bg={getStatusColor(application.status)} className="fs-6 mb-3">
                          {application.status}
                        </Badge>
                        
                        <Row className="mb-2">
                          <Col md={4} className="fw-bold">Application Date</Col>
                          <Col md={8}>{formatDate(application.applicationDate)}</Col>
                        </Row>
                        
                        {application.location && (
                          <Row className="mb-2">
                            <Col md={4} className="fw-bold">Location</Col>
                            <Col md={8}>{application.location}</Col>
                          </Row>
                        )}
                        
                        {application.salary && (
                          <Row className="mb-2">
                            <Col md={4} className="fw-bold">Salary</Col>
                            <Col md={8}>{application.salary}</Col>
                          </Row>
                        )}
                        
                        {application.jobLink && (
                          <Row className="mb-2">
                            <Col md={4} className="fw-bold">Job Link</Col>
                            <Col md={8}>
                              <a href={application.jobLink} target="_blank" rel="noopener noreferrer">
                                {application.jobLink} <i className="bi bi-box-arrow-up-right"></i>
                              </a>
                            </Col>
                          </Row>
                        )}
                        
                        {application.nextSteps && (
                          <Row className="mb-2">
                            <Col md={4} className="fw-bold">Next Steps</Col>
                            <Col md={8}>{application.nextSteps}</Col>
                          </Row>
                        )}
                        
                        {contact && (
                          <Row className="mb-2">
                            <Col md={4} className="fw-bold">Contact Person</Col>
                            <Col md={8}>
                              <Link to={`/contacts/${contact._id}`}>
                                {contact.name} {contact.position && contact.company ? `- ${contact.position} at ${contact.company}` : contact.company ? `- ${contact.company}` : contact.position ? `- ${contact.position}` : ''}
                              </Link>
                            </Col>
                          </Row>
                        )}
                      </div>
                      
                      {application.notes && (
                        <div className="mb-4">
                          <h4>Notes</h4>
                          <p className="mb-0 text-pre-wrap">{application.notes}</p>
                        </div>
                      )}
                      
                      {application.jobDescription && (
                        <div>
                          <h4>Job Description</h4>
                          <p className="mb-0 text-pre-wrap">{application.jobDescription}</p>
                        </div>
                      )}
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
            
            {/* Right column: Timeline and actions */}
            <Col lg={4}>
              <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Application Timeline</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex mb-3">
                    <div className="me-3">
                      <Badge bg="success" className="rounded-circle p-2">
                        <i className="bi bi-check"></i>
                      </Badge>
                    </div>
                    <div>
                      <div className="fw-bold">Application Created</div>
                      <div className="text-muted small">
                        {formatDate(application.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-flex mb-3">
                    <div className="me-3">
                      <Badge bg={getStatusColor(application.status)} className="rounded-circle p-2">
                        <i className="bi bi-check"></i>
                      </Badge>
                    </div>
                    <div>
                      <div className="fw-bold">Status: {application.status}</div>
                      <div className="text-muted small">
                        Last updated: {formatDate(application.updatedAt)}
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
              
              <Card className="shadow-sm">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Quick Actions</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-grid gap-2">
                    {application.jobLink && (
                      <Button
                        variant="outline-primary"
                        href={application.jobLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="bi bi-link-45deg me-2"></i>
                        View Job Posting
                      </Button>
                    )}
                    
                    {contact && (
                      <Button
                        variant="outline-info"
                        as={Link}
                        to={`/contacts/${contact._id}`}
                      >
                        <i className="bi bi-person-lines-fill me-2"></i>
                        View Contact Details
                      </Button>
                    )}
                    
                    <Button
                      variant="outline-secondary"
                      as={Link}
                      to="/applications"
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Back to Applications
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {/* Delete Confirmation Modal */}
          <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete this application for <strong>{application.position}</strong> at <strong>{application.company}</strong>? This action cannot be undone.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete} disabled={loadingDelete}>
                {loadingDelete ? 'Deleting...' : 'Delete Application'}
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <Message>Application not found.</Message>
      )}
    </Container>
  );
};

export default ApplicationDetail; 