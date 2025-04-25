/**
 * Header component with navigation menu
 * Provides application-wide navigation through a responsive Navbar
 */
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

/**
 * Header component for application-wide navigation
 * Uses Bootstrap navbar with responsive toggle for mobile
 */
const Header = () => {
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Job Search CRM</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <LinkContainer to="/">
                <Nav.Link>Dashboard</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/applications">
                <Nav.Link>Applications</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/contacts">
                <Nav.Link>Contacts</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header; 