/**
 * API utilities for making requests to the backend server
 * Provides functions for CRUD operations on applications and contacts
 */
import axios from 'axios';

// Get the backend API URL - use environment variable in production or default to relative path
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Application API functions
 */
export const applicationApi = {
  /**
   * Get all applications
   * @returns {Promise} Promise with applications data
   */
  getAll: async () => {
    try {
      const response = await api.get('/api/applications');
      return response.data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error.response ? error.response.data : new Error('Error fetching applications');
    }
  },
  
  /**
   * Get application by ID
   * @param {string} id Application ID 
   * @returns {Promise} Promise with application data
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/api/applications/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error fetching application');
    }
  },
  
  /**
   * Create new application
   * @param {Object} applicationData Application data
   * @returns {Promise} Promise with created application
   */
  create: async (applicationData) => {
    try {
      const response = await api.post('/api/applications', applicationData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error creating application');
    }
  },
  
  /**
   * Update application
   * @param {string} id Application ID
   * @param {Object} applicationData Updated application data
   * @returns {Promise} Promise with updated application
   */
  update: async (id, applicationData) => {
    try {
      const response = await api.put(`/api/applications/${id}`, applicationData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error updating application');
    }
  },
  
  /**
   * Delete application
   * @param {string} id Application ID
   * @returns {Promise} Promise with deletion result
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/api/applications/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error deleting application');
    }
  }
};

/**
 * Contact API functions
 */
export const contactApi = {
  /**
   * Get all contacts
   * @returns {Promise} Promise with contacts data
   */
  getAll: async () => {
    try {
      const response = await api.get('/api/contacts');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error fetching contacts');
    }
  },
  
  /**
   * Get contact by ID
   * @param {string} id Contact ID 
   * @returns {Promise} Promise with contact data
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/api/contacts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error fetching contact');
    }
  },
  
  /**
   * Create new contact
   * @param {Object} contactData Contact data
   * @returns {Promise} Promise with created contact
   */
  create: async (contactData) => {
    try {
      const response = await api.post('/api/contacts', contactData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error creating contact');
    }
  },
  
  /**
   * Update contact
   * @param {string} id Contact ID
   * @param {Object} contactData Updated contact data
   * @returns {Promise} Promise with updated contact
   */
  update: async (id, contactData) => {
    try {
      const response = await api.put(`/api/contacts/${id}`, contactData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error updating contact');
    }
  },
  
  /**
   * Delete contact
   * @param {string} id Contact ID
   * @returns {Promise} Promise with deletion result
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/api/contacts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error deleting contact');
    }
  }
}; 