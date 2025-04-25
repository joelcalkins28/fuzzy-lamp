/**
 * @description Application model for tracking job applications
 * Stores information about job opportunities, application status, and related data
 */

const mongoose = require('mongoose');

/**
 * @description Schema for job applications
 * Includes company name, position, application date, status, and other relevant fields
 */
const applicationSchema = mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  position: {
    type: String,
    required: [true, 'Position title is required'],
    trim: true
  },
  jobDescription: {
    type: String,
    trim: true
  },
  jobLink: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  salary: {
    type: String,
    trim: true
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    required: true,
    enum: ['Bookmarked', 'Applied', 'Phone Screen', 'Interview', 'Technical Assessment', 'Offer', 'Rejected', 'Accepted', 'Withdrawn'],
    default: 'Bookmarked'
  },
  nextSteps: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact'
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
applicationSchema.methods.toJSON = function() {
  const application = this.toObject();
  return application;
};

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application; 