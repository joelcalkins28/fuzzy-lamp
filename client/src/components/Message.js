/**
 * Message component for displaying alerts and notifications
 * Used for feedback, errors, and status updates
 */
import React from 'react';
import { Alert } from 'react-bootstrap';

/**
 * Message component displays alert message
 * @param {Object} props Component props
 * @param {string} props.variant Alert type (danger, success, etc.)
 * @param {string|React.ReactNode} props.children Alert content
 * @param {boolean} props.dismissible Whether alert can be dismissed
 */
const Message = ({ variant = 'info', children, dismissible = false }) => {
  return (
    <Alert variant={variant} dismissible={dismissible}>
      {children}
    </Alert>
  );
};

export default Message; 