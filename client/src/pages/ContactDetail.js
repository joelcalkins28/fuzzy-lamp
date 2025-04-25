/**
 * ContactDetail page component
 * Displays detailed information for a specific contact with edit capabilities
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
  Modal,
  ListGroup
} from 'react-bootstrap';
import { contactApi, applicationApi } from '../utils/api';
import Loader from '../components/Loader';
import Message from '../components/Message';
import ApplicationCard from '../components/ApplicationCard';

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
 * ContactDetail component for viewing and editing a specific contact
 */
const ContactDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State for contact data
  const [contact, setContact] = useState(null);
  const [relatedApplications, setRelatedApplications] = useState([]);
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
  
  // Fetch contact and related data
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        setLoading(true);
        const contactData = await contactApi.getById(id);
        setContact(contactData);
        
        // Initialize form data for editing
        setFormData({
          name: contactData.name,
          company: contactData.company || '',
          position: contactData.position || '',
          email: contactData.email || '',
          phone: contactData.phone || '',
          linkedIn: contactData.linkedIn || '',
          relationship: contactData.relationship,
          notes: contactData.notes || '',
          lastContactDate: contactData.lastContactDate ? new Date(contactData.lastContactDate).toISOString().split('T')[0] : ''
        });
        
        // Fetch related applications
        try {
          const applicationsData = await applicationApi.getAll();
          const related = applicationsData.filter(app => app.contactId === id);
          setRelatedApplications(related);
        } catch (applicationsError) {
          console.error('Error fetching related applications:', applicationsError);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching contact:', error);
        setError('Could not load contact details. Please try again.');
        setLoading(false);
      }
    };
    
    fetchContactData();
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
    if (isEditing && contact) {
      setFormData({
        name: contact.name,
        company: contact.company || '',
        position: contact.position || '',
        email: contact.email || '',
        phone: contact.phone || '',
        linkedIn: contact.linkedIn || '',
        relationship: contact.relationship,
        notes: contact.notes || '',
        lastContactDate: contact.lastContactDate ? new Date(contact.lastContactDate).toISOString().split('T')[0] : ''
      });
    }
  };
  
  /**
   * Submit updates to the contact
   */
  const handleUpdate = async () => {
    try {
      setLoadingUpdate(true);
      setUpdateError(null);
      
      const updatedContact = await contactApi.update(id, formData);
      
      setContact(updatedContact);
      setUpdateSuccess(true);
      setLoadingUpdate(false);
      
      // Exit edit mode after successful update
      setTimeout(() => {
        setIsEditing(false);
        setUpdateSuccess(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error updating contact:', error);
      setUpdateError('Failed to update contact. Please try again.');
      setLoadingUpdate(false);
    }
  };
  
  /**
   * Delete the contact
   */
  const handleDelete = async () => {
    try {
      setLoadingDelete(true);
      
      await contactApi.delete(id);
      
      setShowDeleteModal(false);
      
      // Redirect to contacts list
      navigate('/contacts', { state: { message: 'Contact deleted successfully' } });
      
    } catch (error) {
      console.error('Error deleting contact:', error);
      setShowDeleteModal(false);
      setError('Failed to delete contact. Please try again.');
      setLoadingDelete(false);
    }
  };
  
  // Format date for display
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
      ) : contact ? (
        <>
          {/* Header with title and actions */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="mb-1">{contact.name}</h1>
              {(contact.position || contact.company) && (
                <h3 className="text-muted">
                  {contact.position} {contact.position && contact.company && 'at'} {contact.company}
                </h3>
              )}
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
              Contact updated successfully!
            </Message>
          )}
          
          {updateError && (
            <Message variant="danger" dismissible>
              {updateError}
            </Message>
          )}
          
          {/* Main content */}
          <Row>
            {/* Left column: Contact details */}
            <Col lg={8}>
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  {isEditing ? (
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
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
                    </Form>
                  ) : (
                    <>
                      <div className="mb-4">
                        <Badge bg={getRelationshipColor(contact.relationship)} className="fs-6 mb-3">
                          {contact.relationship}
                        </Badge>
                        
                        <ListGroup variant="flush">
                          {contact.email && (
                            <ListGroup.Item className="ps-0">
                              <Row>
                                <Col md={3} className="fw-bold">
                                  <i className="bi bi-envelope me-2"></i>
                                  Email
                                </Col>
                                <Col md={9}>
                                  <a href={`mailto:${contact.email}`}>
                                    {contact.email}
                                  </a>
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          )}
                          
                          {contact.phone && (
                            <ListGroup.Item className="ps-0">
                              <Row>
                                <Col md={3} className="fw-bold">
                                  <i className="bi bi-telephone me-2"></i>
                                  Phone
                                </Col>
                                <Col md={9}>
                                  <a href={`tel:${contact.phone}`}>
                                    {contact.phone}
                                  </a>
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          )}
                          
                          {contact.linkedIn && (
                            <ListGroup.Item className="ps-0">
                              <Row>
                                <Col md={3} className="fw-bold">
                                  <i className="bi bi-linkedin me-2"></i>
                                  LinkedIn
                                </Col>
                                <Col md={9}>
                                  <a href={contact.linkedIn} target="_blank" rel="noopener noreferrer">
                                    {contact.linkedIn} <i className="bi bi-box-arrow-up-right"></i>
                                  </a>
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          )}
                          
                          {contact.lastContactDate && (
                            <ListGroup.Item className="ps-0">
                              <Row>
                                <Col md={3} className="fw-bold">
                                  <i className="bi bi-calendar-check me-2"></i>
                                  Last Contact
                                </Col>
                                <Col md={9}>
                                  {formatDate(contact.lastContactDate)}
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          )}
                        </ListGroup>
                      </div>
                      
                      {contact.notes && (
                        <div>
                          <h4>Notes</h4>
                          <p className="mb-0 text-pre-wrap">{contact.notes}</p>
                        </div>
                      )}
                    </>
                  )}
                </Card.Body>
              </Card>
              
              {/* Related Applications */}
              <Card className="shadow-sm">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Related Applications</h5>
                </Card.Header>
                <Card.Body>
                  {relatedApplications.length === 0 ? (
                    <p className="text-muted mb-0">
                      No applications linked to this contact yet.
                    </p>
                  ) : (
                    <Row>
                      {relatedApplications.map(application => (
                        <Col key={application._id} md={6} className="mb-3">
                          <ApplicationCard application={application} />
                        </Col>
                      ))}
                    </Row>
                  )}
                </Card.Body>
              </Card>
            </Col>
            
            {/* Right column: Actions and timeline */}
            <Col lg={4}>
              <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Quick Actions</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-grid gap-2">
                    {contact.email && (
                      <Button
                        variant="outline-primary"
                        href={`mailto:${contact.email}`}
                      >
                        <i className="bi bi-envelope me-2"></i>
                        Send Email
                      </Button>
                    )}
                    
                    {contact.phone && (
                      <Button
                        variant="outline-primary"
                        href={`tel:${contact.phone}`}
                      >
                        <i className="bi bi-telephone me-2"></i>
                        Call
                      </Button>
                    )}
                    
                    {contact.linkedIn && (
                      <Button
                        variant="outline-primary"
                        href={contact.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="bi bi-linkedin me-2"></i>
                        View LinkedIn Profile
                      </Button>
                    )}
                    
                    <Button
                      variant="outline-success"
                      as={Link}
                      to="/applications/add"
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Add Application with this Contact
                    </Button>
                    
                    <Button
                      variant="outline-secondary"
                      as={Link}
                      to="/contacts"
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Back to Contacts
                    </Button>
                  </div>
                </Card.Body>
              </Card>
              
              <Card className="shadow-sm">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Contact Timeline</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex mb-3">
                    <div className="me-3">
                      <Badge bg="success" className="rounded-circle p-2">
                        <i className="bi bi-check"></i>
                      </Badge>
                    </div>
                    <div>
                      <div className="fw-bold">Contact Created</div>
                      <div className="text-muted small">
                        {formatDate(contact.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  {contact.lastContactDate && (
                    <div className="d-flex mb-3">
                      <div className="me-3">
                        <Badge bg="info" className="rounded-circle p-2">
                          <i className="bi bi-calendar"></i>
                        </Badge>
                      </div>
                      <div>
                        <div className="fw-bold">Last Contact</div>
                        <div className="text-muted small">
                          {formatDate(contact.lastContactDate)}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="d-flex mb-3">
                    <div className="me-3">
                      <Badge bg="secondary" className="rounded-circle p-2">
                        <i className="bi bi-pencil"></i>
                      </Badge>
                    </div>
                    <div>
                      <div className="fw-bold">Last Updated</div>
                      <div className="text-muted small">
                        {formatDate(contact.updatedAt)}
                      </div>
                    </div>
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
              Are you sure you want to delete the contact <strong>{contact.name}</strong>? This action cannot be undone.
              
              {relatedApplications.length > 0 && (
                <div className="alert alert-warning mt-3">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  This contact is linked to {relatedApplications.length} application(s). Deleting this contact will remove the connection to these applications.
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete} disabled={loadingDelete}>
                {loadingDelete ? 'Deleting...' : 'Delete Contact'}
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <Message>Contact not found.</Message>
      )}
    </Container>
  );
};

export default ContactDetail; 