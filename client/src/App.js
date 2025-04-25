/**
 * Main application component that sets up routing
 * Contains the main layout and navigation structure
 */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Import components and pages (to be created)
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import ApplicationsList from './pages/ApplicationsList';
import ApplicationDetail from './pages/ApplicationDetail';
import AddApplication from './pages/AddApplication';
import ContactsList from './pages/ContactsList';
import ContactDetail from './pages/ContactDetail';
import AddContact from './pages/AddContact';
import Message from './components/Message';

/**
 * App component - Main application entry point
 * Sets up routing and main layout structure
 */
function App() {
  const [apiStatus, setApiStatus] = useState({ loading: true, error: null });

  // Check API connection on startup
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        console.log('Checking API connection...');
        const apiUrl = process.env.REACT_APP_API_URL || '';
        console.log('API URL:', apiUrl);
        
        const response = await fetch(`${apiUrl}/api/applications`);
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API connection successful', data);
        setApiStatus({ loading: false, error: null });
      } catch (error) {
        console.error('API connection error:', error);
        setApiStatus({ 
          loading: false, 
          error: `Could not connect to the API: ${error.message}. Please check the console for more details.`
        });
      }
    };

    checkApiConnection();
  }, []);

  // Show any API connection errors
  if (apiStatus.error) {
    return (
      <div className="container mt-5">
        <Message variant="danger">
          <h3>Connection Error</h3>
          <p>{apiStatus.error}</p>
          <hr />
          <p>
            Debug info: <br />
            API URL: {process.env.REACT_APP_API_URL || 'Not set (using relative path)'}
          </p>
        </Message>
      </div>
    );
  }

  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <Header />
        <main className="container py-4 flex-grow-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/applications" element={<ApplicationsList />} />
            <Route path="/applications/:id" element={<ApplicationDetail />} />
            <Route path="/applications/add" element={<AddApplication />} />
            <Route path="/contacts" element={<ContactsList />} />
            <Route path="/contacts/:id" element={<ContactDetail />} />
            <Route path="/contacts/add" element={<AddContact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
