/**
 * ContactsList page component
 * Displays all contacts with filtering and sorting options
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
import { contactApi } from '../utils/api';
import Loader from '../components/Loader';
import Message from '../components/Message';
import ContactCard from '../components/ContactCard';

/**
 * Relationship options for filtering
 */
const RELATIONSHIP_OPTIONS = [
  'All',
  'Recruiter',
  'Hiring Manager',
  'Team Member',
  'Referral',
  'Networking',
  'Other'
];

/**
 * Sort options for contacts
 */
const SORT_OPTIONS = [
  { value: 'nameAsc', label: 'Name (A-Z)' },
  { value: 'nameDesc', label: 'Name (Z-A)' },
  { value: 'companyAsc', label: 'Company (A-Z)' },
  { value: 'companyDesc', label: 'Company (Z-A)' },
  { value: 'recentAsc', label: 'Recently Added' }
];

/**
 * ContactsList component displays all contacts with filter and sort options
 */
const ContactsList = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [relationshipFilter, setRelationshipFilter] = useState('All');
  const [sortOption, setSortOption] = useState('nameAsc');

  // Fetch contacts on component mount
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const data = await contactApi.getAll();
        setContacts(data);
        setFilteredContacts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        setError('Failed to load contacts. Please try again.');
        setLoading(false);
      }
    };
    
    fetchContacts();
  }, []);

  // Filter and sort contacts when filter criteria change
  useEffect(() => {
    let result = [...contacts];
    
    // Apply relationship filter
    if (relationshipFilter !== 'All') {
      result = result.filter(contact => contact.relationship === relationshipFilter);
    }
    
    // Apply search term filter
    if (searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        contact => 
          contact.name.toLowerCase().includes(search) ||
          (contact.company && contact.company.toLowerCase().includes(search)) ||
          (contact.position && contact.position.toLowerCase().includes(search)) ||
          (contact.email && contact.email.toLowerCase().includes(search))
      );
    }
    
    // Apply sorting
    result = sortContacts(result, sortOption);
    
    setFilteredContacts(result);
  }, [contacts, searchTerm, relationshipFilter, sortOption]);

  /**
   * Sort contacts based on selected sort option
   * @param {Array} contactsList Contacts to sort
   * @param {string} option Sort option
   * @returns {Array} Sorted contacts
   */
  const sortContacts = (contactsList, option) => {
    const sorted = [...contactsList];
    
    switch (option) {
      case 'nameAsc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'nameDesc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'companyAsc':
        return sorted.sort((a, b) => {
          if (!a.company) return 1;
          if (!b.company) return -1;
          return a.company.localeCompare(b.company);
        });
      case 'companyDesc':
        return sorted.sort((a, b) => {
          if (!a.company) return 1;
          if (!b.company) return -1;
          return b.company.localeCompare(a.company);
        });
      case 'recentAsc':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
   * Handle relationship filter selection
   * @param {string} relationship Selected relationship
   */
  const handleRelationshipFilterChange = (relationship) => {
    setRelationshipFilter(relationship);
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
        <h1>Contacts</h1>
        <LinkContainer to="/contacts/add">
          <Button variant="success">
            <i className="bi bi-person-plus me-2"></i>
            Add Contact
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
                  placeholder="Search by name, company, position, or email"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </InputGroup>
            </Col>
            
            <Col md={3} sm={6} className="mb-3 mb-md-0">
              <DropdownButton
                variant="outline-secondary"
                title={`Relationship: ${relationshipFilter}`}
                className="w-100"
              >
                {RELATIONSHIP_OPTIONS.map(relationship => (
                  <Dropdown.Item 
                    key={relationship} 
                    onClick={() => handleRelationshipFilterChange(relationship)}
                    active={relationshipFilter === relationship}
                  >
                    {relationship}
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
          
          {/* Contacts grid */}
          {filteredContacts.length === 0 ? (
            <Message>
              No contacts found. {contacts.length > 0 ? 'Try changing your filters.' : 'Add your first contact to get started.'}
            </Message>
          ) : (
            <>
              <p className="text-muted mb-3">
                Showing {filteredContacts.length} {filteredContacts.length === 1 ? 'contact' : 'contacts'}
              </p>
              
              <Row>
                {filteredContacts.map(contact => (
                  <Col key={contact._id} lg={4} md={6} className="mb-4">
                    <ContactCard contact={contact} />
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

export default ContactsList; 