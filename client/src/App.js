/**
 * Main application component that sets up routing
 * Contains the main layout and navigation structure
 */
import React from 'react';
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

/**
 * App component - Main application entry point
 * Sets up routing and main layout structure
 */
function App() {
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
