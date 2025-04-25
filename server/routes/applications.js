/**
 * @description API routes for job application CRUD operations
 * Provides endpoints for creating, reading, updating, and deleting job applications
 */

const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

/**
 * @description Get all applications
 * @route GET /api/applications
 * @access Private (will be once auth is implemented)
 */
router.get('/', async (req, res) => {
  try {
    const applications = await Application.find({}).sort({ applicationDate: -1 });
    res.json(applications);
  } catch (error) {
    console.error(`Error fetching applications: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @description Get application by ID
 * @route GET /api/applications/:id
 * @access Private (will be once auth is implemented)
 */
router.get('/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.json(application);
  } catch (error) {
    console.error(`Error fetching application: ${error.message}`);
    
    // Check if error is due to invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @description Create a new application
 * @route POST /api/applications
 * @access Private (will be once auth is implemented)
 */
router.post('/', async (req, res) => {
  try {
    const {
      company,
      position,
      jobDescription,
      jobLink,
      location,
      salary,
      applicationDate,
      status,
      nextSteps,
      notes,
      contactId
    } = req.body;
    
    // Create new application
    const application = new Application({
      company,
      position,
      jobDescription,
      jobLink,
      location,
      salary,
      applicationDate: applicationDate || Date.now(),
      status: status || 'Bookmarked',
      nextSteps,
      notes,
      contactId
      // user: req.user.id // Will add once auth is implemented
    });
    
    const savedApplication = await application.save();
    res.status(201).json(savedApplication);
  } catch (error) {
    console.error(`Error creating application: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @description Update an application
 * @route PUT /api/applications/:id
 * @access Private (will be once auth is implemented)
 */
router.put('/:id', async (req, res) => {
  try {
    const {
      company,
      position,
      jobDescription,
      jobLink,
      location,
      salary,
      applicationDate,
      status,
      nextSteps,
      notes,
      contactId
    } = req.body;
    
    // Build application update object
    const applicationUpdate = {};
    if (company !== undefined) applicationUpdate.company = company;
    if (position !== undefined) applicationUpdate.position = position;
    if (jobDescription !== undefined) applicationUpdate.jobDescription = jobDescription;
    if (jobLink !== undefined) applicationUpdate.jobLink = jobLink;
    if (location !== undefined) applicationUpdate.location = location;
    if (salary !== undefined) applicationUpdate.salary = salary;
    if (applicationDate !== undefined) applicationUpdate.applicationDate = applicationDate;
    if (status !== undefined) applicationUpdate.status = status;
    if (nextSteps !== undefined) applicationUpdate.nextSteps = nextSteps;
    if (notes !== undefined) applicationUpdate.notes = notes;
    if (contactId !== undefined) applicationUpdate.contactId = contactId;
    
    // Find and update the application
    let application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Ensure user owns application (once auth is implemented)
    // if (application.user.toString() !== req.user.id) {
    //   return res.status(401).json({ message: 'Not authorized' });
    // }
    
    application = await Application.findByIdAndUpdate(
      req.params.id,
      { $set: applicationUpdate },
      { new: true }
    );
    
    res.json(application);
  } catch (error) {
    console.error(`Error updating application: ${error.message}`);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @description Delete an application
 * @route DELETE /api/applications/:id
 * @access Private (will be once auth is implemented)
 */
router.delete('/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Ensure user owns application (once auth is implemented)
    // if (application.user.toString() !== req.user.id) {
    //   return res.status(401).json({ message: 'Not authorized' });
    // }
    
    await Application.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Application removed' });
  } catch (error) {
    console.error(`Error deleting application: ${error.message}`);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 