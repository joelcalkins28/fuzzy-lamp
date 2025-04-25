/**
 * Loader component for displaying loading spinner
 * Used during data fetching and async operations
 */
import React from 'react';
import { Spinner } from 'react-bootstrap';

/**
 * Loader component displays centered spinner
 * @param {Object} props Component props
 * @param {string} props.size Size of spinner (sm, md, lg)
 * @param {string} props.variant Color variant (primary, secondary, etc.)
 */
const Loader = ({ size = 'lg', variant = 'primary' }) => {
  return (
    <div className="text-center py-3">
      <Spinner 
        animation="border" 
        role="status" 
        size={size}
        variant={variant}
        style={{ width: '50px', height: '50px' }}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default Loader; 