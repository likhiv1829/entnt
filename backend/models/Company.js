const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  linkedInProfile: { type: String },
  emails: [String],
  phoneNumbers: [String],
  comments: { type: String },
  communicationPeriodicity: {
    type: String,
    enum: [
      'Does not repeat', 
      'Daily', 
      'Weekly on Friday', 
      'Monthly on the first Friday',
      'Annually on January 3', 
      'Every weekday (Monday to Friday)', 
      'Custom...'
    ],
    default: 'Does not repeat',
  },
  customRecurrence: {
    frequency: { type: Number, default: 1 },
    unit: { type: String, enum: ['week', 'month', 'year'], default: 'week' },
    endDate: { type: Date, default: null },
    occurrences: { type: Number, default: 0 },
  },
  communications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunicationMethod',
  }],
});

module.exports = mongoose.model('Company', companySchema);
