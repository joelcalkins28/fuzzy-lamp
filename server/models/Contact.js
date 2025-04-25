/**
 * @description Contact model for tracking professional contacts
 * Stores information about people connected to job applications or networking
 */

const mongoose = require('mongoose');

/**
 * @description Schema for professional contacts
 * Includes name, company, contact information, and relationship data
 */
const contactSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Contact name is required'],
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  position: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },
  phone: {
    type: String,
    trim: true
  },
  linkedIn: {
    type: String,
    trim: true
  },
  relationship: {
    type: String,
    enum: ['Recruiter', 'Hiring Manager', 'Team Member', 'Referral', 'Networking', 'Other'],
    default: 'Other'
  },
  notes: {
    type: String,
    trim: true
  },
  lastContactDate: {
    type: Date
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // Will be required once user authentication is implemented
    // required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

/**
 * @description Creates a method to transform data when returned as JSON
 * Ensures consistent response structure for APIs
 */
contactSchema.methods.toJSON = function() {
  const contact = this.toObject();
  return contact;
};

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact; 