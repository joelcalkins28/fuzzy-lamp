/**
 * @description API routes for contact CRUD operations
 * Provides endpoints for creating, reading, updating, and deleting professional contacts
 */

const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

/**
 * @description Get all contacts
 * @route GET /api/contacts
 * @access Private (will be once auth is implemented)
 */
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ name: 1 });
    res.json(contacts);
  } catch (error) {
    console.error(`Error fetching contacts: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @description Get contact by ID
 * @route GET /api/contacts/:id
 * @access Private (will be once auth is implemented)
 */
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.json(contact);
  } catch (error) {
    console.error(`Error fetching contact: ${error.message}`);
    
    // Check if error is due to invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @description Create a new contact
 * @route POST /api/contacts
 * @access Private (will be once auth is implemented)
 */
router.post('/', async (req, res) => {
  try {
    const {
      name,
      company,
      position,
      email,
      phone,
      linkedIn,
      relationship,
      notes,
      lastContactDate
    } = req.body;
    
    // Create new contact
    const contact = new Contact({
      name,
      company,
      position,
      email,
      phone,
      linkedIn,
      relationship: relationship || 'Other',
      notes,
      lastContactDate
      // user: req.user.id // Will add once auth is implemented
    });
    
    const savedContact = await contact.save();
    res.status(201).json(savedContact);
  } catch (error) {
    console.error(`Error creating contact: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @description Update a contact
 * @route PUT /api/contacts/:id
 * @access Private (will be once auth is implemented)
 */
router.put('/:id', async (req, res) => {
  try {
    const {
      name,
      company,
      position,
      email,
      phone,
      linkedIn,
      relationship,
      notes,
      lastContactDate
    } = req.body;
    
    // Build contact update object
    const contactUpdate = {};
    if (name !== undefined) contactUpdate.name = name;
    if (company !== undefined) contactUpdate.company = company;
    if (position !== undefined) contactUpdate.position = position;
    if (email !== undefined) contactUpdate.email = email;
    if (phone !== undefined) contactUpdate.phone = phone;
    if (linkedIn !== undefined) contactUpdate.linkedIn = linkedIn;
    if (relationship !== undefined) contactUpdate.relationship = relationship;
    if (notes !== undefined) contactUpdate.notes = notes;
    if (lastContactDate !== undefined) contactUpdate.lastContactDate = lastContactDate;
    
    // Find and update the contact
    let contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    // Ensure user owns contact (once auth is implemented)
    // if (contact.user.toString() !== req.user.id) {
    //   return res.status(401).json({ message: 'Not authorized' });
    // }
    
    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactUpdate },
      { new: true }
    );
    
    res.json(contact);
  } catch (error) {
    console.error(`Error updating contact: ${error.message}`);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @description Delete a contact
 * @route DELETE /api/contacts/:id
 * @access Private (will be once auth is implemented)
 */
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    // Ensure user owns contact (once auth is implemented)
    // if (contact.user.toString() !== req.user.id) {
    //   return res.status(401).json({ message: 'Not authorized' });
    // }
    
    await Contact.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Contact removed' });
  } catch (error) {
    console.error(`Error deleting contact: ${error.message}`);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 