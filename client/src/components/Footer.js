/**
 * Footer component for the application
 * Displays copyright information and additional links
 */
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

/**
 * Footer component displaying copyright information
 * Fixed at the bottom of the page
 */
const Footer = () => {
  return (
    <footer className="bg-dark text-white py-3 mt-auto">
      <Container>
        <Row>
          <Col className="text-center">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} Job Search CRM | fuzzy-lamp
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 